import ObstacleFactory from './ObstacleFactory'
import PlayerFactory from './PlayerFactory'

export default ({ obstacles, renderer, context }) => {
    return {
        'PlayerCharacter': PlayerFactory({ renderer, context }),
        'Obstacle': ObstacleFactory({ renderer, obstacles })
    }
}
