import PlayerGraphics from '../graphics/PlayerGraphics'

export default ({ context, renderer }) => {
    return {
        create({ data, entity }) {
            const clientEntity = new PlayerGraphics(data)
            renderer.middleground.addChild(clientEntity)

            /* self, raw */
            if (entity.nid === context.myRawId) {
                context.myRawEntity = entity
                clientEntity.body.tint = 0xffffff // debug: turn self white
            }

             /* self, smooth */
            if (entity.nid === context.mySmoothId) {
                // hide our smooth
                context.mySmoothEntity = entity
                clientEntity.hide()
            }
            return clientEntity
        },
        delete(nid) {
            renderer.deleteEntity(nid)
        }
    }
}
