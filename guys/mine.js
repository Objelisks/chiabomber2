import { distance } from '../util'

const HIT_DISTANCE = 10

export const PlayerMine = class extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_mine')
    this.depth = 1
    scene.add.existing(this)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    this.scene.enemies.forEach(enemy => {
      if(this.scene && distance(enemy, this) < HIT_DISTANCE) {
        // immediately kill enemy
        enemy.kill()
        this.scene.mineKills += 1
        this.scene.updateScore(this.scene.score + 10)
        this.scene.sound.play('mine_explosion')
        this.scene.add.sprite(this.x, this.y).play('mineExplosion')
          .on(Phaser.Animations.Events.ANIMATION_COMPLETE, function() {
            this.destroy()
          })
        this.destroy()
        return
      }
    })
  }
}

export const EnemyMine = class extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy_mine')
    this.depth = 0
    scene.add.existing(this)
  }

  preUpdate(time, delta) {
    if(this.scene.pause) {
      return
    }

    // hit an enemy mine, lose a life
    if(distance(this.scene.player, this) < HIT_DISTANCE) {
      this.scene.sound.play('mine_explosion')
      this.scene.player.hit()
      this.destroy()
    }
  }
}