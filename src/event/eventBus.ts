import mitt from 'mitt'
interface IBasicKeyBoardEmitterParams {
    target: string 
    isStart: boolean;
}

export interface IAttackParams extends IBasicKeyBoardEmitterParams{}
export interface IMoveParams extends IBasicKeyBoardEmitterParams{
    isForward: boolean
}
export interface IRotateParams extends IBasicKeyBoardEmitterParams{
    isClockWise: boolean
}

type KeyBoardEmitterType =  {
  attack: IAttackParams
  move: IMoveParams
  rotate: IRotateParams
}
export type TankEventType = keyof KeyBoardEmitterType
export const keyboardEventBus = mitt<KeyBoardEmitterType>()