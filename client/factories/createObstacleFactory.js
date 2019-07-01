import ObstacleGraphics from '../graphics/ObstacleGraphics'

export default ({ obstacles, renderer }) => {
    return {
        create({ data, sim }) {
            obstacles.set(data.nid, sim)

            const entity = new ObstacleGraphics(data)
            renderer.entities.set(data.nid, entity)
            renderer.middleground.addChild(entity)

            return entity
        },
        delete(nid) {
            renderer.deleteEntity(nid)
        }
    }
}
