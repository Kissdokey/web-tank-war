// 初始版本坦克视作会旋转的矩形，障碍物也是矩形，这样子可以采用SAT(分离轴定理)来对两个矩形进行精确的判断相交，其中可以使用AABB进行初次筛选.暂时不考虑碰撞检测后的位置纠正

export const preCheckCollision = (id1: string, id2: string)=> {
    const dom1 = document.querySelector(id1)
    const dom2 = document.querySelector(id2)
    if(!dom1 || !dom2) return false
    const rect1 = dom1.getBoundingClientRect()
    const rect2 = dom2.getBoundingClientRect()
    if(rect1.bottom < rect2.top || rect1.top > rect2.bottom || rect1.left > rect2.right || rect1.right < rect2.left) {
        return false
    }
    return true
}
// 确定两个矩形的边向量： 确定旋转角度即可确定。确定四个点到原点距离
export const checkCollision = ()=> {

}