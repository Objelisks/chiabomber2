
const instructions_text_1 = `Chia Bombers have invaded Geoffrey Chia's
neighbourhood and are attacking him and his friends with
their nasty mud-slinging bazookas! Geoffrey has set
out with his home made water-ballon gun in an effort
to drive them out of town!

Use the ARROW KEYS to move Geoffrey.
Use the SPACEBAR to fire the bazooka.
Use the 'M' KEY to drop a mine (up to 5 per level).
Your mines cannot hurt you.
Chia bomber mines cannot hurt Chia bombers.

There are 5 different Chia Bombers. Each Chia bomber
can take a different number of hits before it is removed.`

const instructions_text_2 = `The color of the Chia Bomber will change according to
the hitpoints left.

The color and corresponding hitpoints of the Chia
Bombers are as follows:
Green = 1 hitpoint
Blue = 2 hitpoints
Yellow = 3 hitpoints
Red = 4 hitpoints
Black = 5 hitpoints

The Chia Bombers have limited range which increases
after level 6 and 12. Once witin range, the Chia Bombers
will chase after you and fire at you.

There is a total of 12 levels.
`

export const Instructions = class extends Phaser.Scene {
  constructor() {
    super('Instructions')
  }

  preload() {
  }

  create () {
    let page = 1
    this.add.image(this.game.config.width*.5, 0, 'grid').setOrigin(0.5, 0)
    this.add.image(this.game.config.width*.5, this.game.config.height*.1, 'text_bg').setOrigin(0.5, 0)
    const instructions = this.add.text(this.game.config.width*.5, this.game.config.height*.12, instructions_text_1,
      {fontFamily: 'geoffrey', fontSize: 16, color: '#FFCB00', align: 'center', lineSpacing: 5})
      .setOrigin(0.5, 0)
  
    const backButton = this.add.group([
      this.add.image(this.game.config.width*.20, this.game.config.height*.90, 'game_button')
        .setInteractive()
        .on('pointerover', function() {
          this.setTexture('game_button_hover')
        })
        .on('pointerout', function() {
          this.setTexture('game_button')
        })
        .on('pointerdown', function() {
          this.setTexture('game_button_active')
        })
        .on('pointerup', function() {
          this.setTexture('game_button_hover')
          this.scene.sound.play('stone_button_press')
          switch(page) {
            case 1:
              this.scene.scene.start('Menu')
              break;
            case 2:
              instructions.setText(instructions_text_1)
              nextButton.setVisible(true)
              page = 1
              break;
          }
          
        }),
      this.add.text(this.game.config.width*.16, this.game.config.height*.88, 'Back',
        {fontFamily:'geoffrey', fontSize: 18, color: '#FFCB98'})
    ])
  
    const nextButton = this.add.group([
      this.add.image(this.game.config.width*.80, this.game.config.height*.90, 'game_button')
        .setInteractive()
        .on('pointerover', function() {
          this.setTexture('game_button_hover')
        })
        .on('pointerout', function() {
          this.setTexture('game_button')
        })
        .on('pointerdown', function() {
          this.setTexture('game_button_active')
        })
        .on('pointerup', function() {
          this.sound.play('stone_button_press')
          instructions.setText(instructions_text_2)
          nextButton.setVisible(false)
          page = 2
        }.bind(this)),
      this.add.text(this.game.config.width*.76, this.game.config.height*.88, 'Next',
        {fontFamily:'geoffrey', fontSize: 18, color: '#FFCB98'})
      ])
  
  }
}