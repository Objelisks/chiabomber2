import {GRID_TILE_WIDTH, GRID_TILE_HEIGHT, GRID_WIDTH, GRID_HEIGHT, GRID_TOP, GRID_LEFT, DIRECTIONS, MIN_DIST_TO_GRID} from '../constants'

const MOVE_SPEED = 0.2

const distanceToGridLineVert = (y) => {
  const tiledY = ((y - GRID_TOP) % GRID_TILE_HEIGHT)
  return Math.min(Math.abs(tiledY-GRID_TILE_HEIGHT), tiledY)
}
const distanceToGridLineHorz = (x) => {
  const tiledX = ((x - GRID_LEFT) % GRID_TILE_WIDTH)
  return Math.min(Math.abs(tiledX-GRID_TILE_WIDTH), tiledX)
}

const nearestGridY = (y) => {
  return Math.round((y - GRID_TOP) / GRID_TILE_HEIGHT) * GRID_TILE_HEIGHT
}
const nearestGridX = (x) => {
  return Math.round((x - GRID_LEFT) / GRID_TILE_WIDTH) * GRID_TILE_WIDTH
}


export const Player = class extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'geoffrey_left')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.isAlive = true

    this.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    this.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    this.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    this.space = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)

    if(!this.isAlive) {
      return
    }

    // left and right prioritized over up and down
    if(
      this.left.isDown
      && this.x > GRID_LEFT
      && Math.abs((this.y-GRID_TOP)-nearestGridY(this.y)) < MIN_DIST_TO_GRID
    ) {
      this.x += MOVE_SPEED * DIRECTIONS.LEFT[0] * delta
      this.y = GRID_TOP + nearestGridY(this.y)
      this.setTexture('geoffrey_left')
    }
    else if(
      this.right.isDown
      && this.x < GRID_LEFT + GRID_WIDTH
      && Math.abs((this.y-GRID_TOP)-nearestGridY(this.y)) < MIN_DIST_TO_GRID
    ) {
      this.x += MOVE_SPEED * DIRECTIONS.RIGHT[0] * delta
      this.y = GRID_TOP + nearestGridY(this.y)
      this.setTexture('geoffrey_right')
    }
    else if(
      this.up.isDown
      && this.y > GRID_TOP
      && Math.abs((this.x-GRID_LEFT)-nearestGridX(this.x)) < MIN_DIST_TO_GRID
    ) {
      this.x = GRID_LEFT + nearestGridX(this.x)
      this.y += MOVE_SPEED * DIRECTIONS.UP[1] * delta
      this.setTexture('geoffrey_up')
    }
    else if(
      this.down.isDown
      && this.y < GRID_TOP + GRID_HEIGHT
      && Math.abs((this.x-GRID_LEFT)-nearestGridX(this.x)) < MIN_DIST_TO_GRID
    ) {
      this.x = GRID_LEFT + nearestGridX(this.x)
      this.y += MOVE_SPEED * DIRECTIONS.DOWN[1] * delta
      this.setTexture('geoffrey_down')
    }
    if(Phaser.Input.Keyboard.JustDown(this.space)) {
      //fire bullet
    }
  }
}