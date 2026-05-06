import { GAME_CONFIG } from '../config/gameConfig.js';
import { GAME_STATES } from '../utils/constants.js';
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
      this.state = GAME_STATES.MENU;

      this.camera = new Camera();

      if (GAME_CONFIG.debug.levelEditMode) {
         this.camera.setView(GAME_CONFIG.debug.editCamera);
      }

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
      if (GAME_CONFIG.debug.levelEditMode) {
         return;
      }

      if (this.state === GAME_STATES.MENU) {
         if (this.inputSystem.isPressed('start')) {
            this.startGame();
         }

         return;
      }

      if (this.inputSystem.isPressed('restart')) {
         this.restartLevel();
      }

      if (this.state === GAME_STATES.WON || this.state === GAME_STATES.LOST) {
         return;
      }

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
         this.state = GAME_STATES.WON;
      }

      this.checkPlayerDeath();

      this.camera.follow(this.player);
   }

   startGame() {
      this.state = GAME_STATES.PLAYING;
      this.restartLevel();
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
      if (
         !(
            GAME_CONFIG.debug.levelEditMode &&
            GAME_CONFIG.debug.hidePlayerInEditMode
         )
      ) {
         this.player.draw(this.renderer, this.camera);
      }

      if (this.state === GAME_STATES.MENU) {
         this.renderer.drawMenuScreen();
      }

      if (this.state === GAME_STATES.WON) {
         this.renderer.drawOverlayMessage(
            'Fase concluída!',
            'Você chegou ao objetivo final.',
            'Pressione R para reiniciar',
         );
      }

      if (this.state === GAME_STATES.LOST) {
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
         if (!GAME_CONFIG.debug.levelEditMode) {
            this.renderer.drawDebugText([
               `Player X: ${Math.round(this.player.x)}`,
               `Player Y: ${Math.round(this.player.y)}`,
               `Tile X: ${Math.floor(this.player.x / 32)}`,
               `Tile Y: ${Math.floor(this.player.y / 32)}`,
            ]);
         } else {
            this.renderer.drawDebugText([
               GAME_CONFIG.debug.levelEditMode ? 'Modo: edição' : 'Modo: jogo',
               `Camera X: ${Math.round(this.camera.x)}`,
               `Camera Y: ${Math.round(this.camera.y)}`,
               `Zoom: ${this.camera.zoom}`,
            ]);
         }
      }
   }

   restartLevel() {
      this.state = GAME_STATES.PLAYING;

      this.player.reset(level01.playerStart);

      if (GAME_CONFIG.debug.levelEditMode) {
         this.camera.setView(GAME_CONFIG.debug.editCamera);
      } else {
         this.camera.follow(this.player);
      }
   }

   checkPlayerDeath() {
      if (this.player.y > GAME_CONFIG.deathZoneY) {
         this.state = GAME_STATES.LOST;
      }
   }
}
