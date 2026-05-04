import { Entity } from "./entity.js";
import { PLAYER_CONFIG } from "../config/playerConfig.js";
import { GAME_CONFIG } from "../config/gameConfig.js";
import { PHYSICS_CONFIG } from "../config/physicsConfig.js";
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
    this.isOnGround = false;
  }

  update(inputSystem) {
    this.handleMovement(inputSystem);
    this.applyGravity();
    this.updatePosition();
    this.handleWorldFloorCollision();
    this.limitToWorldHorizontal();
  }

  handleMovement(inputSystem) {
    this.velocityX = 0;

    if (inputSystem.isPressed("left")) {
      this.velocityX = -this.speed;
    }

    if (inputSystem.isPressed("right")) {
      this.velocityX = this.speed;
    }
  }

  applyGravity() {
    this.velocityY += PHYSICS_CONFIG.gravity;

    if (this.velocityY > PHYSICS_CONFIG.maxFallSpeed) {
      this.velocityY = PHYSICS_CONFIG.maxFallSpeed;
    }
  }

  updatePosition() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  handleWorldFloorCollision() {
    const floorY = GAME_CONFIG.worldHeight - this.height;

    if (this.y >= floorY) {
      this.y = floorY;
      this.velocityY = 0;
      this.isOnGround = true;
    } else {
      this.isOnGround = false;
    }
  }

  limitToWorldHorizontal() {
    this.x = clamp(
      this.x,
      0,
      GAME_CONFIG.worldWidth - this.width
    );
  }
}