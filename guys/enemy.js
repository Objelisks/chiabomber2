import {GRID_TILE_WIDTH, GRID_TILE_HEIGHT, GRID_WIDTH, GRID_HEIGHT, GRID_TOP, GRID_LEFT, DIRECTIONS} from './constants'

const MOVE_SPEED = 10

export const Enemy = class extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, x, y, 'chiabomber')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.moving = false
    this.direction = DIRECTIONS.LEFT
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)

    if(!this.isAlive) {
      return
    }

    if(this.moving) {
      if([DIRECTIONS.UP, DIRECTIONS.DOWN].includes(this.direction)) {

      }
      if([DIRECTIONS.LEFT, DIRECTIONS.RIGHT].includes(this.direction)) {

      }
      this.x += this.direction[0] * delta
      this.x += this.direction[1] * delta

    }
  }
}