import nengi from 'nengi'
import SAT from 'sat'

class Obstacle {
    constructor(state) {
        this.x = state.x
        this.y = state.y
        this.width = state.width
        this.height = state.height
        this.collider = new SAT.Box(new SAT.Vector(this.x, this.y), this.width, this.height).toPolygon()
    }
}

Obstacle.protocol = {
    x: nengi.UInt16,
    y: nengi.UInt16,
    width: nengi.UInt16,
    height: nengi.UInt16,
}

export default Obstacle
