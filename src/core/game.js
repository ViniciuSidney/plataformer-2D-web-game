import { GAME_CONFIG } from '../config/gameConfig.js';
import { Renderer } from './renderer.js';
import { Loop } from './loop.js';
import { Camera } from './camera.js';

import { Player } from '../entities/player.js';

import { InputSystem } from '../systems/inputSystem.js';
import { LevelSystem } from '../systems/levelSystem.js';
import { CollisionSystem } from '../systems/collisionSystem.js';

import { level01 } from '../levels/level-01.js';

export class Game {
   constructor(canvas) {
      this.canvas = canvas;
      this.renderer = new Renderer(canvas);

      this.inputSystem = new InputSystem();

      this.player = new Player();
      this.player.x = level01.playerStart.x;
      this.player.y = level01.playerStart.y;

      this.platforms = LevelSystem.createPlatforms(level01);
      this.goal = LevelSystem.createGoal(level01);
      this.hasWon = false;
      this.hasLost = false;

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
      if (this.inputSystem.isPressed('restart')) {
         this.restartLevel();
      }

      if (this.hasWon || this.hasLost) return;

      this.player.update(this.inputSystem);

      this.player.moveX();
      CollisionSystem.resolveHorizontalPlatformCollision(
         this.player,
         this.platforms,
      );

      this.player.moveY();
      CollisionSystem.resolveVerticalPlatformCollision(
         this.player,
         this.platforms,
      );

      this.player.updateCoyoteTime();
      this.player.handleJump();

      if (CollisionSystem.checkGoalCollision(this.player, this.goal)) {
         this.hasWon = true;
      }

      this.checkPlayerDeath();

      this.camera.follow(this.player);
   }

   draw() {
      this.renderer.clear();
      
      for (const platform of this.platforms) {
         platform.draw(this.renderer, this.camera);
      }

      if (GAME_CONFIG.debug.showWorldGrid) {
         this.renderer.drawWorldGrid(this.camera);
      }
      
      this.goal.draw(this.renderer, this.camera);
      this.player.draw(this.renderer, this.camera);

      if (this.hasWon) {
         this.renderer.drawOverlayMessage(
            'Fase concluída!',
            'Você chegou ao objetivo final.',
            'Pressione R para jogar novamente',
         );
      }

      if (this.hasLost) {
         this.renderer.drawOverlayMessage(
            'Game Over!',
            'Você caiu na zona de morte.',
            'Pressione R para tentar novamente',
         );
      }



      if (GAME_CONFIG.debug.showCameraDeadZone) {
         this.renderer.drawCameraDeadZone(this.camera);
      }

      if (GAME_CONFIG.debug.showDebugText) {
         this.renderer.drawDebugText([
            `Player X: ${Math.round(this.player.x)}`,
            `Player Y: ${Math.round(this.player.y)}`,
            `Tile X: ${Math.floor(this.player.x / 32)}`,
            `Tile Y: ${Math.floor(this.player.y / 32)}`,
         ]);
      }


   }

   restartLevel() {
      this.hasWon = false;
      this.hasLost = false;

      this.player.reset(level01.playerStart);
      this.camera.follow(this.player);
   }

   checkPlayerDeath() {
      if (this.player.y > GAME_CONFIG.deathZoneY) {
         this.hasLost = true;
      }
   }
}
