import { pick } from "./util"
import {GRID_TILE_WIDTH, GRID_TILE_HEIGHT, GRID_WIDTH, GRID_HEIGHT, GRID_TOP, GRID_LEFT, ROCK_OFFSET} from './constants'
import { Player } from "./guys/player"

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
  }

  preload() {
    this.load.image('game_bg', 'shapes/167.png')
    this.load.image('game_grid', 'shapes/169.png')
    this.load.image('game_banner', 'shapes/168.png')
    this.load.image('game_button', 'shapes/148.png')
    this.load.image('game_button_hover', 'shapes/150.png')
    this.load.image('game_button_active', 'shapes/152.png')
    this.load.image('rock1_1', 'shapes/57.png')
    this.load.image('rock1_2', 'shapes/59.png')
    this.load.image('rock1_3', 'shapes/61.png')
    
    this.load.image('geoffrey_right', 'shapes/77.png')
    this.load.image('geoffrey_left', 'shapes/78.png')
    this.load.image('geoffrey_up', 'shapes/79.png')
    this.load.image('geoffrey_down', 'shapes/80.png')
    this.load.image('chiabomber', 'shapes/22.png')
  }

  create () {
    this.add.image(this.game.config.width*.5, this.game.config.height*.5, 'game_bg')
      .setOrigin(0.5, 0.5)
      .setScale(1.1, 1.21)
    this.add.image(this.game.config.width*.5, this.game.config.height*.47, 'game_grid')
      .setOrigin(0.5, 0.5)
      .setScale(1.1, 1.1)
    this.add.image(this.game.config.width*.5, this.game.config.height*.92, 'game_banner')
      .setOrigin(0.5, 0.5)
      .setScale(1.1, 1.1)

    this.add.text(this.game.config.width*.06, this.game.config.height*.905, 'Score:',
      {fontFamily:'geoffrey', fontSize: 20, color: '#FFCB33'})
    this.scoreText = this.add.text(this.game.config.width*.18, this.game.config.height*.903, this.score,
      {fontFamily:'geoffrey', fontSize: 22, color: '#FFF'})
    this.updateScore = (score) => {
      this.score = score
      this.scoreText.setText(this.score)
    }
    this.add.text(this.game.config.width*.35, this.game.config.height*.905, 'Lives:',
      {fontFamily:'geoffrey', fontSize: 20, color: '#FFCB33'})
    this.livesText = this.add.text(this.game.config.width*.46, this.game.config.height*.903, this.lives,
      {fontFamily:'geoffrey', fontSize: 22, color: '#FFF'})
    this.updateLives = (lives) => {
      this.lives = lives
      this.livesText.setText(this.lives)
    }
    this.add.text(this.game.config.width*.55, this.game.config.height*.905, 'Mines:',
      {fontFamily:'geoffrey', fontSize: 20, color: '#FFCB33'})
    this.minesText = this.add.text(this.game.config.width*.665, this.game.config.height*.903, this.mines,
      {fontFamily:'geoffrey', fontSize: 22, color: '#FFF'})
    this.updateMines = (mines) => {
      this.mines = mines
      this.minesText.setText(this.mines)
    }

    this.add.group([
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
          this.scene.scene.start('GameOver')
        }),
      this.add.text(this.game.config.width*.77, this.game.config.height*.90, 'End Game',
        {fontFamily:'geoffrey', fontSize: 18, color: '#FFCB98'})
    ])

    this.setupLevel(0)
  }

  setupLevel(level) {
    this.rocks.forEach(rock => rock.destroy())
    for(let x = 0; x<8; x++) {
      for(let y=0; y<6; y++) {
        const newRock = this.add.image(
          GRID_LEFT + x * GRID_TILE_WIDTH + ROCK_OFFSET,
          GRID_TOP + y * GRID_TILE_HEIGHT + ROCK_OFFSET,
          pick(['rock1_1', 'rock1_2', 'rock1_3'])
        ).setRotation(Math.floor(Math.random()*4)*Math.PI/2)
        this.rocks.push(newRock)
      }
    }

    // const enemyCounts = levels[level]
    // Object.keys(enemyCounts).forEach(enemyType => {
    //   for(let i=0; i<enemyCounts[enemyType]; i++) {
    //     const x = GRID_LEFT + GRID_WIDTH/2 + Math.random() * GRID_WIDTH/2
    //     const y = GRID_TOP
    //     this.enemies.push(new Enemy(enemyType, x, y))
    //   }
    // })
    this.player = new Player(this, GRID_LEFT, GRID_TOP + GRID_HEIGHT)
  }

  update() {
    // this.enemies.forEach(enemy => enemy.update())
  }
}