import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import Simulator from './Simulator'
import { EventEmitter } from 'events';


class GameClient {
    constructor() {
        this.client = new nengi.Client(nengiConfig, 100) 

        
        this.happy = new EventEmitter()
        this.simulator = new Simulator(this.client, this.happy)


        this.client.onConnect(res => {
            console.log('onConnect response:', res)
        })

        this.client.onClose(() => {
            console.log('connection closed')
        })

        this.client.connect('ws://localhost:8079')       
    }

    update(delta, tick, now) {
        const network = this.client.readNetwork()

        network.entities.forEach(snapshot => {
            snapshot.createEntities.forEach(entity => {
                this.happy.emit(`create::${ entity.protocol.name }`, entity)
                //this.simulator.createEntity(entity)
            })
    
            snapshot.updateEntities.forEach(update => {
                this.happy.emit(`update`, update)
               // this.simulator.updateEntity(update)
            })
    
            snapshot.deleteEntities.forEach(id => {
                this.happy.emit(`delete`, id)
                //this.simulator.deleteEntity(id)
            })
        })

        network.predictionErrors.forEach(predictionErrorFrame => {
            this.happy.emit(`predictionErrorFrame`, predictionErrorFrame)
            //this.simulator.processPredictionError(predictionErrorFrame)
        })

        network.messages.forEach(message => {
            //this.happy.emit(`message`, message)
            this.happy.emit(`message::${ message.protocol.name }`, message)
            //this.simulator.processMessage(message)
        })

        network.localMessages.forEach(localMessage => {
            this.happy.emit(`message::${ localMessage.protocol.name }`, localMessage)
            //this.simulator.processLocalMessage(localMessage)
        })

        this.simulator.update(delta)
        this.client.update()
    }
}

export default GameClient
