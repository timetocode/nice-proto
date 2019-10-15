export default (client) => {
    
    client.onConnect(res => {
        client.emit('connected', res)
    })

    client.onClose(() => {
        client.emit('disconnected')
    })

    client.readNetworkAndEmit = () => {
        const network = client.readNetwork()

        network.entities.forEach(snapshot => {
            snapshot.createEntities.forEach(entity => {
                client.emit(`create::${ entity.protocol.name }`, entity)
                client.emit(`create`, entity)
            })
    
            snapshot.updateEntities.forEach(update => {
                client.emit(`update`, update)
            })
    
            snapshot.deleteEntities.forEach(id => {
                client.emit(`delete`, id)
            })
        })

        network.predictionErrors.forEach(predictionErrorFrame => {
            client.emit(`predictionErrorFrame`, predictionErrorFrame)
        })

        network.messages.forEach(message => {
            client.emit(`message::${ message.protocol.name }`, message)
        })

        network.localMessages.forEach(localMessage => {
            client.emit(`message::${ localMessage.protocol.name }`, localMessage)
        })
    }

    // automated generation of a SIMULATOR.. DUN DUN DUN
    client.sims = new Map()
    client.entities = new Map()


    // gather constructors from nengiConfig
    const constructors = {}
    client.config.protocols.entities.forEach(ep => {
        constructors[ep[0]] = ep[1]
    })

    client.on('create', data => {
        // construct the entity (nengiConfig constructor)
        const name = data.protocol.name
        const constructor = constructors[name]
        if (!constructor) {
            console.log(`No constructor found for ${ name }`)
        }
        const sim = new constructor(data)
        Object.assign(sim, data)
        client.sims.set(sim.nid, sim)        

        // construct the client entity (from factory)
        if (client.factory) {
            const factory = client.factory[name]
            if (factory) {
                const entity = factory.create({ data, sim })
                Object.assign(entity, data)

                if (factory.watch) {
                    data.protocol.keys.forEach(prop => {
                        if (factory.watch[prop]) {
                            factory.watch[prop]({ value: data[prop], entity })
                        }
                    })
                }

                client.entities.set(entity.nid, entity)
            }
        }
    })

    client.on('update', update => {
        if (client.entityUpdateFilter(update)) {
            //console.log('ignore', update)
            return
        }
        const sim = client.sims.get(update.nid)
        if (sim) {
            sim[update.prop] = update.value
        } else {
            console.log('tried to update a sim that did not exist')
        }
        const entity = client.entities.get(update.nid)
        if (entity) {
            entity[update.prop] = update.value

            const name = entity.protocol.name
            const factory = client.factory[name]

            if (factory.watch && factory.watch[update.prop]) {
                factory.watch[update.prop]({ id: update.id, value: update.value, entity })
            }

        } else {
            console.log('tried to update an entity that did not exist')
        }
    })

    
    client.on('delete', nid => {
        const entity = client.entities.get(nid)
        const name = entity.protocol.name
        const factory = client.factory[name]

        if (client.sims.has(nid)) {
            client.sims.delete(nid)            
        } else {
            console.log('tried to delete an entity that did not exist')
        }

        if (client.entities.has(nid)) {
            client.entities.delete(nid)
            factory.delete({ nid, entity })
        } else {
            console.log('tried to delete an entity that did not exist')
        }
    })
}
