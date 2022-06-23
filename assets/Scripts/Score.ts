const {ccclass, property} = cc._decorator
@ccclass
export default class Score extends cc.Component {
    @property(cc.Label) score: cc.Label = null
    @property(cc.Label) lifes: cc.Label = null
    
    updateScore(s) { this.score.string = `Score: ${s}` }
    updateLife(l)  { this.lifes.string = `Lifes: ${l}` }
}