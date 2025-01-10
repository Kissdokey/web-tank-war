interface ITankAppearanceInfo {
  width: number;
  height: number;
  gunWidth: number;
  gunHeight: number;
}
interface IBasicTank {
  id: string;
  name?: string;
  x?: number;
  y?: number;
  maxSpeed?: number;
  dir?: number;
  rotateSpeed?: number;
  health?: number;
  appearance?: ITankAppearanceInfo;
  inerti?: number;
}

interface ITank extends IBasicTank {}

const INITIAL_TANK_WIDTH = 48;
const INITIAL_TANK_HEIGHT = 48;
const INITIAL_TANK_GUN_WIDTH = 12;
const INITIAL_TANK_GUN_HIGHT = 16;
const INITIAL_TANK_SPEED = 2;
const INITIAL_TANK_HEALTH = 100;
const INITIAL_TANKTE_ROTATE_SPEEAD = 1;

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
  constructor(initial?: ITank) {
    this.id = initial?.id || "lijian";
    this.name = initial?.name || "tank";
    this.maxSpeed = initial?.maxSpeed || INITIAL_TANK_SPEED;
    this.rotateSpeed = initial?.rotateSpeed || INITIAL_TANKTE_ROTATE_SPEEAD;
    this.health = initial?.health || INITIAL_TANK_HEALTH;
    this.appearance = initial?.appearance || {
      width: INITIAL_TANK_WIDTH,
      height: INITIAL_TANK_HEIGHT,
      gunWidth: INITIAL_TANK_GUN_WIDTH,
      gunHeight: INITIAL_TANK_GUN_HIGHT,
    };
    this.dir = initial?.dir || 90;
    this.x = initial?.x || 0
    this.y = initial?.y || 0
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
