// 考虑将各种对象类传入，内部进行初始化， or依赖倒置，将对象直接传入
import { keyBoardManager } from "@/event/keyboad/keyboard";
import { EPlayer } from "@/event/keyboad/constans";
import { BasicTank } from "./tank/BasicTank";
import {
  tankEventBus,
  type IAttackParams,
  type IMoveParams,
  type IRotateParams,
} from "@/event/eventBus";
import { BasicBarrier } from "./barrier/BasicBarrier";
import {
  checkRectSatCollission,
  getRectFromTopLeft,
  getReflectedAngle,
  getShortestVector,
  preCheckCollision,
} from "@/helper/collision";
import { clone } from "lodash";
import { BasicBullet } from "./bullet/BasicBullet";
import { INITIAL_BULLET_SIZE } from "./constant";
export interface Position {
  x: number;
  y: number;
}
export class GameManager {
  tankPositionMap: Map<string, Position> = new Map();
  tankContainer: Map<string, BasicTank> = new Map();
  bulletContainer: Map<string, BasicBullet> = new Map();
  barrierContainer: Map<string, BasicBarrier> = new Map();
  animationMap: Map<string, boolean> = new Map();
  tankAttackRecordMap: Map<string, number> = new Map();
  constructor({
    tankContainer,
    barrierContainer,
    bulletContainer,
  }: {
    tankContainer: Map<string, BasicTank>;
    barrierContainer: Map<string, BasicBarrier>;
    bulletContainer: Map<string, BasicBullet>;
  }) {
    // 需要完成地图、地形障碍物、玩家坦克的初始化并传入，manager本身不负责初始化，但是负责各个物体的交互和信息传递
    this.tankContainer = tankContainer; // 这里为了响应式所以把ref监听的map传入进行初始化，这样修改ref即可界面更新
    this.barrierContainer = barrierContainer;
    this.bulletContainer = bulletContainer;
    this.init();
  }
  init() {
    // 并且完成各种键盘事件绑定
    this.bindKeyBoardEvent();
    // 初始化场景
    this.initTheme();
    // 初始化子弹动画执行函数
    this.initBulletAnimation();
  }
  bindKeyBoardEvent() {
    tankEventBus.on("attack", this.handleAttack.bind(this));
    tankEventBus.on("move", this.handleMove.bind(this));
    tankEventBus.on("rotate", this.handleRotate.bind(this));
  }
  initTheme() {
    // 初始化障碍物
    this.initBarriers();
  }
  initBarriers() {
    const testBarrier = new BasicBarrier({
      x: 300,
      y: 700,
    });
    const testBarrier2 = new BasicBarrier({
      x: 700,
      y: 300,
    });
    const testBarrier3 = new BasicBarrier({
      x: 0,
      y: 0,
      width: 1000,
      height: 20,
    });
    const testBarrier4 = new BasicBarrier({
      x: 0,
      y: 980,
      width: 1000,
      height: 20,
    });
    const testBarrier5 = new BasicBarrier({
      x: 0,
      y: 20,
      width: 20,
      height: 960,
    });
    const testBarrier6 = new BasicBarrier({
      x: 1000,
      y: 0,
      width: 20,
      height: 1000,
    });
    this.addBarrier(testBarrier);
    this.addBarrier(testBarrier2);
    this.addBarrier(testBarrier3);
    this.addBarrier(testBarrier4);
    this.addBarrier(testBarrier5);
    this.addBarrier(testBarrier6);
  }
  addBarrier(barrier: BasicBarrier) {
    this.barrierContainer.set(barrier.id, barrier);
  }
  addTank(tank: BasicTank, belongs?: EPlayer) {
    this.tankContainer.set(tank.id, tank);
    if (belongs) {
      console.log(belongs, tank.id);
      keyBoardManager.bindPlayerTank(belongs, tank.id);
    }
  }
  handleAttack(param: IAttackParams) {
    // 每隔一段时间发射一个子弹
    const { target: tankid, isStart } = param;
    if (!isStart) return;
    const tank = this.tankContainer.get(tankid);
    if (!tank) return;
    const lastAttackTime = this.tankAttackRecordMap.get(tank.id);
    const now = new Date().getTime();
    // 攻击间隔内返回
    if (lastAttackTime && now - lastAttackTime <= tank.attackInterval) {
      return;
    }
    const size = INITIAL_BULLET_SIZE;
    const tankCenter = {
      x: tank.x + tank.width / 2,
      y: tank.y + tank.height / 2,
    };
    const cos = Math.cos((tank.dir * Math.PI) / 180);
    const sin = Math.sin((tank.dir * Math.PI) / 180);
    const bullet = new BasicBullet({
      x: tankCenter.x + (tank.height / 2) * cos - size / 2,
      y: tankCenter.y - (tank.height / 2) * sin - size / 2,
      dir: tank.dir,
    });
    this.bulletContainer.set(bullet.id, bullet);
    this.tankAttackRecordMap.set(tank.id, now);
  }

  handleMove(param: IMoveParams) {
    const { target: tankid, isStart, isForward } = param;
    const animationKey = `${tankid}-move-${isForward ? "t" : "f"}`;
    const moveCb = () => {
      const tank = this.tankContainer.get(tankid);
      if (tank) {
        const { x, y } = tank;
        const frameDistance = isForward ? tank.maxSpeed : -tank.maxSpeed;
        const deg = (tank.dir / 180) * Math.PI;
        let nextX = x + Math.cos(deg) * frameDistance;
        let nextY = y - Math.sin(deg) * frameDistance;
        const cloneTank = clone(tank);
        (cloneTank.x = nextX), (cloneTank.y = nextY);
        let isHit = this.checkTankCollission(cloneTank);
        if (isHit) {
          return;
        }
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
        const cloneTank = clone(tank);
        cloneTank.dir = nextDir;
        let isHit = this.checkTankCollission(cloneTank);
        if (isHit) {
          return;
        }
        tank.dir = nextDir;
      }
    };
    this.handleAnimation(animationKey, isStart, rotate);
  }
  initBulletAnimation() {
    const bulletAnimationKey = "bullet-animation";
    const bulletAnimationCb = () => {
      this.bulletContainer.forEach((bullet, bulletid) => {
        const { x, y } = bullet;
        const frameDistance = bullet.speed;
        bullet.maxRange -= frameDistance;
        // 超出最远射程直接销毁
        if (bullet.maxRange <= 0) {
          this.bulletContainer.delete(bullet.id);
          return;
        }
        const deg = (bullet.dir / 180) * Math.PI;
        let nextX = x + Math.cos(deg) * frameDistance;
        let nextY = y - Math.sin(deg) * frameDistance;
        const cloneBullet = clone(bullet);
        cloneBullet.x = nextX;
        cloneBullet.y = nextY;
        let isHit = this.checkTankCollission(cloneBullet, {
          hitTankCb: (tankid) => {
            this.handleBulletHitTank(tankid, bulletid);
            this.bulletContainer.delete(bullet.id);
          },
          hitBarrierCb: (barrierid)=> {
            this.handleBulletHitBarrier(barrierid, bulletid)
          },
        });
        if (isHit) {
          return;
        }
        bullet.x = nextX;
        bullet.y = nextY;
      });
    };
    this.handleAnimation(bulletAnimationKey, true, bulletAnimationCb);
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
  checkTankCollission(
    obj: BasicTank | BasicBullet,
    cb?: {
      hitTankCb?: (tankid: string) => void;
      hitBarrierCb?: (barrierid: string) => void;
    }
  ) {
    // 遍历坦克，判断碰撞
    let isHitTank = false,
      tankid = "",
      barrierid = "";
    const objRectInfo = {
      x: obj.x,
      y: obj.y,
      width: obj.width,
      height: obj.height,
      deg: obj.dir,
    };
    this.tankContainer.forEach((_tank, _) => {
      if (obj.id === _tank.id) {
        return;
      }
      let isAabbHit = preCheckCollision(obj.id, _tank.id);
      if (!isAabbHit) return;
      const isSatHit = checkRectSatCollission(objRectInfo, {
        x: _tank.x,
        y: _tank.y,
        width: _tank.width,
        height: _tank.height,
        deg: _tank.dir,
      });
      if (isSatHit) {
        console.log("sat hit");
        isHitTank = true;
        tankid = _tank.id;
      }
    });
    // 遍历障碍物，判断碰撞
    //TODO，优化算法减少计算
    let isHitBarrier = false;
    this.barrierContainer.forEach((barrier, _) => {
      let isAabbHit = preCheckCollision(obj.id, barrier.id);
      if (!isAabbHit) return;
      const isSatHit = checkRectSatCollission(objRectInfo, {
        x: barrier.x,
        y: barrier.y,
        width: barrier.width,
        height: barrier.height,
      });
      if (isSatHit) {
        console.log("sat hit");
        isHitBarrier = true;
        barrierid = barrier.id;
      }
    });
    isHitBarrier && cb?.hitBarrierCb && cb?.hitBarrierCb(barrierid);
    isHitTank && cb?.hitTankCb && cb?.hitTankCb(tankid);
    return isHitTank || isHitBarrier;
  }
  handleBulletHitTank(tankid: string, bulletid: string) {
    const tank = this.tankContainer.get(tankid);
    const bullet = this.bulletContainer.get(bulletid);
    if (!tank || !bullet) return;
    const remainHealth = tank.health - bullet.damage;
    if (remainHealth <= 0) {
      this.tankContainer.delete(tankid);
      return;
    }
    tank.health = remainHealth;
  }
  handleBulletHitBarrier(barrierid: string, bulletid: string) {
    const barrier = this.barrierContainer.get(barrierid);
    const bullet = this.bulletContainer.get(bulletid);
    if (!barrier || !bullet) return;
    bullet.maxReflection -= 1;
    if (bullet.maxReflection < 0) {
      this.bulletContainer.delete(bulletid);
      return;
    }
    // 确定碰撞的墙面向量，然后将子弹方向反弹
    const barrierCorners = getRectFromTopLeft(
      barrier.x,
      barrier.y,
      barrier.width,
      barrier.height
    ).map(([x, y]) => {
      return {
        x,
        y,
      };
    });
    const barrierVector = getShortestVector(
      {
        x: bullet.x,
        y: bullet.y,
      },
      {
        corners: barrierCorners,
      }
    );
    bullet.dir = (getReflectedAngle(bullet.dir, barrierVector) + 180) % 360;
    console.log(barrierCorners, barrierVector, bullet.dir)
  }
}
