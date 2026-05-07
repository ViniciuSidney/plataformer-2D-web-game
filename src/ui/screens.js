import { GAME_STATES } from "../utils/constants.js";

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
    variant: "fullscreen",
    title: "Pulando e Caindo",
    subtitle: "Um jogo plataforma minimalista.",

    primaryAction: "'Enter' — Jogar!",

    lines: ["A/D ou ←/→ — Mover", "Espaço/W/↑ — Pular", "Esc — Pausar"],
    accentColor: "#f5f5f5",
    backgroundColor: "#101014",
    backgroundOpacity: 1,

    decoration: {
      type: "menu-scene",

      grounds: [
        { x: 0, y: 496, width: 440, height: 44, color: "#242432" },
        { x: 540, y: 496, width: 420, height: 44, color: "#242432" },
      ],

      platforms: [
        { x: 86, y: 464, width: 96, height: 32, color: "#2b2b3a" },
        { x: 592, y: 439, width: 128, height: 57, color: "#2b2b3a" },
      ],

      collectibles: [
        { x: 134, y: 446, radius: 7, color: "#ffd166" },
        { x: 625, y: 421, radius: 7, color: "#ffd166" },
        { x: 695, y: 421, radius: 7, color: "#ffd166" },
      ],

      hazards: [{ x: 318, y: 496, width: 64, height: 18, color: "#ff5c7a" }],

      goal: {
        x: 848,
        y: 438,
        width: 12,
        height: 58,
        poleColor: "#6ee7b7",
        flagColor: "#db3567",
      },

      player: {
        x: 236,
        y: 468,
        width: 28,
        height: 28,
        color: "#f5f5f5",
      },
    },
  };
}

function createPauseScreen() {
  return {
    variant: "panel",
    title: "Jogo pausado",
    subtitle: "Respira um pouco e volta no ritmo.",
    lines: ["Esc — continuar", "R — reiniciar fase"],
    accentColor: "#8be9fd",
    backgroundColor: "#000000",
    backgroundOpacity: 0.55,
  };
}

function createWinScreen(game) {
  const hasNextLevel = game.currentLevelIndex < game.totalLevels - 1;

  return {
    title: hasNextLevel ? "Fase concluída!" : "Jogo concluído!",
    subtitle: hasNextLevel
      ? `Moedas coletadas: ${game.collectedCount}/${game.collectibles.length}`
      : `Você concluiu todas as fases disponíveis.\nMoedas da fase: ${game.collectedCount}/${game.collectibles.length}`,
    lines: hasNextLevel
      ? ["N — próxima fase", "R — repetir fase"]
      : ["R — jogar novamente"],
    accentColor: "#ffd166",
    backgroundOpacity: 0.55,
  };
}

function createGameOverScreen() {
  return {
    title: "Game Over!",
    subtitle: "Você caiu ou tocou em um perigo.",
    lines: ["R — tentar novamente"],
    accentColor: "#ff5c7a",
    backgroundOpacity: 0.55,
  };
}
