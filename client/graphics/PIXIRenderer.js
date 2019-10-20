import * as PIXI from 'pixi.js'
import BackgroundGrid from './BackgroundGrid.js'

class PIXIRenderer {
    constructor() {
        // can't create the actual pixi renderer here, because
        // this constructor is called before the window has loaded
        // so we call init() instead, after the window loads
    }

    init() {
        this.canvas = document.getElementById('main-canvas')
        this.entities = new Map()

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

        this.renderer = PIXI.autoDetectRenderer({
            width: window.innerWidth, 
            height: window.innerHeight, 
            view: this.canvas,
            antialiasing: false,
            transparent: false,
            resolution: 1
        })

        this.stage = new PIXI.Container()
        this.camera = new PIXI.Container()
        this.background = new PIXI.Container()
        this.middleground = new PIXI.Container()
        this.foreground = new PIXI.Container()

        this.camera.addChild(this.background)
        this.camera.addChild(this.middleground)
        this.camera.addChild(this.foreground)
        this.stage.addChild(this.camera)

        this.background.addChild(new BackgroundGrid())

        window.addEventListener('resize', () => {
            this.resize()
        })

        this.resize()
    }

    resize() {
        this.renderer.resize(window.innerWidth, window.innerHeight)
    }
 
    centerCamera(entity) {
        this.camera.x = -entity.x + 0.5 * window.innerWidth
        this.camera.y = -entity.y + 0.5 * window.innerHeight
    }

    toWorldCoordinates(mouseX, mouseY) {
        return {
            x: -this.camera.x + mouseX,
            y: -this.camera.y + mouseY
        }
    }

    update(delta) {
        this.renderer.render(this.stage)
    }
}

export default PIXIRenderer
