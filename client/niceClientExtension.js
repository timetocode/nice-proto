import { EventEmitter } from 'events';




export default (client) => {
    client.events = new EventEmitter()

    client.onConnect(res => {
        client.events.emit('connected', res)
    })

    client.onClose(() => {
        client.events.emit('disconnected')
    })

    client.readNetworkAndEmit = () => {
        const network = client.readNetwork()

        network.entities.forEach(snapshot => {
            snapshot.createEntities.forEach(entity => {
                client.events.emit(`create::${ entity.protocol.name }`, entity)
                client.events.emit(`create`, entity)
            })
    
            snapshot.updateEntities.forEach(update => {
                client.events.emit(`update`, update)
            })
    
            snapshot.deleteEntities.forEach(id => {
                client.events.emit(`delete`, id)
            })
        })

        network.predictionErrors.forEach(predictionErrorFrame => {
            client.events.emit(`predictionErrorFrame`, predictionErrorFrame)
        })

        network.messages.forEach(message => {
            client.events.emit(`message::${ message.protocol.name }`, message)
        })

        network.localMessages.forEach(localMessage => {
            client.events.emit(`message::${ localMessage.protocol.name }`, localMessage)
        })
    }


    // automated generation of a SIMULATOR.. DUN DUN DUN
    client.simulation = {
        entities: new Map()
    }

    const constructors = {}
    client.config.protocols.entities.forEach(ep => {
        constructors[ep[0]] = ep[1]
    })


    client.events.on('create', data => {
        const constructor = constructors[data.protocol.name]
        if (!constructor) {
            console.log(`No constructor found for ${ data.protocol.name }`)
        }
        const entity = new constructor()
        Object.assign(entity, data)
        client.simulation.entities.set(entity.nid, entity)
    })

    client.events.on('update', update => {
        const entity = client.simulation.entities.get(update.nid)
        if (entity) {
            entity[update.prop] = update.value
        } else {
            console.log('tried to update an entity that did not exist')
        }
    })

    
    client.events.on('delete', nid => {
        if (client.simulation.entities.has(nid)) {
            client.simulation.entities.delete(nid)
        } else {
            console.log('tried to delete an entity that did not exist')
        }
    })








}