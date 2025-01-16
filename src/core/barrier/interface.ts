import type { BasicObject } from "../interface";

// 障碍物得基本属性
export interface IBasicBarrier extends BasicObject {
  id?: string;
  health?: number; // 生命值，有的障碍物可以被子弹销毁
  isInvissible?: boolean; // 是否可被销毁，默认为true不可销毁
}
