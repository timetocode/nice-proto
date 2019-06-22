import createObstacleFactory from './createObstacleFactory'
import createPlayerFactory from './createPlayerFactory'

export default ({ obstacles, renderer, context }) => {
    return {
        'PlayerCharacter': createPlayerFactory({ renderer, context }),
        'Obstacle': createObstacleFactory({ renderer, obstacles })
    }
}
