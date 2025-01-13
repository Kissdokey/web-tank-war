import { getUuid } from "@/helper/random/uuid"
import type { IBasicBullet } from "./interface"
import { INITIAL_BULLET_DAMAGE, INITIAL_BULLET_SIZE, INITIAL_BULLET_SPEED, MAX_BULLET_RANGE, MAX_BULLET_REFLECTION_TIMES } from "../constant"

export class BasicBullet {
    id: string
    x: number
    y: number 
    size: number
    damage: number
    speed: number
    dir: number
    maxRange: number
    maxReflection: number
    constructor(bullet: IBasicBullet) {
        this.id = bullet.id || getUuid()
        this.x = bullet.x 
        this.y = bullet.y 
        this.size = bullet.size || INITIAL_BULLET_SIZE
        this.damage = bullet.damage || INITIAL_BULLET_DAMAGE
        this.speed = bullet.speed || INITIAL_BULLET_SPEED
        this.dir = bullet.dir
        this.maxRange = bullet.maxRange || MAX_BULLET_RANGE
        this.maxReflection = bullet.maxReflectionTimes || MAX_BULLET_REFLECTION_TIMES
    }
    get width() {
        return this.size
    }
    get height() {
        return this.size
    }
}