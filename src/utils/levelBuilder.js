import { GAME_CONFIG } from '../config/gameConfig.js';

const TILE_SIZE = GAME_CONFIG.tileSize;

export function toPixels(value) {
   return value * TILE_SIZE;
}

export function position(column, row) {
   return {
      x: toPixels(column),
      y: toPixels(row),
   };
}

export function platform(
   column,
   row,
   widthInTiles = 1,
   heightInTiles = 1,
   options = {},
) {
   return {
      x: toPixels(column),
      y: toPixels(row),
      width: toPixels(widthInTiles),
      height: toPixels(heightInTiles),
      ...options,
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

export function hazard(column, row, widthInTiles = 1, heightInTiles = 0.5) {
   return {
      x: toPixels(column),
      y: toPixels(row),
      width: toPixels(widthInTiles),
      height: toPixels(heightInTiles),
   };
}

export function collectible(column, row, sizeInTiles = 0.4) {
   return {
      x: toPixels(column),
      y: toPixels(row),
      width: toPixels(sizeInTiles),
      height: toPixels(sizeInTiles),
   };
}
