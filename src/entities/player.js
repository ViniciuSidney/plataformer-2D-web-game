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
    this.jumpForce = PLAYER_CONFIG.jumpForce;

    this.previousX = this.x;
    this.previousY = this.y;

    this.isOnGround = false;
  }

  update(inputSystem) {
    this.savePreviousPosition();

    this.handleMovement(inputSystem);
    this.handleJump(inputSystem);
    this.applyGravity();
  }

  savePreviousPosition() {
    this.previousX = this.x;
    this.previousY = this.y;
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

  handleJump(inputSystem) {
    if (inputSystem.isPressed("jump") && this.isOnGround) {
      this.velocityY = -this.jumpForce;
      this.isOnGround = false;
    }
  }

  applyGravity() {
    this.velocityY += PHYSICS_CONFIG.gravity;

    if (this.velocityY > PHYSICS_CONFIG.maxFallSpeed) {
      this.velocityY = PHYSICS_CONFIG.maxFallSpeed;
    }
  }

  moveX() {
    this.x += this.velocityX;

    this.x = clamp(
      this.x,
      0,
      GAME_CONFIG.worldWidth - this.width
    );
  }

  moveY() {
    this.y += this.velocityY;

    this.y = clamp(
      this.y,
      0,
      GAME_CONFIG.worldHeight - this.height
    );
  }
}