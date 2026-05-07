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
    lines: [
      "Enter — jogar",
      "A/D ou ←/→ — mover",
      "Espaço/W/↑ — pular",
      "Esc — pausar",
    ],
    accentColor: "#f5f5f5",
    backgroundColor: "#101014",
    backgroundOpacity: 1,
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
