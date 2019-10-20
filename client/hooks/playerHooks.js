import PlayerGraphics from '../graphics/PlayerGraphics.js'

export default (state, renderer ) => {
    return {
        create({ data, entity }) {
            const graphics = new PlayerGraphics(data)
            renderer.middleground.addChild(graphics)
            renderer.entities.set(graphics.nid, graphics)

            /* self, raw */
            if (data.nid === state.myRawId) {
                state.myRawEntity = entity
            }

            return graphics
        },
        delete({ nid, graphics }) {
            renderer.entities.delete(nid)
            renderer.middleground.removeChild(graphics)
        },
        watch: {
        }
    }
}
