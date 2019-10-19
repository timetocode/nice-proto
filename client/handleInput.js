import MoveCommand from '../common/command/MoveCommand.js'
import { currentState, frameState, releaseKeys } from './input'

const handleInput = (state, client, renderer, delta) => {
   releaseKeys()

    const { myRawEntity, obstacles } = state
    const { mouseX, mouseY } = currentState

    /* all of this is just for our own entity */
    if (myRawEntity) {
        // which way are we pointing?
        const worldCoord = renderer.toWorldCoordinates(mouseX, mouseY)
        const dx = worldCoord.x - myRawEntity.x
        const dy = worldCoord.y - myRawEntity.y
        const rotation = Math.atan2(dy, dx)

        /* begin movement */
        // the command!
        const { up, down, left, right } = frameState
        const moveCommand = new MoveCommand(up, down, left, right, rotation, delta)
        // send moveCommand to the server
        client.addCommand(moveCommand)
    }
}

export default handleInput
