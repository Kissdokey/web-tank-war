export interface ITankAppearanceInfo {
  width: number;
  height: number;
  gunWidth: number;
  gunHeight: number;
}
export interface IBasicTank {
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

export interface ITank extends IBasicTank {}