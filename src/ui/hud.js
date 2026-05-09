import { GAME_CONFIG } from '../config/gameConfig.js';
import { GAME_STATES } from '../utils/constants.js';
import { levels } from '../levels/index.js';

export function createHUDData(game) {
   if (!shouldShowHUD(game)) {
      return null;
   }

   return [createLevelLine(game), createCoinsLine(game), createObjectiveLine()];
}

function shouldShowHUD(game) {
   return (
      !GAME_CONFIG.debug.levelEditMode && game.state === GAME_STATES.PLAYING
   );
}

function createLevelLine(game) {
   return `Fase ${game.currentLevelIndex + 1}/${levels.length} — ${game.currentLevel.name}`;
}

function createCoinsLine(game) {
   return `Moedas: ${game.collectedCount}/${game.collectibles.length}`;
}

function createObjectiveLine() {
   return 'Objetivo: chegue ao portal';
}
