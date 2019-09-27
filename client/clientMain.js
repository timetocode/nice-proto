
import GameClient from './GameClient.js';

window.onload = function() {
    console.log('window loaded')
    const gameClient = new GameClient()
    let tick = 0
    let previous = performance.now()
    const loop = function() {
        window.requestAnimationFrame(loop)
        let now = performance.now()
        let delta = (now - previous) / 1000
        previous = now
        tick++

        gameClient.update(delta, tick, now)
    }

    loop()
}