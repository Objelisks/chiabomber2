import { pick } from "../util"
import {GRID_TILE_WIDTH, GRID_TILE_HEIGHT, GRID_WIDTH, GRID_HEIGHT, GRID_TOP, GRID_LEFT, ROCK_OFFSET} from '../constants'
import { Player } from "../guys/player"
import { Enemy } from "../guys/enemy"

const levels = [
  {'Green': 8, 'Blue': 0, 'Yellow': 0, 'Red': 0, 'Black': 0}, // 1
  {'Green': 7, 'Blue': 1, 'Yellow': 0, 'Red': 0, 'Black': 0}, // 2
  {'Green': 6, 'Blue': 2, 'Yellow': 0, 'Red': 0, 'Black': 0}, // 3
  {'Green': 5, 'Blue': 2, 'Yellow': 1, 'Red': 0, 'Black': 0}, // 4
  {'Green': 4, 'Blue': 2, 'Yellow': 2, 'Red': 0, 'Black': 0}, // 5
  {'Green': 3, 'Blue': 2, 'Yellow': 2, 'Red': 1, 'Black': 0}, // 6
  {'Green': 2, 'Blue': 2, 'Yellow': 2, 'Red': 2, 'Black': 0}, // 7
  {'Green': 1, 'Blue': 2, 'Yellow': 2, 'Red': 2, 'Black': 1}, // 8
  {'Green': 0, 'Blue': 2, 'Yellow': 2, 'Red': 2, 'Black': 2}, // 9
  {'Green': 0, 'Blue': 2, 'Yellow': 2, 'Red': 2, 'Black': 2}, // 10
  {'Green': 0, 'Blue': 0, 'Yellow': 3, 'Red': 3, 'Black': 3}, // 11
  {'Green': 0, 'Blue': 0, 'Yellow': 0, 'Red': 5, 'Black': 5}, // 12
]

const bomberImages = {
  Green: [82, 83, 84, 85],
  Blue: [87, 88, 89, 90],
  Yellow: [92, 93, 94, 95],
  Red: [97, 98, 99, 100],
  Black: [102, 103, 104, 105]
}

const levelWinText = 'Get ready for Level'
const levelLoseText = `Be more careful next time!
You have lost a life.`
const gameWinText = `Congratulations!
You have completed all 12 levels.`
const continueText = 'Press space to continue'

const animations = {
  'explosion': [13, 14, 15],
  'mudExplosion': [18, 19, 20],
  'waterExplosion': [25, 26, 27],
  'mineExplosion': [29, 30, 31]
}

const rocks = [
  [57, 59, 61],
  [51, 53, 55],
  [45, 47, 49],
  [39, 41, 43],
  [33, 35, 37]
]

export const Game = class extends Phaser.Scene {
  constructor() {
    super('Game')

    this.score = 0
    this.lives = 3
    this.mines = 5
    this.level = 0

    this.scoreText = null
    this.livesText = null
    this.minesText = null

    this.player = null
    this.enemies = []
    this.rocks = []
    this.mineObjs = []
    this.balloonKills = 0
    this.mineKills = 0
    this.levelStartScore = 0
    this.levelStartBalloonKills = 0
    this.levelStartMineKills = 0

    this.typed = []
    this.codeUsed = false
    this.topStart = false
  }

  preload() {
    this.load.audio('stone_button_press', 'sounds/3_stonesound.mp3')

    this.load.image('game_bg', 'shapes/167.png')
    this.load.image('game_grid', 'shapes/169.png')
    this.load.image('game_banner', 'shapes/168.png')
    this.load.image('game_button', 'shapes/148.png')
    this.load.image('game_button_hover', 'shapes/150.png')
    this.load.image('game_button_active', 'shapes/152.png')
    this.load.image('neopoint_icon', 'shapes/195.png')
    this.load.image('restart_icon', 'shapes/198.png')
    this.load.image('button', 'shapes/134.png')
    this.load.image('button_hover', 'shapes/137.png')

    rocks.forEach((set, index) => {
      set.forEach((sprite, variation) => {
        this.load.image(`rock${index}_${variation+1}`, `shapes/${sprite}.png`)  
      })
    })

    this.load.image('modal_bg', 'shapes/108.png')
    this.load.image('modal', 'shapes/110.png')
    this.load.image('level_win', 'shapes/120.png')
    this.load.image('level_lose', 'shapes/116.png')
    this.load.image('game_win', 'shapes/111.png')
    
    this.load.image('geoffrey_right', 'shapes/77.png')
    this.load.image('geoffrey_left', 'shapes/78.png')
    this.load.image('geoffrey_up', 'shapes/79.png')
    this.load.image('geoffrey_down', 'shapes/80.png')

    this.load.image('balloon_right', 'shapes/72.png')
    this.load.image('balloon_left', 'shapes/73.png')
    this.load.image('balloon_up', 'shapes/74.png')
    this.load.image('balloon_down', 'shapes/75.png')
    
    this.load.image('mud_right', 'shapes/66.png')
    this.load.image('mud_left', 'shapes/65.png')
    this.load.image('mud_up', 'shapes/63.png')
    this.load.image('mud_down', 'shapes/64.png')

    this.load.image('player_mine', 'shapes/68.png')
    this.load.image('enemy_mine', 'shapes/70.png')

    Object.keys(bomberImages).forEach((rank) => {
      const images = bomberImages[rank]
      this.load.image(`bomber_${rank}_up`, `shapes/${images[0]}.png`)
      this.load.image(`bomber_${rank}_down`, `shapes/${images[1]}.png`)
      this.load.image(`bomber_${rank}_left`, `shapes/${images[2]}.png`)
      this.load.image(`bomber_${rank}_right`, `shapes/${images[3]}.png`)
    })

    Object.keys(animations).forEach(key => {
      animations[key].forEach((frame, index) => {
        this.load.image(`${key}${index}`, `shapes/${frame}.png`)
      })
    })

    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
  }

  create () {
    const stoneButtonPressAudio = this.sound.add('stone_button_press')

    Object.keys(animations).forEach(key => {
      const frames = animations[key].map((frame, index) => ({key: `${key}${index}` }))
      this.anims.create({
        key: `${key}`,
        frames: frames,
        frameRate: 30,
        repeat: 0
      })
    })

    this.add.image(this.game.config.width*.5, this.game.config.height*.5, 'game_bg')
      .setOrigin(0.5, 0.5)
      .setScale(1.1, 1.21)
    this.add.image(this.game.config.width*.5, this.game.config.height*.47, 'game_grid')
      .setOrigin(0.5, 0.5)
      .setScale(1.1, 1.1)

    this.bannerGroup = this.add.group([
      this.add.image(this.game.config.width*.5, this.game.config.height*.92, 'game_banner')
      .setOrigin(0.5, 0.5)
      .setScale(1.1, 1.1)
    ])

    this.bannerGroup.addMultiple([
      this.add.text(this.game.config.width*.06, this.game.config.height*.905, 'Score:',
        {fontFamily:'geoffrey', fontSize: 20, color: '#FFCB33'}),
      this.scoreText = this.add.text(this.game.config.width*.18, this.game.config.height*.903, this.score,
        {fontFamily:'geoffrey', fontSize: 22, color: '#FFF'})
    ])
    this.updateScore = function(score) {
      this.score = score
      this.scoreText.setText(this.score)
    }
    
    this.bannerGroup.addMultiple([
      this.add.text(this.game.config.width*.35, this.game.config.height*.905, 'Lives:',
        {fontFamily:'geoffrey', fontSize: 20, color: '#FFCB33'}),
      this.livesText = this.add.text(this.game.config.width*.46, this.game.config.height*.903, this.lives,
        {fontFamily:'geoffrey', fontSize: 22, color: '#FFF'})
    ])
    this.updateLives = function(lives) {
      this.lives = lives
      this.livesText.setText(this.lives)
    }
    
    this.bannerGroup.addMultiple([
      this.add.text(this.game.config.width*.55, this.game.config.height*.905, 'Mines:',
        {fontFamily:'geoffrey', fontSize: 20, color: '#FFCB33'}),
      this.minesText = this.add.text(this.game.config.width*.665, this.game.config.height*.903, this.mines,
        {fontFamily:'geoffrey', fontSize: 22, color: '#FFF'})
    ])
    this.updateMines = function(mines) {
      this.mines = mines
      this.minesText.setText(this.mines)
    }

    this.bannerGroup.addMultiple([
      this.add.image(this.game.config.width*.84, this.game.config.height*.92, 'game_button')
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
          stoneButtonPressAudio.play()
          this.scoreScreen()
        }.bind(this)),
      this.add.text(this.game.config.width*.77, this.game.config.height*.90, 'End Game',
        {fontFamily:'geoffrey', fontSize: 18, color: '#FFCB98'})
    ])

    this.input.keyboard.on('keydown', (e) => {
      if(this.codeUsed) {
        return
      }
      this.typed.push(e.key)
      if(!'geoffrey'.startsWith(this.typed.join(''))) {
        this.typed = [e.key]
      } else {
        if('geoffrey' === this.typed.join('')) {
          this.codeUsed = true
          this.updateLives(++this.lives)
        }
      }
    })

    this.baseLevel = this.add.group([...this.children.list])

    this.setupLevel(0)
  }

  levelWin() {
    this.pause = true
    this.level++
    if(this.level > levels.length) {
      this.gameWin()
      return
    }

    const modalGroup = this.add.group([
      this.add.image(this.game.config.width*.5, 0, 'modal_bg')
        .setScale(2, 2)
        .setAlpha(0.7)
        .setOrigin(0.5, 0),
      this.add.image(this.game.config.width*.5, this.game.config.height*.1, 'modal')
        .setScale(1.4, 2.0)
        .setOrigin(0.5, 0),
      this.add.text(this.game.config.width*.45, this.game.config.height*.25, levelWinText,
        {fontFamily: 'geoffrey', fontSize: 24, color: '#FFCB00', align: 'center', lineSpacing: 5})
        .setOrigin(0.5, 0),
      this.add.text(this.game.config.width*.68, this.game.config.height*.25, `${this.level+1}`,
        {fontFamily: 'geoffrey', fontSize: 24, color: '#FFF', align: 'center', lineSpacing: 5})
        .setOrigin(0.5, 0),
      this.add.image(this.game.config.width*.45, this.game.config.height*.35, 'level_win').setOrigin(0.5, 0),
      this.add.text(this.game.config.width*.5, this.game.config.height*.65, continueText,
        {fontFamily: 'geoffrey', fontSize: 20, color: '#FFF', align: 'center', lineSpacing: 5})
        .setOrigin(0.5, 0),
    ])
    this.input.keyboard.once('keydown-SPACE', () => {
      modalGroup.destroy(true, true)
      if(this.player.y === GRID_TOP && this.right.isDown) {
        this.topStart = true
      }
      this.setupLevel(this.level)
    })
  }

  levelLose() {
    this.pause = true
    this.updateLives(this.lives - 1)
    if(this.lives === 0) {
      this.scoreScreen()
      return
    }
    // reset score, except on last life, just end the game
    this.score = this.levelStartScore
    this.balloonKills = this.levelStartBalloonKills
    this.mineKills = this.levelStartMineKills

    const modalGroup = this.add.group([
      this.add.image(this.game.config.width*.5, 0, 'modal_bg')
        .setScale(2, 2)
        .setAlpha(0.7)
        .setOrigin(0.5, 0),
      this.add.image(this.game.config.width*.5, this.game.config.height*.1, 'modal')
        .setScale(1.4, 2.0)
        .setOrigin(0.5, 0),
      this.add.text(this.game.config.width*.5, this.game.config.height*.2, levelLoseText,
        {fontFamily: 'geoffrey', fontSize: 24, color: '#FFF', align: 'center', lineSpacing: 5})
        .setOrigin(0.5, 0),
      this.add.image(this.game.config.width*.5, this.game.config.height*.33, 'level_lose').setOrigin(0.5, 0),
      this.add.text(this.game.config.width*.5, this.game.config.height*.65, continueText,
        {fontFamily: 'geoffrey', fontSize: 20, color: '#FFF', align: 'center', lineSpacing: 5})
        .setOrigin(0.5, 0),
    ])
    this.input.keyboard.once('keydown-SPACE', () => {
      modalGroup.destroy(true, true)
      this.setupLevel(this.level)
    })
  }

  gameWin() {
    this.pause = true

    const modalGroup = this.add.group([
      this.add.image(this.game.config.width*.5, 0, 'modal_bg')
        .setScale(2, 2)
        .setAlpha(0.7)
        .setOrigin(0.5, 0),
      this.add.image(this.game.config.width*.5, this.game.config.height*.1, 'modal')
        .setScale(1.4, 2.0)
        .setOrigin(0.5, 0),
      this.add.text(this.game.config.width*.5, this.game.config.height*.22, gameWinText,
        {fontFamily: 'geoffrey', fontSize: 24, color: '#FFF', align: 'center', lineSpacing: 5})
        .setOrigin(0.5, 0),
      this.add.image(this.game.config.width*.48, this.game.config.height*.38, 'game_win')
        .setScale(1.2, 1.2)
        .setOrigin(0.5, 0),
      this.add.text(this.game.config.width*.5, this.game.config.height*.65, continueText,
        {fontFamily: 'geoffrey', fontSize: 20, color: '#FFF', align: 'center', lineSpacing: 5})
        .setOrigin(0.5, 0),
    ])
    this.input.keyboard.once('keydown-SPACE', () => {
      modalGroup.destroy(true, true)
      this.scoreScreen()
    })
  }

  scoreScreen() {
    this.pause = true
    this.bannerGroup.setVisible(false)

    const totalScore = this.score
      + this.balloonKills * 3
      + this.mineKills * 2 

    const modalGroup = this.add.group([
      this.add.image(this.game.config.width*.5, 0, 'modal_bg')
        .setScale(2, 2)
        .setAlpha(0.7)
        .setOrigin(0.5, 0),
      this.add.image(this.game.config.width*.5, this.game.config.height*.1, 'modal')
        .setScale(1.4, 2.0)
        .setOrigin(0.5, 0),
      this.add.text(this.game.config.width*.5, this.game.config.height*.20, "GAME OVER",
        {fontFamily: 'geoffrey', fontSize: 32, color: '#000', align: 'center', lineSpacing: 5})
        .setOrigin(0.5, 0),
      this.add.text(this.game.config.width*.5, this.game.config.height*.3, "Your Score:",
        {fontFamily: 'geoffrey', fontSize: 20, color: '#FFCB00', align: 'right', lineSpacing: 5})
        .setOrigin(1, 0),
      this.add.text(this.game.config.width*.5, this.game.config.height*.36, "Balloon Kill Bonus:",
        {fontFamily: 'geoffrey', fontSize: 20, color: '#00FF00', align: 'right', lineSpacing: 5})
        .setOrigin(1, 0),
      this.add.text(this.game.config.width*.5, this.game.config.height*.42, "Mine Kill Bonus:",
        {fontFamily: 'geoffrey', fontSize: 20, color: '#00FF00', align: 'right', lineSpacing: 5})
        .setOrigin(1, 0),
      this.add.text(this.game.config.width*.5, this.game.config.height*.48, "Final Score:",
        {fontFamily: 'geoffrey', fontSize: 20, color: '#FFF', align: 'right', lineSpacing: 5})
        .setOrigin(1, 0),

      this.add.text(this.game.config.width*.8, this.game.config.height*.3, `${this.score}`,
        {fontFamily: 'geoffrey', fontSize: 24, color: '#FFCB00', align: 'right', lineSpacing: 5})
        .setOrigin(1, 0),
      this.add.text(this.game.config.width*.8, this.game.config.height*.36, `${this.balloonKills}x3 = ${this.balloonKills*3}`,
        {fontFamily: 'geoffrey', fontSize: 24, color: '#00FF00', align: 'right', lineSpacing: 5})
        .setOrigin(1, 0),
      this.add.text(this.game.config.width*.8, this.game.config.height*.42, `${this.mineKills}x2 = ${this.mineKills*2}`,
        {fontFamily: 'geoffrey', fontSize: 24, color: '#00FF00', align: 'right', lineSpacing: 5})
        .setOrigin(1, 0),
      this.add.text(this.game.config.width*.8, this.game.config.height*.48, `${totalScore}`,
        {fontFamily: 'geoffrey', fontSize: 24, color: '#FFF', align: 'right', lineSpacing: 5})
        .setOrigin(1, 0),

      this.add.image(this.game.config.width*.28, this.game.config.height*.74, 'button')
        .setInteractive()
        .on('pointerover', function() {
          this.setTexture('button_hover')
        })
        .on('pointerout', function() {
          this.setTexture('button')
        })
        .on('pointerdown', function() {
          // TODO: send score here
        }.bind(this)),
      this.add.text(this.game.config.width*.19, this.game.config.height*.72, 'Send Score', {fontFamily:'geoffrey', fontSize: 16}),
      this.add.image(this.game.config.width*.365, this.game.config.height*.735, 'neopoint_icon')
        .setScale(0.35, 0.35),

      this.add.image(this.game.config.width*.68, this.game.config.height*.74, 'button')
        .setInteractive()
        .on('pointerover', function() {
          this.setTexture('button_hover')
        })
        .on('pointerout', function() {
          this.setTexture('button')
        })
        .on('pointerdown', function() {
          this.scene.start('Menu')
        }.bind(this)),
      this.add.text(this.game.config.width*.61, this.game.config.height*.72, 'Restart', {fontFamily:'geoffrey', fontSize: 16}),
      this.add.image(this.game.config.width*.755, this.game.config.height*.74, 'restart_icon')
        .setScale(0.35, 0.35),
    ])
  }

  setupLevel(level) {
    this.pause = false
    this.levelStartScore = this.score
    this.levelStartBalloonKills = this.balloonKills
    this.levelStartMineKills = this.mineKills
    
    this.mineObjs.forEach(mine => mine.destroy())
    this.mineObjs = []

    this.rocks.forEach(rock => rock.destroy())
    this.rocks = []
    for(let x = 0; x<8; x++) {
      for(let y=0; y<6; y++) {
        const rockImg = `rock${(this.level)%rocks.length}_${pick([1,2,3])}`
        const newRock = this.add.image(
          GRID_LEFT + x * GRID_TILE_WIDTH + ROCK_OFFSET,
          GRID_TOP + y * GRID_TILE_HEIGHT + ROCK_OFFSET,
          rockImg
        ).setRotation(Math.floor(Math.random()*8)*Math.PI/4)
        this.rocks.push(newRock)
      }
    }

    const enemyCounts = levels[level]
    this.enemies.forEach(enemy => enemy.destroy())
    this.enemies = []
    Object.keys(enemyCounts).forEach(rank => {
      for(let i=0; i<enemyCounts[rank]; i++) {
        const x = GRID_LEFT + GRID_WIDTH/2 + Math.random() * GRID_WIDTH/2
        const y = GRID_TOP
        const newEnemy = new Enemy(this, rank, x, y)
          .on('destroy', () => {
            this.enemies = this.enemies.filter(enemy => !enemy.defeated)
            if(this.enemies.length === 0) {
              this.levelWin()
            }
          })
          this.enemies.push(newEnemy)
      }
    })

    if(this.player) {
      this.player.destroy()
    }
    this.player = new Player(this, GRID_LEFT, this.topStart ? GRID_TOP : GRID_TOP + GRID_HEIGHT)

    this.topStart = false
  }
}