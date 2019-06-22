import PIXIRenderer from './graphics/PIXIRenderer'
import InputSystem from './InputSystem'
import MoveCommand from '../common/command/MoveCommand'
import FireCommand from '../common/command/FireCommand'
import createFactories from './factories/createFactories'
import CollisionSystem from '../common/CollisionSystem'

// ignoring certain data from the sever b/c we will be predicting these properties on the client
const ignoreProps = ['x', 'y', 'rotation']
const shouldIgnore = (myId, update) => {
    if (update.nid === myId) {
        if (ignoreProps.indexOf(update.prop) !== -1) {
            return true
        }
    }
    return false
}

class Simulator {
    constructor(client) {
        this.client = client
        this.renderer = new PIXIRenderer()
        this.input = new InputSystem()
        this.obstacles = new Map()

        this.myRawId = -1
        this.mySmoothId = -1

        this.myRawEntity = null
        this.mySmoothEntity = null
        

        client.factory = createFactories({
            context: this,
            obstacles: this.obstacles,
            renderer: this.renderer
        })

        client.entityUpdateFilter = (update) => {
            return shouldIgnore(this.myRawId, update)
        }

        client.events.on('message::Identity', message => {
            this.myRawId = message.rawId
            this.mySmoothId = message.smoothId
            console.log('identified as', message)
        })

        client.events.on('message::WeaponFired', message => {
            //console.log('server says a weapon was fired', message)
            if (message.sourceId === this.mySmoothEntity.nid) {
                return
            }
            this.renderer.drawHitscan(message.x, message.y, message.tx, message.ty, 0xff0000)
        })

        client.events.on('predictionErrorFrame', predictionErrorFrame => {
            predictionErrorFrame.entities.forEach(predictionErrorEntity => {
                // get our clientside entity
                const entity = this.myRawEntity//localEntity.get(predictionErrorEntity.id)

                // correct any prediction errors with server values...
                predictionErrorEntity.errors.forEach(predictionError => {
                    //console.log('prediciton error', predictionError)
                    entity[predictionError.prop] = predictionError.actualValue
                })

                // and then re-apply any commands issued since the frame that had the prediction error
                const commandSets = this.client.getUnconfirmedCommands() // client knows which commands need redone
                commandSets.forEach((commandSet, clientTick) => {
                    commandSet.forEach(command => {
                        // example assumes 'PlayerInput' is the command we are predicting
                        if (command.protocol.name === 'MoveCommand') {
                            entity.processMove(command)
                            const prediction = {
                                nid: entity.nid,
                                x: entity.x,
                                y: entity.y
                            }
                            this.client.addCustomPrediction(clientTick, prediction, ['x', 'y']) // overwrite
                        }
                    })
                })
            })
        })
    }

    simulateShot(x, y, tx, ty) {
        // TODO: simulate impact against entities/terrain
        let endX = tx
        let endY = ty
        this.obstacles.forEach(obstacle => {
            const hitObstacle = CollisionSystem.checkLinePolygon(x, y, tx, ty, obstacle.collider)
            console.log('hit obstacle...?', hitObstacle)
            if (hitObstacle) {
                endX += hitObstacle.overlapV.x
                endY += hitObstacle.overlapV.y
            }
        })



        this.renderer.drawHitscan(x, y, endX, endY, 0xffffff)
    }

    update(delta) {
        const input = this.input.frameState

        let rotation = 0
        const worldCoord = this.renderer.toWorldCoordinates(this.input.currentState.mx, this.input.currentState.my)

        if (this.myRawEntity) {
            const dx = worldCoord.x - this.myRawEntity.x
            const dy = worldCoord.y - this.myRawEntity.y
            rotation = Math.atan2(dy, dx)
        }

        this.input.releaseKeys()

        if (this.myRawEntity) {

            // movement
            const moveCommand = new MoveCommand(input.w, input.a, input.s, input.d, rotation, delta)
            this.client.addCommand(moveCommand)
            this.myRawEntity.processMove(moveCommand, this.obstacles)


            const prediction = {
                nid: this.myRawEntity.nid,
                x: this.myRawEntity.x,
                y: this.myRawEntity.y
            }
            this.client.addCustomPrediction(this.client.tick, prediction, ['x', 'y'])

            const entity = this.client.simulation.clientEntities.get(prediction.nid)
            entity.x = prediction.x
            entity.y = prediction.y
            entity.rotation = rotation

            //this.renderer.move(entity.nid, entity.x, entity.y, rotation)
            this.renderer.centerCamera(entity)

            // shooting
            this.myRawEntity.weaponSystem.update(delta)
            if (input.mouseDown) {
                if (this.myRawEntity.fire()) {
                    this.client.addCommand(new FireCommand(worldCoord.x, worldCoord.y))
                    this.simulateShot(this.myRawEntity.x, this.myRawEntity.y, worldCoord.x, worldCoord.y)
                }
            }
        }


        this.renderer.update()
    }
}

export default Simulator