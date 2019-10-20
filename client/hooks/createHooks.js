import playerHooks from './playerHooks.js'

export default (state, renderer) => {
    return {
        'PlayerCharacter': playerHooks(state, renderer)
    }
}
