import { Container, Graphics } from 'pixi.js'

class BackgroundGrid extends Container {
    constructor() {
        super()

        for (let i = 0; i < 11; i++) {
            let line = new Graphics()
            line.lineStyle(2, 0x333333)
            line.moveTo(i * 100, 0)
            line.lineTo(i * 100, 1000)
            this.addChild(line)
        }

        for (let i = 0; i < 11; i++) {
            let line = new Graphics()
            line.lineStyle(2, 0x333333)
            line.moveTo(0, i * 100)
            line.lineTo(1000, i * 100)
            this.addChild(line)
        }
    }
}

export default BackgroundGrid
