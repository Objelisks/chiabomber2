import { ANIMATIONS, ROCKS } from '../constants'

const bomberImages = {
  Green: [82, 83, 84, 85],
  Blue: [87, 88, 89, 90],
  Yellow: [92, 93, 94, 95],
  Red: [97, 98, 99, 100],
  Black: [102, 103, 104, 105]
}

export const Preload = class extends Phaser.Scene {
  constructor() {
    super('Preload')
  }

  preload() {
    // menu
    this.load.audio('button_press', 'sounds/11_woodclick.mp3')
    this.load.image('grid', 'shapes/128.png')
    this.load.image('logo_bg', 'shapes/130.png')
    this.load.image('logo', 'shapes/131.png')
    this.load.image('logo_geoffrey', 'shapes/133.png')
    this.load.image('button', 'shapes/134.png')
    this.load.image('button_hover', 'shapes/137.png')

    // instructions
    this.load.audio('stone_button_press', 'sounds/3_stonesound.mp3')
    this.load.image('grid', 'shapes/128.png')
    this.load.image('text_bg', 'shapes/145.png')
    this.load.image('game_button', 'shapes/148.png')
    this.load.image('game_button_hover', 'shapes/150.png')
    this.load.image('game_button_active', 'shapes/152.png')

    // game
    this.load.audio('stone_button_press', 'sounds/3_stonesound.mp3')
    this.load.audio('water_balloon', 'sounds/2_waterballoon.mp3')
    this.load.audio('bazooka', 'sounds/8_bazooka.mp3')
    this.load.audio('mine_explosion', 'sounds/7_minesound.mp3')
    this.load.audio('collision', 'sounds/10_collisionsound.mp3')
    this.load.audio('complete', 'sounds/9_completesound.mp3')
    this.load.audio('popup', 'sounds/5_popupsound.mp3')

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

    ROCKS.forEach((set, index) => {
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

    Object.keys(ANIMATIONS).forEach(key => {
      ANIMATIONS[key].forEach((frame, index) => {
        this.load.image(`${key}${index}`, `shapes/${frame}.png`)
      })
    })
  }

  create () {
    this.scene.start('Menu')
  }
}