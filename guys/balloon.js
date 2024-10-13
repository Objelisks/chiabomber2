import {GRID_WIDTH, GRID_HEIGHT, GRID_TOP, GRID_LEFT, DIRECTIONS} from '../constants'
import { distance } from '../util'

const waterSpriteMap = {
  [DIRECTIONS.LEFT]: 'balloon_left',
  [DIRECTIONS.RIGHT]: 'balloon_right',
  [DIRECTIONS.UP]: 'balloon_up',
  [DIRECTIONS.DOWN]: 'balloon_down'
}

const mudSpriteMap = {
  [DIRECTIONS.LEFT]: 'mud_left',
  [DIRECTIONS.RIGHT]: 'mud_right',
  [DIRECTIONS.UP]: 'mud_up',
  [DIRECTIONS.DOWN]: 'mud_down'
}

const MOVE_SPEED = 0.3
const HIT_DISTANCE = 20

export const WaterBalloon = class extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, direction) {
    super(scene, x, y, waterSpriteMap[direction])
    
    this.depth = 3
    scene.add.existing(this)
    
    this.facing = direction
    this.defeated = false
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)

    if(this.dead || this.scene.pause) {
      return
    }

    // move forward
    this.x += this.facing[0] * delta * MOVE_SPEED
    this.y += this.facing[1] * delta * MOVE_SPEED

    this.scene.enemies.forEach(enemy => {
      if(this.dead || enemy.defeated) {
        return // we already hit something and destroyed ourself
      }

      // check to see if we hit an enemy
      if(distance(enemy, this) < HIT_DISTANCE) {
        enemy.hit()
        this.scene.sound.play('water_balloon', {seek: 0.2})
        if(enemy.defeated) {
          // increase score
          this.scene.balloonKills += 1
          this.scene.updateScore(this.scene.score + 10)
        }
        // spawn an animation
        this.scene.add.sprite(this.x, this.y).play('waterExplosion')
          .on(Phaser.Animations.Events.ANIMATION_COMPLETE, function() {
            this.destroy()
          })

        // destroy self
        this.dead = true
        this.destroy()
        return
      }
    })

    // hit the wall
    if(this.x < GRID_LEFT-10 || this.y < GRID_TOP-10 || this.x > GRID_LEFT + GRID_WIDTH+10 || this.y > GRID_TOP + GRID_HEIGHT+10) {
      this.destroy()
    }
  }
}

export const MudBalloon = class extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, direction) {
    super(scene, x, y, mudSpriteMap[direction])

    this.depth = 2
    scene.add.existing(this)
    
    this.facing = direction
    this.defeated = false
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)

    if(this.dead || this.scene.pause) {
      return
    }

    // move forward
    this.x += this.facing[0] * delta * MOVE_SPEED
    this.y += this.facing[1] * delta * MOVE_SPEED

    // collide with player water balloon
    if(this.scene.player.myBalloon && distance(this.scene.player.myBalloon, this) < HIT_DISTANCE) {
      this.dead = true
      this.destroy()
      return
    }

    // collide with player
    if(distance(this.scene.player, this) < HIT_DISTANCE/2) {
      this.scene.sound.play('water_balloon', {seek: 0.2})
      this.scene.player.hit()

      // spawn animation
      this.scene.add.sprite(this.x, this.y).play('mudExplosion')
        .on(Phaser.Animations.Events.ANIMATION_COMPLETE, function() {
          this.destroy()
        })

      // destroy self
      this.dead = true
      this.destroy()
      return
    }

    // hit wall
    if(this.x < GRID_LEFT-10 || this.y < GRID_TOP-10 || this.x > GRID_LEFT + GRID_WIDTH+10 || this.y > GRID_TOP + GRID_HEIGHT+10) {
      this.destroy()
    }
  }
}