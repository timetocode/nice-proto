
import create from './game.js'

window.onload = function() {
    console.log('window loaded')
    const update = create()
    let tick = 0
    let previous = performance.now()
    const loop = function() {
        window.requestAnimationFrame(loop)
        const now = performance.now()
        const delta = (now - previous) / 1000
        previous = now
        tick++

        update(delta, tick, now)
    }

    loop()
}
