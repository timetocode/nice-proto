import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig.js'
import PlayerCharacter from '../common/entity/PlayerCharacter.js'
import Identity from '../common/message/Identity.js'
import instanceHookAPI from './instanceHookAPI.js'
import applyCommand from '../common/applyCommand.js'
import setupObstacles from './setupObstacles.js'

const instance = new nengi.Instance(nengiConfig, { port: 8079 })
instanceHookAPI(instance)

// game-related state
const obstacles = setupObstacles(instance)
// (the rest is just attached to client objects when they connect)

instance.on('connect', ({ client, callback }) => {
    // create a entity for this client
    const rawEntity = new PlayerCharacter()
    instance.addEntity(rawEntity)

    // tell the client which entities it controls
    instance.message(new Identity(rawEntity.nid), client)

    // establish a relation between this entity and the client
    rawEntity.client = client
    client.rawEntity = rawEntity

    // define the view (the area of the game visible to this client, all else is culled)
    client.view = {
        x: rawEntity.x,
        y: rawEntity.y,
        halfWidth: 1000,
        halfHeight: 1000
    }

    // accept the connection
    callback({ accepted: true, text: 'Welcome!' })
})

instance.on('disconnect', client => {
    // clean up per client state
    instance.removeEntity(client.rawEntity)
})

instance.on('command::MoveCommand', ({ command, client, tick }) => {
    // move this client's entity
    const rawEntity = client.rawEntity
    applyCommand(rawEntity, command, obstacles)
})


const update = (delta, tick, now) => {
    instance.emitCommands()

    instance.clients.forEach(client => {
        // move client view to follow the client's entity
        // (client view is a rectangle used for culling network data)
        client.view.x = client.rawEntity.x
        client.view.y = client.rawEntity.y
    })

    // when instance.updates, nengi sends out snapshots to every client
    instance.update()
}

export default update
