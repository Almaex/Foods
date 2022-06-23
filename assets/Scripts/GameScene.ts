import Score from "./Score"
import CreatingFood from "./CreatingFood"
const {ccclass, property} = cc._decorator
@ccclass
export default class Game extends cc.Component {
    @property(cc.Node) scoreBar: cc.Node = null
    @property(cc.Node) menuNode: cc.Node = null
    @property(cc.Node) gameOver: cc.Node = null
    @property(cc.Node) food: cc.Node = null
    @property() maxLife: number = 5
    private _life: number = 0
    private _score: number = 0

    onLoad() {
        this.food.on('gone', this._lifeDecrease, this)
        this.food.on('hit', this._addScore, this)
        this.food.on('star', this._starHeal, this)
        this._updateLife()
        this._updateScore()
        this.menuNode.on('start', this._onGame, this)
        this._initGame()
    }
    private _initGame() {
        this.food.getComponent(CreatingFood).enabled = false
        this.food.getComponent(CreatingFood).resetSpeed()
        this.menuNode.active = true
        this.gameOver.active = false
        this._resetGame()
    }
    private _resetGame() {
        this._life = this.maxLife
        this._updateLife()
        this._score = 0
        this._updateScore()
    }
    private _onGame() {
        this._resetGame()
        this.food.getComponent(CreatingFood).enabled = true
        this.menuNode.active = false
        this.gameOver.active = false      
    }
    private _onEndGame() {
        this.food.getComponent(CreatingFood).enabled = false
        this.food.getComponent(CreatingFood).resetSpeed()
        this.food.stopAllActions()
        this.food.destroyAllChildren()
        this.menuNode.active = true
        this.gameOver.active = true
        this.node.emit("end_game", this._score)
    }
    private _addScore() {
        this._score += 1
        this._updateScore()
        this.food.getComponent(CreatingFood).speedUp()
    }
    private _lifeDecrease() {
        this._life -= 1
        this._updateLife()
        if (this._life == 0) {
            this._onEndGame()
            return
        }
    }
    private _starHeal() {
        this._life += 2
        this._updateLife()
        this.food.getComponent(CreatingFood).resetSpeed()
    }
    private _updateLife()  { this.scoreBar.getComponent(Score).updateLife(this._life) }
    private _updateScore() { this.scoreBar.getComponent(Score).updateScore(this._score) }
    
}