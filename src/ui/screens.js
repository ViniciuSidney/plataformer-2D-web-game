import { GAME_STATES } from '../utils/constants.js';
import { menuMap } from './menuMap.js';
import { parseMenuSceneMap } from './menuSceneParser.js';

export function createScreenData(game) {
   const screenFactories = {
      [GAME_STATES.MENU]: createMenuScreen,
      [GAME_STATES.PAUSED]: createPauseScreen,
      [GAME_STATES.WON]: createWinScreen,
      [GAME_STATES.LOST]: createGameOverScreen,
   };

   const createScreen = screenFactories[game.state];

   if (!createScreen) {
      return null;
   }

   return createScreen(game);
}

function createMenuScreen() {
   return {
      variant: 'fullscreen',
      title: 'Pulando e Caindo',
      subtitle: 'Um jogo plataforma minimalista.',

      primaryAction: "'Enter' — Jogar!",
      primaryActionEffect: 'pulse',

      lines: [
         "'A/D' ou '←/→' — Mover",
         "'Espaço/W/↑' — Pular",
         "'Esc' — Pausar",
      ],
      accentColor: '#f5f5f5',
      backgroundColor: '#101014',
      backgroundOpacity: 1,

      decoration: parseMenuSceneMap(menuMap),
   };
}

function createPauseScreen() {
   return {
      variant: 'panel',
      title: 'Jogo pausado',
      subtitle: 'Parou por quê? Joga aí!',

      primaryAction: "'Esc' — continuar",
      primaryActionEffect: 'glow',

      lines: ["'R' — reiniciar fase", "'M' — menu inicial"],

      accentColor: '#8be9fd',
      backgroundColor: '#000000',
      backgroundOpacity: 0.55,
   };
}

function createWinScreen(game) {
   const hasNextLevel = game.currentLevelIndex < game.totalLevels - 1;

   return {
      variant: 'panel',
      title: hasNextLevel ? 'Fase concluída!' : 'Jogo concluído!',

      subtitle: hasNextLevel
         ? `Moedas da fase: ${game.collectedCount}/${game.collectibles.length}`
         : `Você jogou o jogo todo! Aí sim!\nMoedas da fase: ${game.collectedCount}/${game.collectibles.length}`,

      primaryAction: hasNextLevel
         ? "'N' — próxima fase"
         : "'R' — jogar novamente",

      primaryActionEffect: 'glow',

      lines: hasNextLevel
         ? ["'R' — repetir fase", "'M' — menu inicial"]
         : ["'M' — menu inicial"],

      accentColor: hasNextLevel ? '#2dd4bf' : '#ffd166',
      backgroundColor: '#000000',
      backgroundOpacity: 0.55,
   };
}

function createGameOverScreen() {
   return {
      variant: 'panel',
      title: 'Game Over!',
      subtitle: 'Vish, perdeu foi?',

      primaryAction: "'R' — tentar novamente",
      primaryActionEffect: 'glow',

      lines: ["'M' — menu inicial"],

      accentColor: '#ff5c7a',
      backgroundColor: '#000000',
      backgroundOpacity: 0.55,
   };
}
