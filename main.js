import {Menu} from './scenes/menu'
import {Instructions} from './scenes/instructions'
import {Game} from './scenes/game'

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 640,
  scene: [Menu, Instructions, Game],
  physics: {
    default: 'arcade'
  }
};

const game = new Phaser.Game(config)