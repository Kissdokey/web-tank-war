// 障碍物得基本属性
export interface IBasicBarrier {
  id?: string;
  x?: number;
  y?: number; // 所有的对象使用同一个坐标参考系所以这里的x,y都代表不了具体的位置，但是物体之间进行距离计算可以进行比较
  health?: number; // 生命值，有的障碍物可以被子弹销毁
  isInvissible?: boolean; // 是否可被销毁，默认为true不可销毁
  width?: number;
  height?: number;
}
