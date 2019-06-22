import { EventEmitter } from 'events'

export default (instance) => {
    instance.events = new EventEmitter()

    instance.onConnect((client, data, callback) => {
        instance.events.emit('connect', { client, data, callback })
    })

    instance.onDisconnect(client => {
        instance.events.emit('disconnect', { client })
    })

    instance.emitCommands = () => {
        let cmd = null
        while (cmd = instance.getNextCommand()) {
            const tick = cmd.tick
            const client = cmd.client

            for (let i = 0; i < cmd.commands.length; i++) {
                const command = cmd.commands[i]
                instance.events.emit(`command::${command.protocol.name}`, { command, client, tick })
            }
        }
    }
}