import PlayerGraphics from '../graphics/PlayerGraphics'

export default ({ simulator, renderer }) => {
	return {
		create({ data, sim }) {
			const entity = new PlayerGraphics(data)
			renderer.middleground.addChild(entity)
			renderer.entities.set(entity.nid, entity)

			/* self, raw */
			if (data.nid === simulator.myRawId) {
				simulator.myRawEntity = sim
				entity.body.tint = 0xffffff // debug: turn self white
			}

			/* self, smooth */
			if (data.nid === simulator.mySmoothId) {
				simulator.mySmoothEntity = sim
				entity.hide() // hide our second entity
			}

			return entity
		},
		delete({ nid, entity }) {
			renderer.entities.delete(nid)
			renderer.middleground.removeChild(entity)
		},
		watch: {
			hitpoints({ entity, value }) {
				entity.hitpointBar.setHitpointPercentage(value / 100)
			}
		}
	}
}
