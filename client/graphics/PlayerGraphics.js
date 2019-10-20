import * as PIXI from 'pixi.js'

class PlayerGraphics extends PIXI.Container {
    constructor(state) {
        super()
        this.nid = state.nid
        this.x = state.x
        this.y = state.y

        this.body = PIXI.Sprite.from('/images/ship-v5.png')
        this.body.scale.x = this.body.scale.y = 2
        this.body.anchor.x = this.body.anchor.y = 0.5
        this.addChild(this.body)
    }
}

export default PlayerGraphics
