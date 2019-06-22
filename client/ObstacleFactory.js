//obs

import ObstacleGraphics from './graphics/ObstacleGraphics'

//import { obstacles, renderer } from './Context'


export default ({ obstacles, renderer }) => {
    return {
        create({ data, entity }) {
            obstacles.set(entity.nid, entity)

            const clientEntity = new ObstacleGraphics(entity)
            renderer.entities.set(entity.nid, clientEntity)
            renderer.middleground.addChild(clientEntity)

            return clientEntity
        },
        delete(nid) {
            renderer.deleteEntity(nid)
        }
    }
}