const {ccclass, property} = cc._decorator
@ccclass
export default class Food extends cc.Component {
    @property(cc.AudioClip) hitAudio: cc.AudioClip = null
    @property(cc.AudioClip) goneAudio: cc.AudioClip = null
    @property([cc.SpriteFrame]) iconImages = new Array<cc.SpriteFrame>()
    private _bottom: number

    onLoad() { 
        this._bottom = (-cc.winSize.height / 2 + this.node.height / 2)
        this.node.on(cc.Node.EventType.TOUCH_START, this.onButton, this)
        this.node.getComponent(cc.Sprite).spriteFrame = this.randomSprite()
    }
    randomSprite(min = 0, max = 5) {
        let itemSprite = Math.floor(Math.random() * (max - min + 1)) + min
        return this.iconImages[itemSprite]
    }
    onButton() {
        this.node.emit("food_hit")
        cc.audioEngine.play(this.hitAudio, false, 0.5)
        this.node.getComponent(cc.Animation).play()
    }
    checkFoodGone() {
        if (this.node.y < this._bottom) {
            cc.audioEngine.play(this.goneAudio, false, 0.5)
            this.node.emit("food_gone")
            this.node.destroy()
        }
    }
    onDestroyItem() { this.node.destroy() }
    update (dt)     { this.checkFoodGone() }
}
