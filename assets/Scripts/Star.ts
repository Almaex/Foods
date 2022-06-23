const {ccclass, property} = cc._decorator
@ccclass
export default class Star extends cc.Component {
    @property(cc.AudioClip) hitAudio: cc.AudioClip = null
    @property(cc.AudioClip) goneAudio: cc.AudioClip = null
    private _bottom: number

    onLoad() {
        this._bottom = (-cc.winSize.height / 2 + this.node.height / 2)
        this.node.on(cc.Node.EventType.TOUCH_START, this.onButton, this)
    }
    onButton() {
        this.node.emit("star_hit")
        cc.audioEngine.play(this.hitAudio, false, 0.5)
        this.node.getComponent(cc.Animation).play()
    }
    private _checkFoodGone() {
        if (this.node.y < this._bottom) {
            cc.audioEngine.play(this.goneAudio, false, 0.5)
            this.node.emit("food_gone")
            this.node.destroy()
        }
    }
    onDestroyItem() { this.node.destroy() }
    update (dt)     { this._checkFoodGone() }
}
