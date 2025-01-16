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