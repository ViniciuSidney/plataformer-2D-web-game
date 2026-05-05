import { GAME_CONFIG } from '../config/gameConfig.js';

const TILE_SIZE = GAME_CONFIG.tileSize;

export function toPixels(value) {
   return value * TILE_SIZE;
}

export function platform(column, row, widthInTiles, heightInTiles = 1) {
   return {
      x: toPixels(column),
      y: toPixels(row),
      width: toPixels(widthInTiles),
      height: toPixels(heightInTiles),
   };
}

export function position(column, row) {
   return {
      x: toPixels(column),
      y: toPixels(row),
   };
}

export function goal(column, row, widthInTiles = 1, heightInTiles = 2) {
   return {
      x: toPixels(column),
      y: toPixels(row),
      width: toPixels(widthInTiles),
      height: toPixels(heightInTiles),
   };
}
