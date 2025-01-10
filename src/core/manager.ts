// 考虑将各种对象类传入，内部进行初始化， or依赖倒置，将对象直接传入
import { EPlayer, keyBoardManager } from "@/event/keyboard";
import type { BasicTank } from "./tank/BasicTank";
import {
  keyboardEventBus,
  type IAttackParams,
  type IMoveParams,
  type IRotateParams,
} from "@/event/eventBus";
export interface Position {
  x: number;
  y: number;
}
export class GameManager {
  tankPositionMap: Map<string, Position> = new Map();
  tankContainer: Map<string, BasicTank> = new Map();
  animationMap: Map<string, boolean> = new Map();
  constructor({
    tankContainer,
  }: {
    tankContainer: Map<string, BasicTank>;
  }) {
    // 需要完成地图、地形障碍物、玩家坦克的初始化并传入，manager本身不负责初始化，但是负责各个物体的交互和信息传递
    this.tankContainer = tankContainer;
    this.init();
  }
  init() {
    // 并且完成各种键盘事件绑定
    this.bindKeyBoardEvent();
  }
  bindKeyBoardEvent() {
    keyboardEventBus.on("attack", this.handleAttack.bind(this));
    keyboardEventBus.on("move", this.handleMove.bind(this));
    keyboardEventBus.on("rotate", this.handleRotate.bind(this));
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
      const tank = this.tankContainer.get(tankid);
      if (tank) {
        // 根据坦克的资料计算它下一帧的位置
        // 根据计算出来的位置，和全局其他物品的状态，进行碰撞检测// 静态物体直接判断即可， 动态物体则需要多一步
        // 检测完毕对位置进行可能的矫正
        // 更新坦克位置
        const { x, y } = tank;
        const frameDistance = isForward ? tank.maxSpeed : -tank.maxSpeed;
        const deg = (tank.dir / 180) * Math.PI
        let nextX = x + Math.cos(deg) * frameDistance;
        let nextY = y + Math.sin(deg) * frameDistance;
        tank.x = nextX
        tank.y = nextY
      }
      if (!this.animationMap.has(animationKey)) return;
      window.requestAnimationFrame(animationFn);
    };
    this.animationMap.set(animationKey, true);
    window.requestAnimationFrame(animationFn);
  }
  handleRotate(param: IRotateParams) {
    const { target: tankid, isStart, isClockWise } = param;
    const animationKey = `${tankid}-rotate-${isClockWise ? "t" : "f"}`;
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
        const tank = this.tankContainer.get(tankid);
        if (tank) {
         const currentDir = tank.dir
         const delta = isClockWise ? -tank.rotateSpeed : tank.rotateSpeed
         const nextDir =(currentDir + delta + 360) % 360
         tank.dir = nextDir
        }
        if (!this.animationMap.has(animationKey)) return;
        window.requestAnimationFrame(animationFn);
      };
      this.animationMap.set(animationKey, true);
      window.requestAnimationFrame(animationFn);

  }
}