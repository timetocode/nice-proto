import { moveWithCollisions } from './collisionSystem.js'

export default (entity, command, obstacles) => {
    if (!entity.isAlive) {
        return
    }

    // rotation (not important to movement, purely aesthetic)
    entity.rotation = command.rotation

    // movement logic
    let unitX = 0
    let unitY = 0

    // create forces from input
    if (command.up) { unitY -= 1 }
    if (command.down) { unitY += 1 }
    if (command.left) { unitX -= 1 }
    if (command.right) { unitX += 1 }

    // normalize
    const len = Math.sqrt(unitX * unitX + unitY * unitY)
    if (len > 0) {
        unitX = unitX / len
        unitY = unitY / len
    }

    entity.x += unitX * entity.speed * command.delta
    entity.y += unitY * entity.speed * command.delta

    // readjusts this entities position by uncolliding it from obstacles
    moveWithCollisions(entity, obstacles)
}