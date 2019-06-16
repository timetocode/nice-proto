//obs

import Obstacle from './graphics/Obstacle'

//import { obstacles, renderer } from './Context'


export default ({ obstacles, renderer }) => {
    return {
        create({ data, entity }) {
            entity.reset()
            obstacles.set(entity.nid, entity)

            const clientEntity = new Obstacle(entity)
            renderer.entities.set(entity.nid, clientEntity)
            renderer.middleground.addChild(clientEntity)

            return clientEntity
        },
        delete(nid) {
            renderer.deleteEntity(nid)
        }
    }
}