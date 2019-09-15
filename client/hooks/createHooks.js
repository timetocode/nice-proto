import obstacleHooks from './obstacleHooks'
import playerHooks from './playerHooks'

export default ({ obstacles, renderer, simulator }) => {
    return {
        'PlayerCharacter': playerHooks({ renderer, simulator }),
        'Obstacle': obstacleHooks({ renderer, obstacles })
    }
}
