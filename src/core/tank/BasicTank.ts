import {
  INITIAL_TANK_ATTACK_INTERVAL,
  INITIAL_TANK_GUN_HIGHT,
  INITIAL_TANK_GUN_WIDTH,
  INITIAL_TANK_HEALTH,
  INITIAL_TANK_HEIGHT,
  INITIAL_TANK_SPEED,
  INITIAL_TANK_WIDTH,
  INITIAL_TANKTE_ROTATE_SPEEAD,
} from "@/core/constant";
import type { ITank, ITankAppearanceInfo } from "./interface";
import { getUuid } from "@/helper/random/uuid";



export class BasicTank {
  id: string;
  name: string;
  maxSpeed: number;
  rotateSpeed: number;
  health: number;
  appearance: ITankAppearanceInfo;
  inerti?: number;
  dir: number;
  x: number;
  y: number;
  width: number
  height: number
  attackInterval: number
  maxHealth: number
  isRadius: boolean
  constructor(initial?: ITank) {
    this.id = initial?.id || getUuid();
    this.name = initial?.name || "tank";
    this.maxSpeed = initial?.maxSpeed || INITIAL_TANK_SPEED;
    this.rotateSpeed = initial?.rotateSpeed || INITIAL_TANKTE_ROTATE_SPEEAD;
    this.health = initial?.health || INITIAL_TANK_HEALTH;
    this.maxHealth = this.health
    this.appearance = initial?.appearance || {
      gunWidth: INITIAL_TANK_GUN_WIDTH,
      gunHeight: INITIAL_TANK_GUN_HIGHT,
    };
    this.width = initial?.width || INITIAL_TANK_WIDTH,
    this.height = initial?.height || INITIAL_TANK_HEIGHT,
    this.dir = initial?.dir || 90;
    this.x = initial?.x || 0;
    this.y = initial?.y || 0;
    this.attackInterval = initial?.attackInterval || INITIAL_TANK_ATTACK_INTERVAL
    this.isRadius = false
  }
  rotate() {
    // 前置判断是否可以旋转,按照一帧约16ms旋转角度来进行旋转, 包括旋转后是否会和墙碰撞，坦克实时会动，移动前检测碰撞无用
    // let nextDir = this.dir + this.rotateSpeed
    // mapCtrl.judgecolliption()
    // 旋转后判断影响来
    // 子弹碰撞， 坦克碰撞（位置矫正）
    // tankCtrl.judgecolliption()
    // bulletCtrl.judgecolliption()
  }

  move() {}
}

export class EpTank extends BasicTank {
  test() {
    console.log(111);
  }
}
