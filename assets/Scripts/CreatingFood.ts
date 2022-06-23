const {ccclass, property} = cc._decorator
@ccclass
export default class CreatingFood extends cc.Component {
    @property(cc.Prefab) itemPrefab: cc.Prefab = null
    @property(cc.Prefab) starPrefab: cc.Prefab = null
    private itemNode: cc.Node = null
    private _speed: number = 10
    private _dt = 0

    moveFood() {
        cc.tween(this.createItem())
            .to(this._speed, {position: cc.v3(this.random_data() - this.itemNode.width / 2, - cc.winSize.height, 0)})
            .start()
    }
    createItem() {
        let isAddStar = Math.floor(Math.random() * 10) + 1 > 9
        this.itemNode = cc.instantiate(isAddStar ? this.starPrefab : this.itemPrefab)
        let pos = (cc.winSize.height / 2)
        let random = this.random_data()
        this.itemNode.setScale(0.5)
        this.itemNode.setPosition(random, pos)
        this.node.addChild(this.itemNode)
        this.itemNode.on(isAddStar ? 'food_gone' : 'food_gone', isAddStar ? this.foodGone : this.foodGone, this)
        this.itemNode.on(isAddStar ? 'star_hit' : 'food_hit', isAddStar ? this.starHit : this.foodHit, this)
        return this.itemNode
    }
    random_data() {
        const xMin = - cc.winSize.width / 2 + this.itemNode.width / 2
        const xMax = cc.winSize.width / 2 - this.itemNode.width / 2
        let random = xMin + Math.random() * ((xMax - xMin) )
        return random
    }
    resetSpeed() { this._speed = 10 }
    speedUp()    { this._speed -= 0.2 }
    onEnable()   { this.update }
    onDisable()  { return }
    starHit()    { this.node.emit("star") }
    foodHit()    { this.node.emit("hit") }
    foodGone()   { this.node.emit("gone") }
    update(dt)   {
        if((this._dt += dt) < 1) return
        this._dt = 0
        this.moveFood()
    } 
}