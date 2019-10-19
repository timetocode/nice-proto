import MoveCommand from '../common/command/MoveCommand.js'

const handleInput = (inputSystem, state, client, renderer, delta) => {
    const input = inputSystem.frameState
    inputSystem.releaseKeys()

    const { myRawEntity, obstacles } = state

    /* all of this is just for our own entity */
    if (myRawEntity) {
        // which way are we pointing?
        const worldCoord = renderer.toWorldCoordinates(
            inputSystem.currentState.mx, 
            inputSystem.currentState.my
        )
        const dx = worldCoord.x - myRawEntity.x
        const dy = worldCoord.y - myRawEntity.y
        const rotation = Math.atan2(dy, dx)

        /* begin movement */
        // the command!
        const moveCommand = new MoveCommand(input.w, input.a, input.s, input.d, rotation, delta)
        // send moveCommand to the server
        client.addCommand(moveCommand)
    }
}

export default handleInput