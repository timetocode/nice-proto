import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig.js'
import InputSystem from './InputSystem.js'
import PIXIRenderer from './graphics/PIXIRenderer.js'
import clientHookAPI from './clientHookAPI.js'
import createHooks from './hooks/createHooks.js'
import handleInput from './handleInput.js'

const client = new nengi.Client(nengiConfig, 100)
const input = new InputSystem()
const renderer = new PIXIRenderer()

const state = {
    myRawId: null,
    obstacles: new Map()
}

clientHookAPI( // API EXTENSION
    client,
    createHooks(state, renderer)
)

client.on('message::Identity', message => {
    state.myRawId = message.rawId
})

client.on('message::Notification', message => {
    console.log('Notification', message)
})

client.on('connected', res => { console.log('connection?:', res) })
client.on('disconnected', () => { console.log('connection closed') })

client.connect('ws://localhost:8079')

const update = (delta, tick, now) => {
    client.readNetworkAndEmit()
    handleInput(input, state, client, renderer, delta)
    renderer.update(delta)
    client.update()
}

export {
    update,
    renderer
}
