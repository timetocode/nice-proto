export default (client, hooks) => {
	client.hooks = hooks
	client.svEntities = new Map()
	client.clEntities = new Map()

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
        const svEntity = new constructor(data)
		Object.assign(svEntity, data)
		client.svEntities.set(svEntity.nid, svEntity)		

		// construct the client entity (from hooks)
        if (client.hooks) {
            const hooks = client.hooks[name]
            if (hooks) {
				const entity = hooks.create({ data, sim: svEntity })
				Object.assign(entity, data)

				if (hooks.watch) {
					data.protocol.keys.forEach(prop => {
						if (hooks.watch[prop]) {
							hooks.watch[prop]({ value: data[prop], entity })
						}
					})
				}

                client.clEntities.set(entity.nid, entity)
            }
        }
    })

    client.on('update', update => {
        if (client.entityUpdateFilter(update)) {
            //console.log('ignore', update)
            return
        }
        const svEntity = client.svEntities.get(update.nid)
        if (svEntity) {
            svEntity[update.prop] = update.value
        } else {
            console.log('tried to update a sim that did not exist')
        }
        const clEntity = client.clEntities.get(update.nid)
        if (clEntity) {
			clEntity[update.prop] = update.value

			const name = clEntity.protocol.name
			const hooks = client.hooks[name]

			if (hooks.watch && hooks.watch[update.prop]) {
				hooks.watch[update.prop]({ id: update.id, value: update.value, entity: clEntity })
			}

        } else {
            console.log('tried to update an entity that did not exist')
        }
    })

    
    client.on('delete', nid => {
		const clEntity = client.clEntities.get(nid)
		const name = clEntity.protocol.name
		const hooks = client.hooks[name]

        if (client.svEntities.has(nid)) {
			client.svEntities.delete(nid)			
        } else {
            console.log('tried to delete an entity that did not exist')
        }

        if (client.clEntities.has(nid)) {
			client.clEntities.delete(nid)
			hooks.delete({ nid, entity: clEntity })
        } else {
            console.log('tried to delete an entity that did not exist')
        }
    })
}
