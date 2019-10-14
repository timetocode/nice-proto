import obstacleHooks from './obstacleHooks.js'
import playerHooks from './playerHooks.js'

export default (simulator) => {
    const { renderer, obstacles } = simulator
    console.log('sim', simulator)
    return {
        'PlayerCharacter': playerHooks({ renderer, simulator }),
        'Obstacle': obstacleHooks({ renderer, obstacles })
    }
}
