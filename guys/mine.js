import {GRID_WIDTH, GRID_HEIGHT, GRID_TOP, GRID_LEFT} from '../constants'
import { distance } from '../util'

const HIT_DISTANCE = 10

export const PlayerMine = class extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_mine')
    scene.add.existing(this)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    this.scene.enemies.forEach(enemy => {
      if(distance(enemy, this) < HIT_DISTANCE) {
        enemy.destroy()
        enemy.defeated = true
        this.scene.mineKills += 1
        this.scene.score += 10
        this.destroy()
      }
    })
  }
}

export const EnemyMine = class extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy_mine')
    scene.add.existing(this)
  }

  preUpdate(time, delta) {
    if(distance(this.scene.player, this) < HIT_DISTANCE) {
      this.scene.levelLose()
      this.destroy()
    }
  }
}