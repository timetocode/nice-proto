import * as PIXI from 'pixi.js'
import BackgroundGrid from './BackgroundGrid.js'

let renderer = null

const stage = new PIXI.Container()
const camera = new PIXI.Container()
const background = new PIXI.Container()
const middleground = new PIXI.Container()
const foreground = new PIXI.Container()

camera.addChild(background)
camera.addChild(middleground)
camera.addChild(foreground)
stage.addChild(camera)

background.addChild(new BackgroundGrid())

const resize = () => {
    renderer.resize(window.innerWidth, window.innerHeight)
}

const centerCamera = (entity) => {
    camera.x = -entity.x + 0.5 * window.innerWidth
    camera.y = -entity.y + 0.5 * window.innerHeight
}

const toWorldCoordinates = (mouseX, mouseY)  => {
    return {
        x: -camera.x + mouseX,
        y: -camera.y + mouseY
    }
}

const update = (delta) => {
    renderer.render(stage)
}

// init is a function we call after the DOM has loaded
// otherwise the canvas element would not yet exist
const init = () => {
    const canvas = document.getElementById('main-canvas')

    renderer = PIXI.autoDetectRenderer({
        width: window.innerWidth, 
        height: window.innerHeight, 
        view: canvas,
        antialiasing: false,
        transparent: false,
        resolution: 1
    })
}

window.addEventListener('resize', resize)

export default {
    init,
    update,
    resize,
    centerCamera,
    toWorldCoordinates,
    camera,
    background,
    middleground,
    foreground,
    stage
}
