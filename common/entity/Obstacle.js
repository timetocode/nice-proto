import nengi from 'nengi'
import SAT from 'sat'

import CollisionSystem from '../CollisionSystem'

class Obstacle {
    constructor(state) {
        this.x = state.x
        this.y = state.y
        this.width = state.width
        this.height = state.height
		this.collider = new SAT.Box(new SAT.Vector(this.x, this.y), this.width, this.height).toPolygon()
		

		this.test = CollisionSystem.createRectangleCollider(0, 0, 50, 50)
		console.log('test collider', this.test, this.test.x, this.test.y)
		this.test.x = 500
		console.log(this.test, this.test.polygon.points)

		this.testCircle = CollisionSystem.createCircleCollider(15, 15, 35)
		console.log('circle', this.testCircle, this.testCircle.circle)
		this.testCircle.x = 600
		console.log('circle222', this.testCircle, this.testCircle.circle)
    }
}

Obstacle.protocol = {
    x: nengi.UInt16,
    y: nengi.UInt16,
    width: nengi.UInt16,
    height: nengi.UInt16,
}

export default Obstacle
