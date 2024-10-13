import { GRID_WIDTH, GRID_HEIGHT, GRID_TOP, GRID_LEFT, DIRECTIONS, MIN_DIST_TO_GRID } from '../constants'
import { WaterBalloon } from './balloon'
import { PlayerMine } from './mine'
import { nearestGridX, nearestGridY, distance } from '../util'

// player is slightly faster than bombers, slower than mud
const MOVE_SPEED = 0.2

export const Player = class extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'geoffrey_up')

    this.depth = 10
    scene.add.existing(this)

    this.isAlive = true
    this.facing = DIRECTIONS.UP
    this.myBalloon = null
    this.mineCooldown = 0

    this.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    this.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    this.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    this.space = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.m = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
  }

  destroy(fromScene) {
    super.destroy(fromScene)

    this.myBalloon?.destroy(fromScene)
  }

  hit() {
    if(this.defeated || this.scene.pause) {
      return
    }
    
    // we've been hit by something and we're very fragile
    this.defeated = true
    this.scene.tweens.add({
      targets: this,
      angle: 360,
      scale: 0.1,
      duration: 500,
      onComplete: () => {
        // lose screen after spinning
        this.scene.levelLose()
      }
    })
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)

    if(this.defeated || this.scene.pause) {
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
      this.facing = DIRECTIONS.LEFT
    }
    else if(
      this.right.isDown
      && this.x < GRID_LEFT + GRID_WIDTH
      && Math.abs((this.y-GRID_TOP)-nearestGridY(this.y)) < MIN_DIST_TO_GRID
    ) {
      this.x += MOVE_SPEED * DIRECTIONS.RIGHT[0] * delta
      this.y = GRID_TOP + nearestGridY(this.y)
      this.setTexture('geoffrey_right')
      this.facing = DIRECTIONS.RIGHT
    }
    else if(
      this.up.isDown
      && this.y > GRID_TOP
      && Math.abs((this.x-GRID_LEFT)-nearestGridX(this.x)) < MIN_DIST_TO_GRID
    ) {
      this.x = GRID_LEFT + nearestGridX(this.x)
      this.y += MOVE_SPEED * DIRECTIONS.UP[1] * delta
      this.setTexture('geoffrey_up')
      this.facing = DIRECTIONS.UP
    }
    else if(
      this.down.isDown
      && this.y < GRID_TOP + GRID_HEIGHT
      && Math.abs((this.x-GRID_LEFT)-nearestGridX(this.x)) < MIN_DIST_TO_GRID
    ) {
      this.x = GRID_LEFT + nearestGridX(this.x)
      this.y += MOVE_SPEED * DIRECTIONS.DOWN[1] * delta
      this.setTexture('geoffrey_down')
      this.facing = DIRECTIONS.DOWN
    }

    // fire balloon as fast as possible, but only one at a time
    if(this.space.isDown && this.myBalloon === null) {
      this.scene.sound.play('bazooka')
      this.myBalloon = new WaterBalloon(this.scene, this.x, this.y, this.facing)
        .on('destroy', () => {
          this.myBalloon = null
        })
    }

    this.mineCooldown -= delta/1000
    if(this.m.isDown && this.scene.mines > 0 && this.mineCooldown < 0) {
      const newMine = new PlayerMine(this.scene, this.x, this.y)
      this.scene.updateMines(this.scene.mines-1)
      this.scene.mineObjs.push(newMine)
      // maximum one mine per half second
      this.mineCooldown = 0.5
    }
  }
}