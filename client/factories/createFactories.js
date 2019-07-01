import createObstacleFactory from './createObstacleFactory'
import createPlayerFactory from './createPlayerFactory'

export default ({ obstacles, renderer, simulator }) => {
    return {
        'PlayerCharacter': createPlayerFactory({ renderer, simulator }),
        'Obstacle': createObstacleFactory({ renderer, obstacles })
    }
}
