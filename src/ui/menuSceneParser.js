import {
   getTileDefinition,
   getEntityDefinition,
   isSolidSymbol,
} from '../levels/levelSymbols.js';

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

   const solidTiles = buildMergedSolidTiles(rows);

   solidTiles.forEach((tile) => {
      if (tile.visualType === 'ground') {
         scene.grounds.push(tile);
      } else {
         scene.platforms.push(tile);
      }
   });

   rows.forEach((rowText, row) => {
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

function buildMergedSolidTiles(rows) {
   const mergedTiles = [];
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
               symbol: currentRun.symbol,
               column: currentRun.column,
               row: currentRun.row,
               width: currentRun.width,
               height: 1,
            });
         }
      });

      activeRuns.forEach((finishedRun) => {
         mergedTiles.push(convertRunToMenuTile(finishedRun));
      });

      activeRuns = nextActiveRuns;
   });

   activeRuns.forEach((finishedRun) => {
      mergedTiles.push(convertRunToMenuTile(finishedRun));
   });

   return mergedTiles;
}

function extractSolidRuns(rowText, row) {
   const runs = [];
   let column = 0;

   while (column < rowText.length) {
      const symbol = rowText[column];

      if (!isSolidSymbol(symbol)) {
         column++;
         continue;
      }

      const startColumn = column;
      let width = 0;

      while (rowText[column] === symbol) {
         width++;
         column++;
      }

      runs.push({
         symbol,
         column: startColumn,
         row,
         width,
      });
   }

   return runs;
}

function canMergeRuns(activeRun, currentRun) {
   return (
      activeRun.symbol === currentRun.symbol &&
      activeRun.column === currentRun.column &&
      activeRun.width === currentRun.width &&
      activeRun.row + activeRun.height === currentRun.row
   );
}

function convertRunToMenuTile(run) {
   const tileDefinition = getTileDefinition(run.symbol);

   return {
      column: run.column,
      row: run.row,
      width: run.width,
      height: run.height,
      visualType: tileDefinition.visualType,
      sprite: tileDefinition.sprite,
   };
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
            size: 0.4,
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
