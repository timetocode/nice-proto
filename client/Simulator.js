import PIXIRenderer from './graphics/PIXIRenderer'
import InputSystem from './InputSystem'
import MoveCommand from '../common/command/MoveCommand'
import applyCommand from '../common/applyCommand'

class Simulator {
    constructor(client) {
        this.client = client
        this.renderer = new PIXIRenderer()
        this.input = new InputSystem()
        this.obstacles = new Map()

        this.myRawId = -1
        this.myRawEntity = null

        client.factory = createFactories({
            /* dependency injection */
            simulator: this,
            obstacles: this.obstacles,
            renderer: this.renderer
        })

        client.on('message::Identity', message => {
            this.myRawId = message.rawId
            console.log('identified as', message)
        })
    }

    update(delta) {
        const input = this.input.frameState
        this.input.releaseKeys()

        /* all of this is just for our own entity */
        if (this.myRawEntity) {
            // which way are we pointing?
            const worldCoord = this.renderer.toWorldCoordinates(this.input.currentState.mx, this.input.currentState.my)
            const dx = worldCoord.x - this.myRawEntity.x
            const dy = worldCoord.y - this.myRawEntity.y
            const rotation = Math.atan2(dy, dx)

            /* begin movement */
            // the command!
            const moveCommand = new MoveCommand(input.w, input.a, input.s, input.d, rotation, delta)
            // send moveCommand to the server
            this.client.addCommand(moveCommand)

            // apply moveCommand  to our local entity
            applyCommand(this.myRawEntity, moveCommand, this.obstacles)

            // make the camera look at our entity
            this.renderer.centerCamera(entity)
            /* end movement */
        }

        this.renderer.update()
    }
}

export default Simulator