import mitt from 'mitt'
interface IBasicTankEmitterParams {
    target: string 
    isStart: boolean;
}

export interface IAttackParams extends IBasicTankEmitterParams{}
export interface IMoveParams extends IBasicTankEmitterParams{
    isForward: boolean
}
export interface IRotateParams extends IBasicTankEmitterParams{
    isClockWise: boolean
}

type TankEventEmitterType =  {
  attack: IAttackParams
  move: IMoveParams
  rotate: IRotateParams
}
export type TankEventType = keyof TankEventEmitterType
export const tankEventBus = mitt<TankEventEmitterType>()