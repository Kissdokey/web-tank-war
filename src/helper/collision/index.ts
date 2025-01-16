// 初始版本坦克视作会旋转的矩形，障碍物也是矩形，这样子可以采用SAT(分离轴定理)来对两个矩形进行精确的判断相交，其中可以使用AABB进行初次筛选.暂时不考虑碰撞检测后的位置纠正

import { satCollision } from "./sat";

export const preCheckCollision = (id1: string, id2: string) => {
  const dom1 = document.getElementById(`${id1}`);
  const dom2 = document.getElementById(`${id2}`);
  if (!dom1 || !dom2) return false;
  const rect1 = dom1.getBoundingClientRect();
  const rect2 = dom2.getBoundingClientRect();
  if (
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom ||
    rect1.left > rect2.right ||
    rect1.right < rect2.left
  ) {
    return false;
  }
  return true;
};

type Point = [number, number];



export function getRectFromTopLeft(
  x = 0,
  y = 0,
  width = 0,
  height = 0
): Point[] {
  return [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
}

function rotatePoint(point: Point, angle: number, center: Point): Point {
  const rad = angle * (Math.PI / 180); // 角度转弧度
  const cos = Math.cos(rad);
  const sin = -Math.sin(rad);
  const [cx, cy] = center;
  const [px, py] = point;

  // 计算相对于中心点的偏移量
  const dx = px - cx;
  const dy = py - cy;

  // 使用旋转矩阵旋转点
  const x = dx * cos - dy * sin;
  const y = dx * sin + dy * cos;

  // 将旋转后的点加回到中心点得到最终坐标
  return [x + cx, y + cy];
}

export function rotateRectangle(rect: Point[], angle: number = 0): Point[] {
  // 找到矩形的中心点
  const centerX = (rect[0][0] + rect[2][0]) / 2;
  const centerY = (rect[0][1] + rect[2][1]) / 2;
  const center: Point = [centerX, centerY];

  // 旋转每个顶点
  return rect.map((point) => rotatePoint(point, angle, center));
}

export interface RectBasicInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  deg?: number;
  isRadius?: boolean;
}
export interface ICircle {
  x: number;
  y: number;
  radius: number;
}
export const transToCircle = (info: RectBasicInfo): ICircle => {
  return {
    x: info.x + info.width / 2,
    y: info.y + info.height / 2,
    radius: info.width / 2,
  };
};
export const transToVectorRect = (info: RectBasicInfo): IVectorPoint[] => {
  const rect = transToRect(info);
  return rect.map(([x, y]) => {
    return {
      x,
      y,
    };
  });
};
export const transToRect = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  deg = 0,
}: RectBasicInfo) => {
  let rect = getRectFromTopLeft(x, y, width, height);
  return rotateRectangle(rect, deg);
};

function circleRectCollision(circle: ICircle, rectangle: IVectorPoint[]) {
  if (rectangle.length !== 4) {
    throw new Error("Rectangle must have exactly 4 points.");
  }
  let edge 

  // 检查最近点方法：找到距离圆心最近的矩形边上的点
  let closestPoint: IVectorPoint = { x: circle.x, y: circle.y };
  let minDistanceSquared = Infinity;

  rectangle.forEach((point, i) => {
    const nextPoint = rectangle[(i + 1) % 4]; // 获取矩形边的端点

    // 计算圆心到矩形边的最近点
    const closest = getClosestPointOnLineSegment(circle, point, nextPoint);

    // 计算距离平方，避免浮点计算开销
    const distanceSquared = (closest.x - circle.x) ** 2 + (closest.y - circle.y) ** 2;

    if (distanceSquared < minDistanceSquared) {
      closestPoint = closest;
      minDistanceSquared = distanceSquared;
      edge = {
        x: nextPoint.x - point.x,
        y: nextPoint.y - point.y
      }
    }
  });

  // 判断最近距离是否小于等于圆的半径平方
  return {
    isCollision: minDistanceSquared <= circle.radius ** 2,
    vector: edge
  }
}

/**
 * 计算点到线段上的最近点
 */
function getClosestPointOnLineSegment(circle: ICircle, pointA: IVectorPoint, pointB: IVectorPoint): IVectorPoint {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const lengthSquared = dx ** 2 + dy ** 2;

  if (lengthSquared === 0) return pointA; // 线段退化为点

  // 投影圆心到线段上的比例参数 t
  let t = ((circle.x - pointA.x) * dx + (circle.y - pointA.y) * dy) / lengthSquared;

  // 限制 t 在 [0, 1] 之间
  t = Math.max(0, Math.min(1, t));

  return { x: pointA.x + t * dx, y: pointA.y + t * dy };
}


export const checkRectSatCollission = (
  info1: RectBasicInfo,
  info2: RectBasicInfo
) => {
  // 两个矩形
  if (!info1.isRadius && !info2.isRadius) {
    const rect1 = transToRect(info1);
    const rect2 = transToRect(info2);
    return {
      isCollision: satCollision(rect1, rect2),
      vector: {
        x: 0,
        y: 0
      }
    }
  }
  // 两个圆
  if (info1.isRadius && info2.isRadius) {
  }
  // 一圆一方
  const circle = transToCircle(info1.isRadius ? info1 : info2);
  const rect = transToVectorRect(info1.isRadius ? info2 : info1);
  return circleRectCollision(circle, rect);
};

interface IVectorPoint {
  x: number;
  y: number;
}



