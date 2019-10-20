import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig.js'
import clientHookAPI from './clientHookAPI.js'
import createHooks from './hooks/createHooks.js'
import renderer from './graphics/renderer'

const client = new nengi.Client(nengiConfig, 100)

const state = {
    // client-side game state can live in here
}

clientHookAPI(client, createHooks(state))

client.on('connected', res => { console.log('connection?:', res) })
client.on('disconnected', () => { console.log('connection closed') })

client.connect('ws://localhost:8079')

const update = (delta, tick, now) => {
    client.readNetworkAndEmit()
    renderer.update(delta)
    client.update()
}

export {
    update,
    state
}
