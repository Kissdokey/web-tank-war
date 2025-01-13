// 初始版本坦克视作会旋转的矩形，障碍物也是矩形，这样子可以采用SAT(分离轴定理)来对两个矩形进行精确的判断相交，其中可以使用AABB进行初次筛选.暂时不考虑碰撞检测后的位置纠正

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
type Rectangle = Point[];

function getAxes(rect: Rectangle): Point[] {
  // 获取矩形的所有分离轴
  const axes: Point[] = [];
  for (let i = 0; i < rect.length; i++) {
    const p1 = rect[i];
    const p2 = rect[(i + 1) % rect.length];
    const edge: Point = [p2[0] - p1[0], p2[1] - p1[1]];
    const normal: Point = [-edge[1], edge[0]];
    const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
    axes.push([normal[0] / length, normal[1] / length]);
  }
  return axes;
}

function project(rect: Rectangle, axis: Point): [number, number] {
  // 将矩形投影到轴上
  const dots = rect.map((point) => point[0] * axis[0] + point[1] * axis[1]);
  return [Math.min(...dots), Math.max(...dots)];
}

function overlap(proj1: [number, number], proj2: [number, number]): boolean {
  // 检测两个投影是否重叠
  return !(proj1[1] <= proj2[0] || proj2[1] <= proj1[0]);
}

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
}

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

export function satCollision(rect1: Rectangle, rect2: Rectangle): boolean {
  // 使用SAT算法检测两个矩形是否相交
  const axes1 = getAxes(rect1);
  const axes2 = getAxes(rect2);
  const axes = [...axes1, ...axes2];

  for (const axis of axes) {
    const proj1 = project(rect1, axis);
    const proj2 = project(rect2, axis);
    if (!overlap(proj1, proj2)) {
      return false;
    }
  }
  return true;
}

export const checkRectSatCollission = (
  info1: RectBasicInfo,
  info2: RectBasicInfo
) => {
  const rect1 = transToRect(info1);
  const rect2 = transToRect(info2);
  return satCollision(rect1, rect2);
};

interface IVectorPoint {
  x: number;
  y: number;
}
interface IVectorRectangle {
  corners: IVectorPoint[]; // 矩形的四个顶点顺序为：左上，右上，右下，左下
}
function vectorSubtract(a: IVectorPoint, b: IVectorPoint): IVectorPoint {
  return { x: a.x - b.x, y: a.y - b.y };
}

function vectorAdd(a: IVectorPoint, b: IVectorPoint): IVectorPoint {
  return { x: a.x + b.x, y: a.y + b.y };
}

function vectorDot(a: IVectorPoint, b: IVectorPoint): number {
  return a.x * b.x + a.y * b.y;
}

function vectorScale(v: IVectorPoint, s: number): IVectorPoint {
  return { x: v.x * s, y: v.y * s };
}

function vectorLength(v: IVectorPoint): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function getShortestVectorToEdge(
  point: IVectorPoint,
  edgeStart: IVectorPoint,
  edgeEnd: IVectorPoint
): IVectorPoint {
  const edgeVector = vectorSubtract(edgeEnd, edgeStart);
  const pointVector = vectorSubtract(point, edgeStart);
  const edgeLengthSquared = vectorDot(edgeVector, edgeVector);
  const t = Math.max(
    0,
    Math.min(1, vectorDot(pointVector, edgeVector) / edgeLengthSquared)
  );
  const projection = vectorAdd(edgeStart, vectorScale(edgeVector, t));
  return vectorSubtract(projection, point);
}

export function getShortestVector(
  point: IVectorPoint,
  rect: IVectorRectangle
): IVectorPoint {
  let shortestVector: IVectorPoint = getShortestVectorToEdge(
    point,
    rect.corners[0],
    rect.corners[1]
  );
  let shortestDistance = vectorLength(shortestVector);

  for (let i = 1; i < rect.corners.length; i++) {
    const edgeStart = rect.corners[i];
    const edgeEnd = rect.corners[(i + 1) % rect.corners.length];
    const vectorToEdge = getShortestVectorToEdge(point, edgeStart, edgeEnd);
    const distanceToEdge = vectorLength(vectorToEdge);

    if (distanceToEdge < shortestDistance) {
      shortestVector = vectorToEdge;
      shortestDistance = distanceToEdge;
    }
  }
  return shortestVector;
}

function vectorNormalize(v: IVectorPoint): IVectorPoint {
  const length = vectorLength(v);
  return { x: v.x / length, y: v.y / length };
}
function reflectVector(v: IVectorPoint, normal: IVectorPoint): IVectorPoint {
  const dotProduct = vectorDot(v, normal);
  const scaledNormal = vectorScale(normal, 2 * dotProduct);
  return vectorSubtract(v, scaledNormal);
}

export function getReflectedAngle(dir: number, wallVector: IVectorPoint): number {
  // 将dir转换为弧度
  const dirRadians = dir * (Math.PI / 180);

  // 子弹的初始方向向量
  const bulletVector: IVectorPoint = {
    x: Math.cos(dirRadians),
    y: Math.sin(dirRadians),
  };

  // 墙面的法线向量
  const normal = vectorNormalize({ x: -wallVector.y, y: wallVector.x });

  // 计算反射后的方向向量
  const reflectedVector = reflectVector(bulletVector, normal);

  // 计算反射后的角度
  let reflectedAngle =
    Math.atan2(reflectedVector.y, reflectedVector.x) * (180 / Math.PI);

  // 确保反射角度在0-360度范围内
  if (reflectedAngle < 0) {
    reflectedAngle += 360;
  }
  
  return reflectedAngle;
}
