type Vector2D = { x: number; y: number };

/**
 * 将角度转换为弧度
 * @param degrees 角度
 * @returns 弧度
 */
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 计算反射角度
 * @param bulletAngle 子弹入射角度（度）
 * @param normal 平面法向量 {x, y}
 * @returns 反弹角度（度）
 */
export function calculateReflectionAngle(
  bulletAngle: number,
  normal: Vector2D
): number {
  // 我只想要看效果
  // 确定是水平的还是垂直的
  let isHorizontal = Math.abs(normal.x) > 0;
  if (isHorizontal) {
    return 360 - bulletAngle;
  } else {
    if (bulletAngle < 270 && bulletAngle > 90) {
      // 从右往左射入竖直平面
      return bulletAngle < 180 ? 180 - bulletAngle : 540 - bulletAngle;
    } else {
      // 从左往右射入竖直平面
      return bulletAngle < 90 ? 180 - bulletAngle : 540 - bulletAngle;
    }
  }
}
