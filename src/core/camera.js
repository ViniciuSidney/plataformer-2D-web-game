import { GAME_CONFIG } from "../config/gameConfig.js";
import { clamp } from "../utils/math.js";

export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;

    this.width = GAME_CONFIG.width;
    this.height = GAME_CONFIG.height;

    this.worldWidth = GAME_CONFIG.worldWidth;
    this.worldHeight = GAME_CONFIG.worldHeight;
  }

  follow(target) {
    const targetCenterX = target.x + target.width / 2;
    const targetCenterY = target.y + target.height / 2;

    this.x = targetCenterX - this.width / 2;
    this.y = targetCenterY - this.height / 2;

    this.limitToWorld();
  }

  limitToWorld() {
    this.x = clamp(this.x, 0, this.worldWidth - this.width);
    this.y = clamp(this.y, 0, this.worldHeight - this.height);
  }
}