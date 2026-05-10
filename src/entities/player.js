import { Entity } from './entity.js';
import { PLAYER_CONFIG } from '../config/playerConfig.js';
import { GAME_CONFIG } from '../config/gameConfig.js';
import { PHYSICS_CONFIG } from '../config/physicsConfig.js';
import { clamp } from '../utils/math.js';

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

      this.coyoteTime = PLAYER_CONFIG.coyoteTime;
      this.coyoteTimeCounter = 0;

      this.jumpBufferTime = PLAYER_CONFIG.jumpBufferTime;
      this.jumpBufferCounter = 0;

      this.wasJumpPressed = false;

      this.previousX = this.x;
      this.previousY = this.y;

      this.animationMoveBlend = 0;

      this.isOnGround = false;
      this.facing = 1;
   }

   update(inputSystem) {
      this.savePreviousPosition();

      this.handleMovement(inputSystem);
      this.updateJumpBuffer(inputSystem);
      this.handleJump();
      this.handleVariableJump(inputSystem);
      this.applyGravity();

      this.updateAnimationState();
   }

   updateAnimationState() {
      const targetMoveBlend = this.isMovingOnGround() ? 1 : 0;
      const blendSpeed = PLAYER_CONFIG.animationBlendSpeed;

      this.animationMoveBlend +=
         (targetMoveBlend - this.animationMoveBlend) * blendSpeed;
   }

   isMovingOnGround() {
      return this.isOnGround && Math.abs(this.velocityX) > 0.2;
   }

   isIdle() {
      return this.isOnGround && Math.abs(this.velocityX) < 0.15;
   }

   savePreviousPosition() {
      this.previousX = this.x;
      this.previousY = this.y;
   }

   handleMovement(inputSystem) {
      const movingLeft = inputSystem.isPressed('left');
      const movingRight = inputSystem.isPressed('right');

      const controlMultiplier = this.isOnGround ? 1 : this.airControl;

      if (movingLeft && !movingRight) {
         this.velocityX -= this.acceleration * controlMultiplier;
         this.facing = -1;
      }

      if (movingRight && !movingLeft) {
         this.velocityX += this.acceleration * controlMultiplier;
         this.facing = 1;
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

   handleJump() {
      const hasBufferedJump = this.jumpBufferCounter > 0;
      const canUseCoyoteTime = this.coyoteTimeCounter > 0;

      if (hasBufferedJump && canUseCoyoteTime) {
         this.velocityY = -this.jumpForce;
         this.isOnGround = false;

         this.jumpBufferCounter = 0;
         this.coyoteTimeCounter = 0;
      }
   }

   handleVariableJump(inputSystem) {
      const isJumpPressed = inputSystem.isPressed('jump');

      if (!isJumpPressed && this.velocityY < 0) {
         this.velocityY *= this.jumpCutMultiplier;
      }
   }

   updateCoyoteTime() {
      if (this.isOnGround) {
         this.coyoteTimeCounter = this.coyoteTime;
      } else if (this.coyoteTimeCounter > 0) {
         this.coyoteTimeCounter--;
      }
   }

   updateJumpBuffer(inputSystem) {
      const isJumpPressed = inputSystem.isPressed('jump');
      const justPressedJump = isJumpPressed && !this.wasJumpPressed;

      if (justPressedJump) {
         this.jumpBufferCounter = this.jumpBufferTime;
      } else if (this.jumpBufferCounter > 0) {
         this.jumpBufferCounter--;
      }

      this.wasJumpPressed = isJumpPressed;
   }

   applyGravity() {
      const isFalling = this.velocityY > 0;
      const gravityMultiplier = isFalling
         ? PHYSICS_CONFIG.fallGravityMultiplier
         : 1;

      this.velocityY += PHYSICS_CONFIG.gravity * gravityMultiplier;

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

      this.y = Math.max(this.y, 0);
   }

   isIdle() {
      return (
         this.isOnGround &&
         Math.abs(this.velocityX) < 0.15 &&
         Math.abs(this.velocityY) < 0.15
      );
   }

   draw(renderer, camera) {
      renderer.drawPlayerCharacter(
         this.x,
         this.y,
         this.width,
         this.height,
         {
            bodyColor: PLAYER_CONFIG.color,
            topColor: PLAYER_CONFIG.topColor,
            shadeColor: PLAYER_CONFIG.shadeColor,
            eyeColor: PLAYER_CONFIG.eyeColor,

            idle: this.isIdle(),
            moving: this.isMovingOnGround(),
            moveBlend: this.animationMoveBlend,
            facing: this.facing,

            idleStretchAmplitude: PLAYER_CONFIG.idleStretchAmplitude,
            idleStretchSpeed: PLAYER_CONFIG.idleStretchSpeed,

            walkSquashAmplitude: PLAYER_CONFIG.walkSquashAmplitude,
            walkSquashSpeed: PLAYER_CONFIG.walkSquashSpeed,
         },
         camera,
      );
   }

   reset(startPosition) {
      this.x = startPosition.x;
      this.y = startPosition.y;

      this.velocityX = 0;
      this.velocityY = 0;

      this.isOnGround = false;
      this.coyoteTimeCounter = 0;
      this.jumpBufferCounter = 0;
      this.wasJumpPressed = false;
   }
}
