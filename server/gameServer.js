import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig.js'
import instanceHookAPI from './instanceHookAPI.js'

const instance = new nengi.Instance(nengiConfig, { port: 8079 })
instanceHookAPI(instance)

instance.on('connect', ({ client, callback }) => {
    // accept the connection
    callback({ accepted: true, text: 'Welcome!' })
})

instance.on('disconnect', client => {
    // disconnected
})

const update = (delta, tick, now) => {
    instance.emitCommands()
    instance.update()
}

export {
    update
}
