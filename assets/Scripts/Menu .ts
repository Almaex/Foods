const {ccclass, property} = cc._decorator
@ccclass
export default class Menu extends cc.Component {
    @property(cc.EditBox) editName: cc.EditBox = null
    @property(cc.Button) btnPlay: cc.Button = null
    @property(cc.Button) btnRating: cc.Button = null
    @property(cc.Node) mainMenu: cc.Node = null
    @property(cc.Node) ratingMenu: cc.Node = null
    @property(cc.Node) gameNode: cc.Node = null
    @property() maxCountRating: number = 999
    @property(cc.Node) contentNode: cc.Node = null
    @property(cc.Prefab) targetName: cc.Prefab = null
    private _player: string = ''
    private _rating: any

    onLoad () {
        this._player = cc.sys.localStorage.getItem('player')
        this._player == null ? this.editName.string = '' : this.editName.string = this._player
        this._rating = JSON.parse(cc.sys.localStorage.getItem('rating'))
        if (this._rating == null) {
            this._rating = new Array()
        }
        this.gameNode.on('end_game', this._endGame, this)
    }
    onClickBack() {
        this.gameNode.active = true
        this.mainMenu.active = true
        this.ratingMenu.active = false
    }
    onStart () {
        if (this.editName.string.length == 0) {
            this._menuEnabled(false)
            this.editName.placeholderFontColor = new cc.Color().fromHEX('#FF0000')
            setTimeout(function() {
                this.editName.placeholderFontColor = new cc.Color().fromHEX('#BBBBBB')
                this.menuEnabled(true)
            }.bind(this), 250)
            return
        }
        this._player = this.editName.string
        cc.sys.localStorage.setItem('player', this._player)
        this.node.emit("start")
    }
    onClickRating () {
        this.gameNode.active = false
        this.mainMenu.active = false
        this.ratingMenu.active = true
        this.contentNode.destroyAllChildren();
        if (this._rating.length > 0) {
            for (let i = 0; i < this._rating.length; i++) {
                let itemNode = cc.instantiate(this.targetName)
                this.contentNode.addChild(itemNode)
                let y = (-1) * itemNode.height * i 
                itemNode.setPosition(0, y)
                let str = this._getRatingString(i, this._rating[i].name, this._rating[i].val)
                itemNode.getComponent(cc.Label).string = str
            }
        }
    }
    private _menuEnabled (enable: boolean) {
        this.editName.enabled = enable
        this.btnPlay.enabled = enable
        this.btnRating.enabled = enable
    }
    private _getRatingString (num: number, name: string, val: number) {
        let sym = this.editName.maxLength - name.length
        let str = ''
        if (num < 9) {
            str = ' '
        }
        str = str + (num + 1) + '. ' + name
        if (sym > 0) {
            for (let i = 0; i < sym; i++) {
                str = str + ' '
            }
        }
        str = str + ' ' + val
        return str
    }
    private _endGame (score: number) {
        if (score > 0) {
            let resultGame = {name: this._player, val: score}
            this._rating.push(resultGame)
            this._rating.sort(function(a,b) {
                return b.val - a.val
            })
            if (this._rating.length > this.maxCountRating) {
                this._rating.pop()
            }
            cc.sys.localStorage.setItem('rating', JSON.stringify(this._rating))
        }
    }
}