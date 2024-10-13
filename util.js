import {GRID_TILE_WIDTH, GRID_TILE_HEIGHT, GRID_TOP, GRID_LEFT, DIRECTIONS} from './constants'

export const pick = (arr) => arr[Math.floor(Math.random()*arr.length)]

export const nearestGridY = (y) => {
  return Math.round((y - GRID_TOP) / GRID_TILE_HEIGHT) * GRID_TILE_HEIGHT
}
export const nearestGridX = (x) => {
  return Math.round((x - GRID_LEFT) / GRID_TILE_WIDTH) * GRID_TILE_WIDTH
}

export const distance = (xy1, xy2) => {
  return Math.sqrt(Math.pow(xy2.x-xy1.x, 2) + Math.pow(xy2.y-xy1.y, 2))
}

export const opposite = (facing) => {
  switch(facing) {
    case DIRECTIONS.UP: return DIRECTIONS.DOWN
    case DIRECTIONS.DOWN: return DIRECTIONS.UP
    case DIRECTIONS.LEFT: return DIRECTIONS.RIGHT
    case DIRECTIONS.RIGHT: return DIRECTIONS.LEFT
  }
}