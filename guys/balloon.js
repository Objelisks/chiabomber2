import {GRID_WIDTH, GRID_HEIGHT, GRID_TOP, GRID_LEFT, DIRECTIONS} from '../constants'
import { distance } from '../util'

const spriteMap = {
  [DIRECTIONS.LEFT]: 'balloon_left',
  [DIRECTIONS.RIGHT]: 'balloon_right',
  [DIRECTIONS.UP]: 'balloon_up',
  [DIRECTIONS.DOWN]: 'balloon_down'
}

const MOVE_SPEED = 0.3
const HIT_DISTANCE = 10

export const WaterBalloon = class extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, direction) {
    super(scene, x, y, spriteMap[direction])
    scene.add.existing(this)
    
    this.facing = direction
    this.defeated = false
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)

    if(this.dead || this.scene.pause) {
      return
    }

    this.x += this.facing[0] * delta * MOVE_SPEED
    this.y += this.facing[1] * delta * MOVE_SPEED

    this.scene.enemies.forEach(enemy => {
      if(this.dead) {
        return // we already hit something and destroyed ourself
      }
      if(distance(enemy, this) < HIT_DISTANCE) {
        enemy.hit()
        if(enemy.defeated) {
          this.scene.balloonKills += 1
          this.scene.updateScore(this.scene.score + 10)
        }
        this.scene.add.sprite(this.x, this.y).play('waterExplosion')
          .on(Phaser.Animations.Events.ANIMATION_COMPLETE, function() {
            this.destroy()
          })
        this.dead = true
        this.destroy()
      }
    })

    if(this.x < GRID_LEFT-10 || this.y < GRID_TOP-10 || this.x > GRID_LEFT + GRID_WIDTH+10 || this.y > GRID_TOP + GRID_HEIGHT+10) {
      this.destroy()
    }
  }
}