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

export function platform(column, row, widthInTiles, heightInTiles = 1) {
   return {
      x: toPixels(column),
      y: toPixels(row),
      width: toPixels(widthInTiles),
      height: toPixels(heightInTiles),
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

export function hole(column, widthInTiles) {
   return {
      column,
      width: widthInTiles,
   };
}

export function groundWithHoles(
   startColumn,
   row,
   widthInTiles,
   heightInTiles = 1,
   holes = [],
) {
   const sortedHoles = [...holes].sort((a, b) => a.column - b.column);

   const platforms = [];
   let currentColumn = startColumn;
   const endColumn = startColumn + widthInTiles;

   for (const currentHole of sortedHoles) {
      const holeStart = currentHole.column;
      const holeEnd = currentHole.column + currentHole.width;

      if (holeStart > currentColumn) {
         platforms.push(
            platform(
               currentColumn,
               row,
               holeStart - currentColumn,
               heightInTiles,
            ),
         );
      }

      currentColumn = Math.max(currentColumn, holeEnd);
   }

   if (currentColumn < endColumn) {
      platforms.push(
         platform(currentColumn, row, endColumn - currentColumn, heightInTiles),
      );
   }

   return platforms;
}

export function hazard(column, row, widthInTiles = 1, heightInTiles = 1) {
   return {
      x: toPixels(column),
      y: toPixels(row),
      width: toPixels(widthInTiles),
      height: toPixels(heightInTiles),
   };
}
