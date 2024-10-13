import {Menu} from './scenes/menu'
import {Instructions} from './scenes/instructions'
import {Game} from './scenes/game'
import {Preload} from './scenes/preload'

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 640,
  scene: [Preload, Menu, Instructions, Game],
  physics: {
    default: 'arcade'
  }
};

const game = new Phaser.Game(config)