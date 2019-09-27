import applyCommand from '../common/applyCommand.js'

export default (predictionErrorFrame, client, entity, obstacles) => {
	predictionErrorFrame.entities.forEach(predictionErrorEntity => {

		// move the entity back to the server side position
		predictionErrorEntity.errors.forEach(predictionError => {
			//console.log('prediciton error', predictionError)
			entity[predictionError.prop] = predictionError.actualValue
		})

		// and then re-apply any commands issued since the frame that had the prediction error
		const commandSets = client.getUnconfirmedCommands() // client knows which commands need redone
		commandSets.forEach((commandSet, clientTick) => {
			commandSet.forEach(command => {
				// reapply movements
				if (command.protocol.name === 'MoveCommand') {
					applyCommand(entity, command, obstacles)
					const prediction = {
						nid: entity.nid,
						x: entity.x,
						y: entity.y
					}
					// these reconciled positions are now our new predictions, going forward
					client.addCustomPrediction(clientTick, prediction, ['x', 'y']) 
				}
			})
		})
	})
}