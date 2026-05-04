import { Entity } from "./entity.js";
import { PLAYER_CONFIG } from "../config/playerConfig.js";

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
  }

  move(inputSystem) {
    if (inputSystem.isPressed("left")) {
      this.x -= this.speed;
    }

    if (inputSystem.isPressed("right")) {
      this.x += this.speed;
    }
  }
}
