export interface IBasicBullet {
    id?: string
    x: number
    y: number 
    size?: number
    damage?: number
    speed?: number
    dir: number
    maxReflectionTimes?: number
    maxRange?: number
}