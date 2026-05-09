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
               x: 0,
               y: 486,
               width: 440,
               height: 54,
               sprite: 'ground',
               visualType: 'ground',
            },
            {
               x: 560,
               y: 486,
               width: 400,
               height: 54,
               sprite: 'ground',
               visualType: 'ground',
            },
         ],

         platforms: [
            {
               x: 86,
               y: 450,
               width: 96,
               height: 36,
               sprite: 'platform',
               visualType: 'platform',
            },
            {
               x: 590,
               y: 430,
               width: 128,
               height: 56,
               sprite: 'platform',
               visualType: 'platform',
            },
         ],

         collectibles: [
            { x: 134, y: 425, radius: 7, color: '#ffd166' },
            { x: 625, y: 405, radius: 7, color: '#ffd166' },
            { x: 695, y: 405, radius: 7, color: '#ffd166' },
         ],

         hazards: [{ x: 315, y: 486, width: 64, height: 20, color: '#ff5c7a' }],

         goal: {
            x: 846,
            y: 428,
            width: 32,
            height: 58,
            color: '#2dd4bf',
         },

         player: {
            x: 235,
            y: 458,
            width: 26,
            height: 28,
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
