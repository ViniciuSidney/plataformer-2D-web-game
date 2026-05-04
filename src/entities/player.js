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

    this.maxSpeed = PLAYER_CONFIG.maxSpeed;
    this.acceleration = PLAYER_CONFIG.acceleration;
    this.deceleration = PLAYER_CONFIG.deceleration;
    this.airControl = PLAYER_CONFIG.airControl;

    this.jumpForce = PLAYER_CONFIG.jumpForce;
    this.jumpCutMultiplier = PLAYER_CONFIG.jumpCutMultiplier;

    this.wasJumpPressed = false;

    this.previousX = this.x;
    this.previousY = this.y;

    this.isOnGround = false;
  }

  update(inputSystem) {
    this.savePreviousPosition();

    this.handleMovement(inputSystem);
    this.handleJump(inputSystem);
    this.handleVariableJump(inputSystem);
    this.applyGravity();
  }

  savePreviousPosition() {
    this.previousX = this.x;
    this.previousY = this.y;
  }

  handleMovement(inputSystem) {
    const movingLeft = inputSystem.isPressed("left");
    const movingRight = inputSystem.isPressed("right");

    const controlMultiplier = this.isOnGround ? 1 : this.airControl;

    if (movingLeft && !movingRight) {
      this.velocityX -= this.acceleration * controlMultiplier;
    }

    if (movingRight && !movingLeft) {
      this.velocityX += this.acceleration * controlMultiplier;
    }

    if ((!movingLeft && !movingRight) || (movingLeft && movingRight)) {
      this.applyDeceleration();
    }

    this.velocityX = clamp(this.velocityX, -this.maxSpeed, this.maxSpeed);
  }

  applyDeceleration() {
    if (this.velocityX > 0) {
      this.velocityX -= this.deceleration;
    }

    if (this.velocityX < 0) {
      this.velocityX += this.deceleration;
    }

    if (Math.abs(this.velocityX) < this.deceleration) {
      this.velocityX = 0;
    }
  }

  handleJump(inputSystem) {
    const isJumpPressed = inputSystem.isPressed("jump");
    const justPressedJump = isJumpPressed && !this.wasJumpPressed;

    if (justPressedJump && this.isOnGround) {
      this.velocityY = -this.jumpForce;
      this.isOnGround = false;
    }

    this.wasJumpPressed = isJumpPressed;
  }

  handleVariableJump(inputSystem) {
    const isJumpPressed = inputSystem.isPressed("jump");

    if (!isJumpPressed && this.velocityY < 0) {
      this.velocityY *= this.jumpCutMultiplier;
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

    this.x = clamp(this.x, 0, GAME_CONFIG.worldWidth - this.width);
  }

  moveY() {
    this.y += this.velocityY;

    this.y = clamp(this.y, 0, GAME_CONFIG.worldHeight - this.height);
  }
}
