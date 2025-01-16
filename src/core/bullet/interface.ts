import type { BasicObject } from "../interface"

export interface IBasicBullet extends BasicObject{
    id?: string
    size?: number
    damage?: number
    speed?: number
    dir: number
    maxReflectionTimes?: number
    maxRange?: number
}