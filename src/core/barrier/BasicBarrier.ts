import { INITIAL_BARRIER_HEIGHT, INITIAL_BARRIER_WIDTH } from "@/core/constant";
import type { IBasicBarrier } from "./interface";
import { getUuid } from "@/helper/random/uuid";

export class BasicBarrier {
    id: string
    x: number
    y: number 
    health?: number 
    isInvissible?: boolean 
    width: number
    height: number
    isRadius: boolean
    constructor(info: IBasicBarrier) {
        this.id = info.id || getUuid()
        this.x = info.x || 0
        this.y = info.y || 0
        this.health = info.health || Infinity
        this.isInvissible = info.isInvissible || true
        this.width = info.width || INITIAL_BARRIER_WIDTH
        this.height = info.height || INITIAL_BARRIER_HEIGHT
        this.isRadius = false
    }
}