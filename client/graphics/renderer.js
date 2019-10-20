import { autoDetectRenderer, Container } from 'pixi.js'
import BackgroundGrid from './BackgroundGrid.js'

let renderer = null

const stage = new Container()
const camera = new Container()
const background = new Container()
const middleground = new Container()
const foreground = new Container()

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

    renderer = autoDetectRenderer({
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
