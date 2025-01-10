import { keyboardEventBus, type TankEventType } from "@/event/eventBus";
type Keys = KeyboardEvent["key"];
interface ITankOperator {
  forward: Keys;
  backward: Keys;
  clockwise: Keys;
  counterclockwise: Keys;
  attack: Keys;
}
type OperatorEvenType = keyof ITankOperator;
export enum EPlayer {
  PLAYER1 = 'player1',
  PLAYER2 = 'player2',
}
const DEFAULT_KEY_SETTINGS = {
  [EPlayer.PLAYER1]: {
    forward: "w",
    backward: "s",
    clockwise: "d",
    counterclockwise: "a",
    attack: " ",
  },
  [EPlayer.PLAYER2]: {
    forward: "ArrowUp",
    backward: "ArrowDown",
    clockwise: "ArrowRight",
    counterclockwise: "ArrowLeft",
    attack: "0",
  },
};
const isMoveType = (type: keyof ITankOperator)=> {
    return ['forward','backward'].includes(type)
}
const isRotateType = (type: keyof ITankOperator)=> {
    return ['clockwise','counterclockwise'].includes(type)
}
const isAttackType  = (type: keyof ITankOperator)=> {
    return ['attack'].includes(type)
}

export  class KeyBoardManager {
  playerKeysMap: Map<EPlayer, ITankOperator> = new Map();
  playerTankMap: Map<EPlayer, string> = new Map();
  constructor() {
    this.init();
  }
  init() {
    this.initPlayerKey();
    this.bindEvent();
  }
  initPlayerKey() {
    // TODO： 从store取出来优先使用
    this.playerKeysMap.set(
      EPlayer.PLAYER1,
      DEFAULT_KEY_SETTINGS[EPlayer.PLAYER1]
    );
    this.playerKeysMap.set(
      EPlayer.PLAYER2,
      DEFAULT_KEY_SETTINGS[EPlayer.PLAYER2]
    );
  }
  bindKeys(player: EPlayer, operator: ITankOperator) {
    // 判断当前player是否存在，如果存在则覆盖
    this.playerKeysMap.set(player, operator);
  }
  bindEvent() {
    console.log('bind-event')
    window.addEventListener("keydown", (e) => {
      // 判断key是哪个player的，然后通过绑定的tank-id传递给总管理者，再对具体的tank执行操作
      this.handleKeyEvent(e, true)
    });
    window.addEventListener("keyup", (e) => {
        // 判断key是哪个player的，然后通过绑定的tank-id传递给总管理者，再对具体的tank执行操作
          this.handleKeyEvent(e, false)
      });
  }
  handleKeyEvent(e: KeyboardEvent, isStart = true) {
    this.playerKeysMap.forEach((operator, player) => {
        Object.entries(operator).forEach((op) => {
          const [type, key] = op;
          if (key === e.key) {
            const eType = type as OperatorEvenType
            e.preventDefault();
            e.stopPropagation();
            const tankid = this.playerTankMap.get(player) || "";
            let eventType = 'attack', eventParams = {}
            if(isAttackType(eType)) {
                eventType = eType
            }
            if(isMoveType(eType)) {
                eventType = 'move'
                eventParams = {
                    isForward: eType === 'forward'
                }
            }
            if(isRotateType(eType)) {
                eventType = 'rotate'
                eventParams = {
                    isClockWise: eType === 'clockwise'
                }
            }
            keyboardEventBus.emit(eventType  as TankEventType, {
              target: tankid,
              isStart,
              ...eventParams
            });
          }
        });
      });
  }
  bindPlayerTank(player: EPlayer, tankid: string) {
    this.playerTankMap.set(player, tankid);
  }
}
export const keyBoardManager = new KeyBoardManager()
