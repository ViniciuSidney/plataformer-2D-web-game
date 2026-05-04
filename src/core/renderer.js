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

  drawRect(x, y, width, height, color, camera = { x: 0, y: 0 }) {
    this.context.fillStyle = color;

    this.context.fillRect(x - camera.x, y - camera.y, width, height);
  }

  drawWorldGrid(camera) {
    const spacing = 120;

    this.context.strokeStyle = "#2a2a35";
    this.context.lineWidth = 1;

    for (let x = 0; x <= GAME_CONFIG.worldWidth; x += spacing) {
      const screenX = x - camera.x;

      this.context.beginPath();
      this.context.moveTo(screenX, 0);
      this.context.lineTo(screenX, this.canvas.height);
      this.context.stroke();
    }
  }
}
