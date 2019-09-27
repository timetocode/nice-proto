import GameInstance from './GameInstance.js';
import nengiConfig from '../common/nengiConfig.js';

const gameInstance = new GameInstance(/*args*/)

const hrtimeMs = function() {
    let time = process.hrtime()
    return time[0] * 1000 + time[1] / 1000000
}

let tick = 0
let previous = hrtimeMs()
let tickLengthMs = 1000 / nengiConfig.UPDATE_RATE

const loop = function() {
    let now = hrtimeMs()
    if (previous + tickLengthMs <= now) {
        let delta = (now - previous) / 1000
        previous = now
        tick++

        //let start = hrtimeMs() // uncomment to benchmark
        gameInstance.update(delta, tick, Date.now())
        //let stop = hrtimeMs()
        //console.log('game update took', stop-start, 'ms')
    }

    if (hrtimeMs() - previous < tickLengthMs - 4) {
        setTimeout(loop)
    } else {
        setImmediate(loop)
    }
}

loop()
