import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig'
import PlayerCharacter from '../common/entity/PlayerCharacter'
import Identity from '../common/message/Identity'
import WeaponFired from '../common/message/WeaponFired'
import CollisionSystem from '../common/CollisionSystem'
import Obstacle from '../common/entity/Obstacle'

import followPath from './followPath'
import damagePlayer from './damagePlayer'
import { EventEmitter } from 'events';


import niceInstanceExtension from './niceInstanceExtension'

class GameInstance {
    constructor() {

        this.players = new Map()
        this.instance = new nengi.Instance(nengiConfig, { port: 8079 })
        niceInstanceExtension(this.instance)

        this.instance.events.on('connect', ({ client, data, callback }) => {

            // create a entity for this client
            const rawEntity = new PlayerCharacter()

            // make the raw entity only visible to this client
            const channel = new nengi.Channel(nengiConfig)
            this.instance.addChannel(channel)
            channel.subscribe(client)
            channel.addEntity(rawEntity)
            //this.instance.addEntity(rawEntity)
            client.channel = channel

            // smooth entity is visible to everyone
            const smoothEntity = new PlayerCharacter()
            smoothEntity.collidable = true
            this.instance.addEntity(smoothEntity)

            // tell the client which entities it controls
            this.instance.message(new Identity(rawEntity.nid, smoothEntity.nid), client)

            // establish a relation between this entity and the client
            rawEntity.client = client
            client.rawEntity = rawEntity
            smoothEntity.client = client
            client.smoothEntity = smoothEntity
            client.positions = []

            // define the view (the area of the game visible to this client, all else is culled)
            client.view = {
                x: rawEntity.x,
                y: rawEntity.y,
                halfWidth: 99999,
                halfHeight: 99999
            }

            //this.players.set(rawEntity.nid, rawEntity)

            callback({ accepted: true, text: 'Welcome!' })
        })

        this.instance.events.on('disconnect', client => {
            this.instance.removeEntity(client.rawEntity)
            this.instance.removeEntity(client.smoothEntity)
            this.instance.removeChannel(client.channel)
        })

        // setup a few obstacles

        const obstacles = new Map()

        const obsA = new Obstacle({ x: 150, y: 150, width: 250, height: 150 })
        this.instance.addEntity(obsA)
        obstacles.set(obsA.nid, obsA)

        //const obsB = new Obstacle({ x: 450, y: 600, width: 60, height: 150 })
        //this.instance.addEntity(obsB)
       // obstacles.set(obsB.nid, obsB)

        this.obstacles = obstacles



        this.instance.events.on('command::MoveCommand', ({ command, client, tick }) => {
            const rawEntity = client.rawEntity
            const smoothEntity = client.smoothEntity

            rawEntity.processMove(command, this.obstacles)
            client.positions.push({
                x: rawEntity.x,
                y: rawEntity.y,
                rotation: rawEntity.rotation
            })
            rawEntity.weaponSystem.update(command.delta)
        })

        this.instance.events.on('command::FireCommand', ({ command, client, tick }) => {
            const rawEntity = client.rawEntity
            const smoothEntity = client.smoothEntity

            if (rawEntity.fire()) {


                let endX = command.x
                let endY = command.y

                this.obstacles.forEach(obstacle => {
                    const hitObstacle = CollisionSystem.checkLinePolygon(rawEntity.x, rawEntity.y, command.x, command.y, obstacle.collider)
                    console.log('hit obstacle...?', hitObstacle)
                    if (hitObstacle) {
                        endX = hitObstacle.x
                        endY = hitObstacle.y
                    }
                })


                const timeAgo = client.latency + 100

                this.lagCompensatedHitscanCheck(rawEntity.x, rawEntity.y, endX, endY, timeAgo, (victim) => {
                    if (victim.nid !== rawEntity.nid && victim.nid !== smoothEntity.nid) {
                        damagePlayer(victim)
                    }
                })

                this.instance.addLocalMessage(new WeaponFired(smoothEntity.nid, smoothEntity.x, smoothEntity.y, command.x, command.y))
            }
        })


    }

    lagCompensatedHitscanCheck(x1, y1, x2, y2, timeAgo, onHit) {
        const area = {
            x: (x1 + x2) / 2,
            y: (y1 + y2) / 2,
            halfWidth: Math.abs(x2 - x1),
            halfHeight: Math.abs(y2 - y1)
        }

        const compensatedEntityPositions = this.instance.historian.getLagCompensatedArea(timeAgo, area)
        compensatedEntityPositions.forEach(entityProxy => {
            // look up the real entity
            const realEntity = this.instance.entities.get(entityProxy.nid)

            if (realEntity && realEntity.collidable) {
                const tempX = realEntity.collider.pos.x
                const tempY = realEntity.collider.pos.y

                // rewind
                realEntity.collider.pos.x = entityProxy.x
                realEntity.collider.pos.y = entityProxy.y

                const hit = CollisionSystem.checkLineCircle(x1, y1, x2, y2, realEntity.collider)

                // restore
                realEntity.collider.pos.x = tempX
                realEntity.collider.pos.y = tempY

                if (hit) {
                    onHit(realEntity)
                }
            }
        })
    }

    update(delta, tick, now) {
        this.instance.emitCommands()

        this.instance.clients.forEach(client => {
            client.view.x = client.rawEntity.x
            client.view.y = client.rawEntity.y

            const smoothEntity = client.smoothEntity
            if (smoothEntity) {
                const maximumMovementPerFrameInPixels = 410 * delta
                followPath(smoothEntity, client.positions, maximumMovementPerFrameInPixels)
            }
        })

        // when instance.updates, nengi sends out snapshots to every client
        this.instance.update()
    }
}

export default GameInstance

