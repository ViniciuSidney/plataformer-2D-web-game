import { GAME_CONFIG } from '../config/gameConfig.js';

import {
   getTileDefinition,
   getEntityDefinition,
   isSolidSymbol,
} from '../levels/levelSymbols.js';

const TILE_SIZE = GAME_CONFIG.tileSize;

export function parseMenuSceneMap(map) {
   const rows = normalizeMapRows(map);

   const scene = {
      type: 'menu-scene',
      grounds: [],
      platforms: [],
      collectibles: [],
      hazards: [],
      goal: null,
      player: null,
   };

   rows.forEach((rowText, row) => {
      parseSolidTiles(rowText, row, scene);
      parseEntities(rowText, row, scene);
   });

   return scene;
}

function normalizeMapRows(map) {
   return map
      .trim()
      .split('\n')
      .map((line) => line.trimEnd());
}

function parseSolidTiles(rowText, row, scene) {
   let column = 0;

   while (column < rowText.length) {
      const symbol = rowText[column];

      if (!isSolidSymbol(symbol)) {
         column++;
         continue;
      }

      const startColumn = column;
      const tileDefinition = getTileDefinition(symbol);

      let width = 0;

      while (rowText[column] === symbol) {
         width++;
         column++;
      }

      const tileObject = {
         column: startColumn,
         row,
         width,
         height: 1,
         visualType: tileDefinition.visualType,
         sprite: tileDefinition.sprite,
      };

      if (tileDefinition.visualType === 'ground') {
         scene.grounds.push(tileObject);
      } else {
         scene.platforms.push(tileObject);
      }
   }
}

function parseEntities(rowText, row, scene) {
   for (let column = 0; column < rowText.length; column++) {
      const symbol = rowText[column];
      const entityDefinition = getEntityDefinition(symbol);

      if (!entityDefinition) continue;

      if (entityDefinition.type === 'playerStart') {
         scene.player = {
            column,
            row,
            width: 1,
            height: 1,
            color: '#f5f5f5',
         };
      }

      if (entityDefinition.type === 'goal') {
         scene.goal = {
            column,
            row: row - 1,
            width: 1,
            height: 2,
            color: '#2dd4bf',
         };
      }

      if (entityDefinition.type === 'collectible') {
         scene.collectibles.push({
            column: column + 0.25,
            row: row + 0.25,
            size: 0.45,
            color: '#ffd166',
         });
      }

      if (entityDefinition.type === 'hazard') {
         scene.hazards.push({
            column,
            row: row + 0.5,
            width: 1,
            height: 0.5,
            color: '#ff5c7a',
         });
      }
   }
}
