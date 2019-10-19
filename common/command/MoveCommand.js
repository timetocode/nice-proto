import nengi from 'nengi'

class MoveCommand {
    constructor(up, down, left, right,  rotation, delta) {
        this.up = up
        this.down = down
        this.left = left
        this.right = right
        this.rotation = rotation
        this.delta = delta
    }
}

MoveCommand.protocol = {
    up: nengi.Boolean,
    down: nengi.Boolean,
    left: nengi.Boolean,
    right: nengi.Boolean,
    rotation: nengi.Float32,
    delta: nengi.Float32
}

export default MoveCommand
