const WATCHERS = Symbol()
const PROPS = Symbol()

const reactive = (config) => {
    const instance = {
        [WATCHERS]: {},
        [PROPS]: {}
    }

    Object.keys(config.watch).forEach(prop => {
        instance[WATCHERS][prop] = config.watch[prop]
    })

    Object.keys(config.obj).forEach(prop => {
        instance[PROPS][prop] = config.obj[prop]
        Object.defineProperty(instance, prop, {
            enumerable: true,
            get() { return instance[PROPS][prop] },
            set(newValue) {
                if (instance[PROPS][prop] !== newValue) {
                    instance[PROPS][prop] = newValue
                    if (instance[WATCHERS][prop]) {
                        instance[WATCHERS][prop](newValue)
                    }
                }
            }
        })

    })
    return instance
}

export default reactive