import { GAME_CONFIG } from "../config/gameConfig.js";
import { Renderer } from "./renderer.js";
import { Loop } from "./loop.js";
import { Camera } from "./camera.js";
import { Player } from "../entities/player.js";
import { InputSystem } from "../systems/inputSystem.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);

    this.inputSystem = new InputSystem();
    this.player = new Player();
    this.camera = new Camera();

    this.loop = new Loop(
      () => this.update(),
      () => this.draw(),
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
    this.player.update(this.inputSystem);
    this.camera.follow(this.player);
  }

  draw() {
    this.renderer.clear();
    this.renderer.drawWorldGrid(this.camera);
    this.renderer.drawWorldFloor(this.camera);
    this.player.draw(this.renderer, this.camera);
  }
}
