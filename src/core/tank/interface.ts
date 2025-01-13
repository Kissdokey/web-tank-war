export interface ITankAppearanceInfo {
  gunWidth: number;
  gunHeight: number;
}
export interface IBasicTank {
  id?: string;
  name?: string;
  x?: number;
  y?: number;
  maxSpeed?: number;
  dir?: number;
  rotateSpeed?: number;
  health?: number;
  width?: number;
  height?: number;
  appearance?: ITankAppearanceInfo;
  inerti?: number;
  attackInterval?: number
}

export interface ITank extends IBasicTank {}