import { tankEventBus, type TankEventType } from "@/event/eventBus";
import { DEFAULT_KEY_SETTINGS, EPlayer } from "./constans";
import type { ITankOperator, OperatorEvenType } from "./type";
import { getEventParams } from "./utils";
export class KeyBoardManager {
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
    console.log("bind-event");
    window.addEventListener("keydown", (e) => {
      // 判断key是哪个player的，然后通过绑定的tank-id传递给总管理者，再对具体的tank执行操作
      this.handleKeyEvent(e, true);
    });
    window.addEventListener("keyup", (e) => {
      // 判断key是哪个player的，然后通过绑定的tank-id传递给总管理者，再对具体的tank执行操作
      this.handleKeyEvent(e, false);
    });
  }
  handleKeyEvent(e: KeyboardEvent, isStart = true) {
    this.playerKeysMap.forEach((operator, player) => {
      Object.entries(operator).forEach((op) => {
        const [type, key] = op;
        if (key === e.key) {
          const eType = type as OperatorEvenType;
          e.preventDefault();
          e.stopPropagation();
          const tankid = this.playerTankMap.get(player) || "";
          const event = getEventParams(eType)
          tankEventBus.emit(event.eventType as TankEventType, {
            target: tankid,
            isStart,
            ...event.eventParams,
          });
        }
      });
    });
  }
  bindPlayerTank(player: EPlayer, tankid: string) {
    this.playerTankMap.set(player, tankid);
  }
}
export const keyBoardManager = new KeyBoardManager();

