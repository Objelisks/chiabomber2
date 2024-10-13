
export const Menu = class extends Phaser.Scene {
  constructor() {
    super('Menu')
  }

  preload() {
  }

  create () {
    this.add.image(this.game.config.width*.5, 0, 'grid').setOrigin(0.5, 0)
    this.add.image(this.game.config.width*.5, 0, 'logo_bg').setOrigin(0.5, 0)
    this.add.image(this.game.config.width*.5, this.game.config.height*.1, 'logo').setOrigin(0.5, 0)
    this.add.image(this.game.config.width*.75, this.game.config.height*.15, 'logo_geoffrey').setOrigin(0.5, 0.5)
  
    this.add.image(this.game.config.width*.28, this.game.config.height*.76, 'button')
      .setInteractive()
      .on('pointerover', function() {
        this.setTexture('button_hover')
      })
      .on('pointerout', function() {
        this.setTexture('button')
      })
      .on('pointerdown', function() {
        this.scene.start('Instructions')
        this.sound.play('button_press')
      }.bind(this))
    this.add.text(this.game.config.width*.20, this.game.config.height*.74, 'Instructions', {fontFamily:'geoffrey', fontSize: 16})
  
    this.add.image(this.game.config.width*.72, this.game.config.height*.76, 'button')
      .setInteractive()
      .on('pointerover', function() {
        this.setTexture('button_hover')
      })
      .on('pointerout', function() {
        this.setTexture('button')
      })
      .on('pointerdown', function() {
        this.scene.start('Game')
        this.sound.play('button_press')
      }.bind(this))
    this.add.text(this.game.config.width*.66, this.game.config.height*.74, 'Play Game', {fontFamily:'geoffrey', fontSize: 16})
    
    const soundText = this.add.text(this.game.config.width*.44, this.game.config.height*.88, `Sound ${this.sound.mute ? 'Off' : 'On'}`, {fontFamily:'geoffrey', fontSize: 16})
    this.add.image(this.game.config.width*.5, this.game.config.height*.90, 'button')
      .setInteractive()
      .on('pointerover', function() {
        this.setTexture('button_hover')
      })
      .on('pointerout', function() {
        this.setTexture('button')
      })
      .on('pointerdown', function() {
        this.sound.mute = !this.sound.mute
        soundText.setText(`Sound ${this.sound.mute ? 'Off' : 'On'}`)
        this.sound.play('button_press')
      }.bind(this))
    soundText.setDepth(100)
  }
}