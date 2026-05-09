import {
   platform,
   position,
   goal,
   collectible,
   hazard,
} from '../utils/levelBuilder.js';

const TILE_SYMBOLS = {
   EMPTY: '.',
   BLOCK: 'B',
   PLATFORM: 'P',
   PLAYER: 'J',
   GOAL: 'G',
   COLLECTIBLE: 'C',
   HAZARD: 'H',
};

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

/* =========================================================
   NOVO: junta blocos na horizontal E na vertical
========================================================= */
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

      if (!isSolidTile(tile)) {
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
   const visualType = run.tileType === TILE_SYMBOLS.BLOCK ? 'auto' : 'platform';

   return platform(run.startColumn, run.row, run.width, run.height, {
      visualType,
   });
}

/* =========================================================
   especiais
========================================================= */
function parseSpecialTiles(rowText, row, levelData) {
   for (let column = 0; column < rowText.length; column++) {
      const tile = rowText[column];

      if (tile === TILE_SYMBOLS.PLAYER) {
         levelData.playerStart = position(column, row);
      }

      if (tile === TILE_SYMBOLS.GOAL) {
         levelData.goal = goal(column, row - 1, 1, 2);
      }

      if (tile === TILE_SYMBOLS.COLLECTIBLE) {
         levelData.collectibles.push(collectible(column + 0.25, row + 0.25));
      }

      if (tile === TILE_SYMBOLS.HAZARD) {
         levelData.hazards.push(hazard(column, row + 0.5, 1, 0.5));
      }
   }
}

function isSolidTile(tile) {
   return tile === TILE_SYMBOLS.BLOCK || tile === TILE_SYMBOLS.PLATFORM;
}

function validateLevel(levelData) {
   if (!levelData.goal) {
      console.warn(`Level "${levelData.name}" não possui objetivo final.`);
   }
}
