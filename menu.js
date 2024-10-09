
export const Menu = class extends Phaser.Scene {
  constructor() {
    super('Menu')
  }

  preload() {
    this.load.image('grid', 'shapes/128.png')
    this.load.image('logo_bg', 'shapes/130.png')
    this.load.image('logo', 'shapes/131.png')
    this.load.image('logo_geoffrey', 'shapes/133.png')
    this.load.image('button', 'shapes/134.png')
    this.load.image('button_hover', 'shapes/137.png')
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
        this.scene.scene.start('Instructions')
      })
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
        this.scene.scene.start('Game')
      })
    this.add.text(this.game.config.width*.66, this.game.config.height*.74, 'Play Game', {fontFamily:'geoffrey', fontSize: 16})
    
    const soundText = this.add.text(this.game.config.width*.44, this.game.config.height*.88, 'Sound Off', {fontFamily:'geoffrey', fontSize: 16})
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
        soundText.setText(`Sound ${this.sound.mute ? 'On' : 'Off'}`)
      }.bind(this))
    soundText.setDepth(100)
  }
}