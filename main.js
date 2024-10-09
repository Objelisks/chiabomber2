import {Menu} from './menu'
import {Instructions} from './instructions'
import {Game} from './game'

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 640,
  // scene: [Menu, Instructions, Game]
  scene: [Game],
  physics: {
    default: 'arcade'
  }
};

const game = new Phaser.Game(config)