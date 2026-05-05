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

      if (CollisionSystem.checkGoalCollision(this.player, this.goal)) {
         this.hasWon = true;
         console.log('Fase concluída!');
      }

      this.player.updateCoyoteTime();
      this.player.handleJump();

      this.camera.follow(this.player);
   }

   draw() {
      this.renderer.clear();

      this.renderer.drawWorldGrid(this.camera);

      for (const platform of this.platforms) {
         platform.draw(this.renderer, this.camera);
      }

      this.goal.draw(this.renderer, this.camera);
      this.player.draw(this.renderer, this.camera);
   }
}
