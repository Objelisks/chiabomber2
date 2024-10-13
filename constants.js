export const DIRECTIONS = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
}
export const FACING_ANGLES = {
  [DIRECTIONS.UP]: -90,
  [DIRECTIONS.DOWN]: 90,
  [DIRECTIONS.LEFT]: 180,
  [DIRECTIONS.RIGHT]: 0,
}

export const ANIMATIONS = {
  'explosion': [13, 14, 15],
  'mudExplosion': [18, 19, 20],
  'waterExplosion': [25, 26, 27],
  'mineExplosion': [29, 30, 31]
}

export const ROCKS = [
  [57, 59, 61],
  [51, 53, 55],
  [45, 47, 49],
  [39, 41, 43],
  [33, 35, 37]
]

export const GRID_TILE_WIDTH = 66.666
export const GRID_TILE_HEIGHT = 66.666
export const GRID_WIDTH = 533.333
export const GRID_HEIGHT = 400
export const GRID_TOP = 100
export const GRID_LEFT = 50
export const MIN_DIST_TO_GRID = 10
export const ROCK_OFFSET = 35