import { GAME_CONFIG } from "../config/gameConfig.js";
import { Renderer } from "./renderer.js";
import { Loop } from "./loop.js";
import { Player } from "../entities/player.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);

    this.player = new Player();

    this.loop = new Loop(
      () => this.update(),
      () => this.draw()
    );

    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas.width = GAME_CONFIG.width;
    this.canvas.height = GAME_CONFIG.height;
  }

  start() {
    this.loop.start();
  }

  update() {
    this.player.update();
  }

  draw() {
    this.renderer.clear();

    this.player.draw(this.renderer);
  }
}