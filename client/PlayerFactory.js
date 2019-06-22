
import PlayerGraphics from './graphics/PlayerGraphics'

export default ({ context, renderer }) => {
    return {
        create({ data, entity }) {

            const cl = new PlayerGraphics(entity)
            //renderer.entities.set(entity.nid, cl)
            renderer.middleground.addChild(cl)
            //return clientEntity

            if (entity.nid === context.myRawId) {
                // console.log('discovered self')
                context.myRawEntity = entity
                // for debugging purposes turn the entity we control white
                cl.body.tint = 0xffffff
            }

            if (entity.nid === context.mySmoothId) {
                // hide our smooth
                context.mySmoothEntity = entity
                cl.hide()
            }
            return cl
        },
        delete(nid) {
            renderer.deleteEntity(nid)
        }
    }
}