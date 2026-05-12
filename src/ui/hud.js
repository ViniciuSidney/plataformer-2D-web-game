import { GAME_CONFIG } from "../config/gameConfig.js";
import { GAME_STATES } from "../utils/constants.js";
import { levels } from "../levels/index.js";

export function createHUDData(game) {
  if (!shouldShowHUD(game)) {
    return null;
  }

  return [
    {
      text: `Fase ${game.currentLevelIndex + 1}/${levels.length} — ${game.currentLevel.name}`,
      type: "normal",
    },
    {
      text: `Moedas: ${game.collectedCount}/${game.collectibles.length}`,
      type: "coins",
      pulse: game.coinHUDPulse || 0,
    },
    {
      text: "Objetivo: chegue ao portal",
      type: "normal",
    },
  ];
}

function shouldShowHUD(game) {
  return !GAME_CONFIG.debug.levelEditMode && game.state === GAME_STATES.PLAYING;
}
