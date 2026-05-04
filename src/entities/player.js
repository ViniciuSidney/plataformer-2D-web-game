import { Entity } from "./entity.js";
import { PLAYER_CONFIG } from "../config/playerConfig.js";
import { GAME_CONFIG } from "../config/gameConfig.js";
import { clamp } from "../utils/math.js";

export class Player extends Entity {
  constructor() {
    super({
      x: PLAYER_CONFIG.x,
      y: PLAYER_CONFIG.y,
      width: PLAYER_CONFIG.width,
      height: PLAYER_CONFIG.height,
      color: PLAYER_CONFIG.color,
    });

    this.speed = PLAYER_CONFIG.speed;
  }

  update(inputSystem) {
    this.move(inputSystem);
    this.limitToWorld();
  }

  move(inputSystem) {
    if (inputSystem.isPressed("left")) {
      this.x -= this.speed;
    }

    if (inputSystem.isPressed("right")) {
      this.x += this.speed;
    }
  }

  limitToWorld() {
    this.x = clamp(
      this.x,
      0,
      GAME_CONFIG.worldWidth - this.width
    );

    this.y = clamp(
      this.y,
      0,
      GAME_CONFIG.worldHeight - this.height
    );
  }
}