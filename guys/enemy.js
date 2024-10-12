import {GRID_WIDTH, GRID_HEIGHT, GRID_TOP, GRID_LEFT, DIRECTIONS, MIN_DIST_TO_GRID, GRID_TILE_WIDTH, GRID_TILE_HEIGHT} from '../constants'
import {WaterBalloon} from './balloon'
import {pick, nearestGridX, nearestGridY, distance } from '../util'

const MOVE_SPEED = 0.15
const HIT_DISTANCE = 10

const ranks = ['Green', 'Blue', 'Yellow', 'Red', 'Black']

const getDirectionOptions = (x, y) => {
  const opts = []
  if(x > GRID_LEFT + GRID_TILE_WIDTH) {
    opts.push(DIRECTIONS.LEFT)
  }
  if(y > GRID_TOP + GRID_TILE_HEIGHT) {
    opts.push(DIRECTIONS.UP)
  }
  if(x < GRID_LEFT + GRID_WIDTH - GRID_TILE_WIDTH) {
    opts.push(DIRECTIONS.RIGHT)
  }
  if(y < GRID_TOP + GRID_HEIGHT - GRID_TILE_HEIGHT) {
    opts.push(DIRECTIONS.DOWN)
  }
  return opts
}

export const Enemy = class extends Phaser.GameObjects.Sprite {
  constructor(scene, rank, x, y) {
    super(scene, x, y, `bomber_${rank}_left`)
    this.rank = rank

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.facing = DIRECTIONS.LEFT
    this.moving = DIRECTIONS.LEFT
    this.myMud = null
    this.mines = 5
    this.turnTimeout = 0
    this.defeated = false

    this.shoot = null
    this.mine = null
  }

  hit() {
    if(this.rank === 'Green') {
      this.defeated = true
      this.scene.tweens.add({
        targets: this,
        angle: 360,
        scale: 0.1,
        duration: 500,
        onComplete: () => {
          this.destroy()
        }
      })
      return
    }
    this.rank = ranks[ranks.findIndex((rank) => rank === this.rank)-1]
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)

    if(this.defeated || this.scene.pause) {
      return
    }

    this.turnTimeout -= delta

    const oldX = this.x
    const oldY = this.y
    // left and right prioritized over up and down
    if(
      this.moving === DIRECTIONS.LEFT
      && this.x > GRID_LEFT
      && Math.abs((this.y-GRID_TOP)-nearestGridY(this.y)) < MIN_DIST_TO_GRID
    ) {
      this.x += MOVE_SPEED * DIRECTIONS.LEFT[0] * delta
      this.y = GRID_TOP + nearestGridY(this.y)
      this.setTexture(`bomber_${this.rank}_left`)
      this.facing = DIRECTIONS.LEFT
    }
    else if(
      this.moving === DIRECTIONS.RIGHT
      && this.x < GRID_LEFT + GRID_WIDTH
      && Math.abs((this.y-GRID_TOP)-nearestGridY(this.y)) < MIN_DIST_TO_GRID
    ) {
      this.x += MOVE_SPEED * DIRECTIONS.RIGHT[0] * delta
      this.y = GRID_TOP + nearestGridY(this.y)
      this.setTexture(`bomber_${this.rank}_right`)
      this.facing = DIRECTIONS.RIGHT
    }
    else if(
      this.moving === DIRECTIONS.UP
      && this.y > GRID_TOP
      && Math.abs((this.x-GRID_LEFT)-nearestGridX(this.x)) < MIN_DIST_TO_GRID
    ) {
      this.x = GRID_LEFT + nearestGridX(this.x)
      this.y += MOVE_SPEED * DIRECTIONS.UP[1] * delta
      this.setTexture(`bomber_${this.rank}_up`)
      this.facing = DIRECTIONS.UP
    }
    else if(
      this.moving === DIRECTIONS.DOWN
      && this.y < GRID_TOP + GRID_HEIGHT
      && Math.abs((this.x-GRID_LEFT)-nearestGridX(this.x)) < MIN_DIST_TO_GRID
    ) {
      this.x = GRID_LEFT + nearestGridX(this.x)
      this.y += MOVE_SPEED * DIRECTIONS.DOWN[1] * delta
      this.setTexture(`bomber_${this.rank}_down`)
      this.facing = DIRECTIONS.DOWN
    }
    if(this.shoot && this.myMud === null) {
      this.myBalloon = new WaterBalloon(this.scene, this.x, this.y, this.facing)
        .on('destroy', () => {
          this.myBalloon = null
        })
      this.scene.add.existing(this.myBalloon)
    }
    if(this.mine && this.mines > 0) {
      this.myBalloon = new EnemyMine(this.scene, this.x, this.y, this.facing)
        .on('destroy', () => {
          this.myBalloon = null
        })
      this.scene.add.existing(this.myBalloon)
    }

    if(this.x === oldX && this.y === oldY) {
      this.turnTimeout = 0
    }
    
    if([DIRECTIONS.UP, DIRECTIONS.DOWN].includes(this.moving)
      && this.turnTimeout <= 0
      && Math.abs((this.y-GRID_TOP)-nearestGridY(this.y)) < MIN_DIST_TO_GRID) {
      this.moving = pick(getDirectionOptions(this.x, this.y))
      this.turnTimeout = Math.random()*1000+1000
    } else if([DIRECTIONS.LEFT, DIRECTIONS.RIGHT].includes(this.moving)
      && this.turnTimeout <= 0
      && Math.abs((this.x-GRID_LEFT)-nearestGridX(this.x)) < MIN_DIST_TO_GRID) {
      this.moving = pick(getDirectionOptions(this.x, this.y))
      this.turnTimeout = Math.random()*1000+1000
    }
    
    if(distance(this.scene.player, this) < HIT_DISTANCE) {
      this.scene.player.hit()
    }
  }
}