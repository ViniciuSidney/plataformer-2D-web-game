import { GAME_CONFIG } from "../config/gameConfig.js";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  clear() {
    this.context.fillStyle = GAME_CONFIG.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawRect(x, y, width, height, color) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  }
}