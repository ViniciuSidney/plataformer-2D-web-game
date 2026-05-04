import { Game } from "./core/game.js";

const canvas = document.querySelector("#gameCanvas");

if (!canvas) {
  throw new Error("Canvas não encontrado.");
}

const game = new Game(canvas);

game.start();