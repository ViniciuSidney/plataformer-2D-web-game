import {
   platform,
   position,
   goal,
   collectible,
   hazard,
} from '../utils/levelBuilder.js';

import {
   LEVEL_SYMBOLS,
   isSolidSymbol,
   getTileDefinition,
   getEntityDefinition,
} from '../levels/levelSymbols.js';

export function parseLevelText({ name, map }) {
   const rows = normalizeMapRows(map);

   const levelData = {
      name,
      playerStart: position(0, 0),
      platforms: buildMergedPlatforms(rows),
      hazards: [],
      collectibles: [],
      goal: null,
   };

   rows.forEach((rowText, row) => {
      parseSpecialTiles(rowText, row, levelData);
   });

   validateLevel(levelData);

   return levelData;
}

function normalizeMapRows(map) {
   return map
      .trim()
      .split('\n')
      .map((line) => line.trimEnd());
}

function getSolidTileVisualType(tile) {
   const visualTypes = {
      [TILE_SYMBOLS.GROUND]: 'ground',
      [TILE_SYMBOLS.PLATFORM]: 'platform',
      [TILE_SYMBOLS.SEPARATE]: 'separate',
   };

   return visualTypes[tile];
}

function buildMergedPlatforms(rows) {
   const mergedPlatforms = [];
   let activeRuns = [];

   rows.forEach((rowText, row) => {
      const currentRuns = extractSolidRuns(rowText, row);
      const nextActiveRuns = [];

      currentRuns.forEach((currentRun) => {
         const matchingRunIndex = activeRuns.findIndex((activeRun) =>
            canMergeRuns(activeRun, currentRun),
         );

         if (matchingRunIndex !== -1) {
            const matchingRun = activeRuns[matchingRunIndex];

            matchingRun.height += 1;
            nextActiveRuns.push(matchingRun);

            activeRuns.splice(matchingRunIndex, 1);
         } else {
            nextActiveRuns.push({
               tileType: currentRun.tileType,
               startColumn: currentRun.startColumn,
               row: currentRun.row,
               width: currentRun.width,
               height: 1,
            });
         }
      });

      // tudo que sobrou em activeRuns não continuou na linha atual
      activeRuns.forEach((finishedRun) => {
         mergedPlatforms.push(convertRunToPlatform(finishedRun));
      });

      activeRuns = nextActiveRuns;
   });

   // finaliza o que ainda estiver ativo
   activeRuns.forEach((finishedRun) => {
      mergedPlatforms.push(convertRunToPlatform(finishedRun));
   });

   return mergedPlatforms;
}

function extractSolidRuns(rowText, row) {
   const runs = [];
   let column = 0;

   while (column < rowText.length) {
      const tile = rowText[column];

      if (!isSolidSymbol(tile)) {
         column++;
         continue;
      }

      const startColumn = column;
      const tileType = tile;
      let width = 0;

      while (rowText[column] === tileType) {
         width++;
         column++;
      }

      runs.push({
         tileType,
         startColumn,
         row,
         width,
      });
   }

   return runs;
}

function canMergeRuns(activeRun, currentRun) {
   return (
      activeRun.tileType === currentRun.tileType &&
      activeRun.startColumn === currentRun.startColumn &&
      activeRun.width === currentRun.width &&
      activeRun.row + activeRun.height === currentRun.row
   );
}

function convertRunToPlatform(run) {
   const tileDefinition = getTileDefinition(run.tileType);

   return platform(run.startColumn, run.row, run.width, run.height, {
      visualType: tileDefinition.visualType,
      sprite: tileDefinition.sprite,
   });
}

function parseSpecialTiles(rowText, row, levelData) {
   for (let column = 0; column < rowText.length; column++) {
      const symbol = rowText[column];
      const entityDefinition = getEntityDefinition(symbol);

      if (!entityDefinition) continue;

      if (entityDefinition.type === 'playerStart') {
         levelData.playerStart = position(column, row);
      }

      if (entityDefinition.type === 'goal') {
         levelData.goal = goal(column, row - 1, 1, 2);
      }

      if (entityDefinition.type === 'collectible') {
         levelData.collectibles.push(collectible(column + 0.25, row + 0.25));
      }

      if (entityDefinition.type === 'hazard') {
         levelData.hazards.push(hazard(column, row + 0.5, 1, 0.5));
      }
   }
}

function isSolidTile(tile) {
   return Boolean(getSolidTileVisualType(tile));
}

function validateLevel(levelData) {
   if (!levelData.goal) {
      console.warn(`Level "${levelData.name}" não possui objetivo final.`);
   }
}
