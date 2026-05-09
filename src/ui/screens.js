import { GAME_STATES } from '../utils/constants.js';

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

      decoration: {
         type: 'menu-scene',

         grounds: [
            {
               column: 0,
               row: 14,
               width: 14,
               height: 2,
               sprite: 'ground',
               visualType: 'ground',
            },
            {
               column: 17,
               row: 14,
               width: 13,
               height: 2,
               sprite: 'ground',
               visualType: 'ground',
            },
         ],

         platforms: [
            {
               column: 3,
               row: 13,
               width: 3,
               height: 1,
               sprite: 'platform',
               visualType: 'platform',
            },
            {
               column: 19,
               row: 12,
               width: 4,
               height: 2,
               sprite: 'platform',
               visualType: 'platform',
            },
         ],

         collectibles: [
            {
               column: 4.3,
               row: 12,
               size: 0.4,
               color: '#ffd166',
            },
            {
               column: 20.3,
               row: 11,
               size: 0.4,
               color: '#ffd166',
            },
            {
               column: 22.3,
               row: 11,
               size: 0.4,
               color: '#ffd166',
            },
         ],

         hazards: [
            {
               column: 10,
               row: 13.5,
               width: 2,
               height: 0.5,
               color: '#ff5c7a',
            },
         ],

         goal: {
            column: 27,
            row: 12,
            width: 1,
            height: 2,
            color: '#2dd4bf',
         },

         player: {
            column: 8,
            row: 13,
            width: 1,
            height: 1,
            color: '#f5f5f5',
         },
      },
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
      subtitle: 'Vish, você perdeu de algum jeito aí...',

      primaryAction: "'R' — tentar novamente",
      primaryActionEffect: 'glow',

      lines: ["'M' — menu inicial"],

      accentColor: '#ff5c7a',
      backgroundColor: '#000000',
      backgroundOpacity: 0.55,
   };
}
