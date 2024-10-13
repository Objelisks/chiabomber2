import { GRID_WIDTH, GRID_HEIGHT, GRID_TOP, GRID_LEFT, DIRECTIONS, FACING_ANGLES, MIN_DIST_TO_GRID, GRID_TILE_WIDTH, GRID_TILE_HEIGHT } from '../constants'
import { MudBalloon } from './balloon'
import { EnemyMine } from './mine'
import { pick, nearestGridX, nearestGridY, distance, opposite } from '../util'

// slower than player
const MOVE_SPEED = 0.15
const HIT_DISTANCE = 20

const ranks = ['Green', 'Blue', 'Yellow', 'Red', 'Black']

const getDirectionOptions = (x, y, facing) => {
  const opts = []
  if(x >= GRID_LEFT + GRID_TILE_WIDTH) {
    opts.push(DIRECTIONS.LEFT)
  }
  if(y >= GRID_TOP + GRID_TILE_HEIGHT) {
    opts.push(DIRECTIONS.UP)
  }
  if(x <= GRID_LEFT + GRID_WIDTH - GRID_TILE_WIDTH) {
    opts.push(DIRECTIONS.RIGHT)
  }
  if(y <= GRID_TOP + GRID_HEIGHT - GRID_TILE_HEIGHT) {
    opts.push(DIRECTIONS.DOWN)
  }
  opts.push(opposite(facing))
  return opts
}

export const Enemy = class extends Phaser.GameObjects.Sprite {
  constructor(scene, rank, x, y) {
    super(scene, x, y, `bomber_${rank}_left`)
    this.rank = rank

    this.depth = 5
    scene.add.existing(this)

    this.facing = DIRECTIONS.LEFT
    this.moving = DIRECTIONS.LEFT
    this.myMud = null
    this.mines = 5
    this.turnTimeout = 0
    this.defeated = false
  }

  hit() {
    if(this.rank === 'Green') {
      this.kill()
      return
    }
    // downgrade if higher rank
    this.rank = ranks[ranks.findIndex((rank) => rank === this.rank)-1]
  }

  kill() {
    this.defeated = true

    // spinnnn
    this.scene.tweens.add({
      targets: this,
      angle: 360,
      scale: 0.1,
      duration: 500,
      onComplete: () => {
        this.destroy()
      }
    })
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)

    if(this.defeated || this.scene.pause) {
      return
    }

    const oldX = this.x
    const oldY = this.y
    
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

    // shoot check
    const dirToPlayer = Math.atan2(this.scene.player.y-this.y, this.scene.player.x-this.x) * 180 / Math.PI
    const isPlayerInFront = Math.min(
      Math.abs(dirToPlayer - FACING_ANGLES[this.facing]),
      Math.abs(dirToPlayer - FACING_ANGLES[this.facing] + 360),
      Math.abs(dirToPlayer - FACING_ANGLES[this.facing] - 360)
    ) < 1
    // can see one grid width per rank (Green sees a single grid tile, Black sees 5 ahead)
    const viewDistance = (ranks.findIndex((rank) => rank === this.rank)+1) * GRID_TILE_WIDTH

    if(isPlayerInFront
      && distance(this, this.scene.player) < viewDistance
      && !this.scene.player.defeated
      && this.myMud === null) {
      this.scene.sound.play('bazooka')
      this.myMud = new MudBalloon(this.scene, this.x, this.y, this.facing)
        .on('destroy', () => {
          this.myMud = null
        })
    }

    // mine check, totally random, but gives a similar density to retail
    if(Math.random() < 0.00025) {
      const newMine = new EnemyMine(this.scene, this.x, this.y, this.facing)
      this.scene.mineObjs.push(newMine)
    }

    this.turnTimeout -= delta

    // if we're stuck against a wall try to turn
    if(this.x === oldX && this.y === oldY) {
      this.turnTimeout = 0
    }
    
    // if we're moving up/down and close to a left/right intersection
    if([DIRECTIONS.UP, DIRECTIONS.DOWN].includes(this.moving)
      && this.turnTimeout <= 0
      && Math.abs((this.y-GRID_TOP)-nearestGridY(this.y)) < MIN_DIST_TO_GRID) {
      this.moving = pick(getDirectionOptions(this.x, this.y, this.facing))
      this.turnTimeout = Math.random()*1000+1000

    // if we're moving left/right and close to an up/down intersection
    } else if([DIRECTIONS.LEFT, DIRECTIONS.RIGHT].includes(this.moving)
      && this.turnTimeout <= 0
      && Math.abs((this.x-GRID_LEFT)-nearestGridX(this.x)) < MIN_DIST_TO_GRID) {
      this.moving = pick(getDirectionOptions(this.x, this.y, this.facing))
      this.turnTimeout = Math.random()*1000+1000
    }
    
    // hit the player when we walk into them
    if(distance(this.scene.player, this) < HIT_DISTANCE) {
      this.scene.sound.play('collision')
      this.scene.player.hit()
    }
  }
}