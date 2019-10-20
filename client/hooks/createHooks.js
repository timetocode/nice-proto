import playerHooks from './playerHooks.js'

export default (state) => {
    return {
        'PlayerCharacter': playerHooks(state)
    }
}
