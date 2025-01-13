// 考虑将各种对象类传入，内部进行初始化， or依赖倒置，将对象直接传入
import { keyBoardManager } from "@/event/keyboad/keyboard";
import { EPlayer } from "@/event/keyboad/constans";
import type { BasicTank } from "./tank/BasicTank";
import {
  tankEventBus,
  type IAttackParams,
  type IMoveParams,
  type IRotateParams,
} from "@/event/eventBus";
import { BasicBarrier } from "./barrier/BasicBarrier";
export interface Position {
  x: number;
  y: number;
}
export class GameManager {
  tankPositionMap: Map<string, Position> = new Map();
  tankContainer: Map<string, BasicTank> = new Map();
  barrierContainer: Map<string, BasicBarrier> = new Map()
  animationMap: Map<string, boolean> = new Map();
  constructor({ tankContainer, barrierContainer }: { tankContainer: Map<string, BasicTank>, barrierContainer: Map<string, BasicBarrier> }) {
    // 需要完成地图、地形障碍物、玩家坦克的初始化并传入，manager本身不负责初始化，但是负责各个物体的交互和信息传递
    this.tankContainer = tankContainer; // 这里为了响应式所以把ref监听的map传入进行初始化，这样修改ref即可界面更新
    this.barrierContainer = barrierContainer
    this.init();
  }
  init() {
    // 并且完成各种键盘事件绑定
    this.bindKeyBoardEvent();
    // 初始化场景
    this.initTheme()
  }
  bindKeyBoardEvent() {
    tankEventBus.on("attack", this.handleAttack.bind(this));
    tankEventBus.on("move", this.handleMove.bind(this));
    tankEventBus.on("rotate", this.handleRotate.bind(this));
  }
  initTheme() {
    // 初始化障碍物
    this.initBarriers()
  }
  initBarriers() {
    const testBarrier = new BasicBarrier({
        x: 300,
        y: 700
    })
    const testBarrier2 = new BasicBarrier({
        x: 700,
        y: 300
    })
    this.addBarrier(testBarrier)
    this.addBarrier(testBarrier2)
  }
  addBarrier(barrier: BasicBarrier) {
    this.barrierContainer.set(barrier.id, barrier)
  }
  addTank(tank: BasicTank, belongs?: EPlayer) {
    this.tankContainer.set(tank.id, tank);
    if (belongs) {
      console.log(belongs, tank.id);
      keyBoardManager.bindPlayerTank(belongs, tank.id);
    }
  }
  handleAttack(param: IAttackParams) {}

  handleMove(param: IMoveParams) {
    const { target: tankid, isStart, isForward } = param;
    const animationKey = `${tankid}-move-${isForward ? "t" : "f"}`;
    const moveCb = () => {
      const tank = this.tankContainer.get(tankid);
      if (tank) {
        // 根据坦克的资料计算它下一帧的位置
        // 根据计算出来的位置，和全局其他物品的状态，进行碰撞检测// 静态物体直接判断即可， 动态物体则需要多一步
        // 检测完毕对位置进行可能的矫正
        // 更新坦克位置
        const { x, y } = tank;
        const frameDistance = isForward ? tank.maxSpeed : -tank.maxSpeed;
        const deg = (tank.dir / 180) * Math.PI;
        let nextX = x + Math.cos(deg) * frameDistance;
        let nextY = y - Math.sin(deg) * frameDistance;
        tank.x = nextX;
        tank.y = nextY;
      }
    };
    this.handleAnimation(animationKey, isStart, moveCb);
  }

  handleRotate(param: IRotateParams) {
    const { target: tankid, isStart, isClockWise } = param;
    const animationKey = `${tankid}-rotate-${isClockWise ? "t" : "f"}`;
    const rotate = () => {
      const tank = this.tankContainer.get(tankid);
      if (tank) {
        const currentDir = tank.dir;
        const delta = isClockWise ? -tank.rotateSpeed : tank.rotateSpeed;
        const nextDir = (currentDir + delta + 360) % 360;
        tank.dir = nextDir;
      }
    };
    this.handleAnimation(animationKey, isStart, rotate);
  }

  handleAnimation(animationKey: string, isStart: boolean, cb: () => void) {
    const isAnimating = this.animationMap.get(animationKey);
    if (!isStart) {
      // 取消动画
      this.animationMap.delete(animationKey);
      return;
    }
    // 判断是否在执行动画中
    if (isAnimating) {
      return;
    }
    // 开始动画
    const animationFn = () => {
      cb();
      if (!this.animationMap.has(animationKey)) return;
      window.requestAnimationFrame(animationFn);
    };
    this.animationMap.set(animationKey, true);
    window.requestAnimationFrame(animationFn);
  }
}
