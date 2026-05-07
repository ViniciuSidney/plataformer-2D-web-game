import { GAME_CONFIG } from '../config/gameConfig.js';
import { GAME_STATES } from '../utils/constants.js';
import { Renderer } from './renderer.js';
import { Loop } from './loop.js';
import { Camera } from './camera.js';

import { Player } from '../entities/player.js';

import { InputSystem } from '../systems/inputSystem.js';
import { LevelSystem } from '../systems/levelSystem.js';
import { CollisionSystem } from '../systems/collisionSystem.js';

import { levels } from '../levels/index.js';

export class Game {
   constructor(canvas) {
      this.canvas = canvas;
      this.renderer = new Renderer(canvas);

      this.inputSystem = new InputSystem();

      this.currentLevelIndex = this.getInitialLevelIndex();
      this.currentLevel = levels[this.currentLevelIndex];

      this.player = new Player();
      this.player.x = this.currentLevel.playerStart.x;
      this.player.y = this.currentLevel.playerStart.y;

      this.platforms = LevelSystem.createPlatforms(this.currentLevel);
      this.goal = LevelSystem.createGoal(this.currentLevel);
      this.hazards = LevelSystem.createHazards(this.currentLevel);

      this.state = GAME_CONFIG.debug.levelEditMode
         ? GAME_STATES.PLAYING
         : GAME_STATES.MENU;

      this.wasPausePressed = false;
      this.wasPreviousLevelPressed = false;
      this.wasNextLevelEditPressed = false;

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

   getInitialLevelIndex() {
      if (!GAME_CONFIG.debug.levelEditMode) {
         return 0;
      }

      const requestedLevelIndex = GAME_CONFIG.debug.editLevelIndex ?? 0;
      const lastLevelIndex = levels.length - 1;

      return Math.min(Math.max(requestedLevelIndex, 0), lastLevelIndex);
   }

   loadLevel(levelIndex) {
      this.currentLevelIndex = levelIndex;
      this.currentLevel = levels[this.currentLevelIndex];

      this.platforms = LevelSystem.createPlatforms(this.currentLevel);
      this.goal = LevelSystem.createGoal(this.currentLevel);
      this.hazards = LevelSystem.createHazards(this.currentLevel);

      this.player.reset(this.currentLevel.playerStart);

      if (GAME_CONFIG.debug.levelEditMode) {
         this.camera.setView(GAME_CONFIG.debug.editCamera);
      } else {
         this.camera.follow(this.player);
      }
   }

   restartLevel() {
      this.state = GAME_STATES.PLAYING;
      this.loadLevel(this.currentLevelIndex);
   }

   goToNextLevel() {
      const nextLevelIndex = this.currentLevelIndex + 1;
      const hasNextLevel = nextLevelIndex < levels.length;

      if (!hasNextLevel) {
         this.state = GAME_STATES.WON;
         return;
      }

      this.state = GAME_STATES.PLAYING;
      this.loadLevel(nextLevelIndex);
   }

   handlePauseInput() {
      const isPausePressed = this.inputSystem.isPressed('pause');
      const justPressedPause = isPausePressed && !this.wasPausePressed;

      if (justPressedPause) {
         if (this.state === GAME_STATES.PLAYING) {
            this.state = GAME_STATES.PAUSED;
         } else if (this.state === GAME_STATES.PAUSED) {
            this.state = GAME_STATES.PLAYING;
         }
      }

      this.wasPausePressed = isPausePressed;
   }

   update() {
      if (GAME_CONFIG.debug.levelEditMode) {
         this.handleEditModeLevelInput();
         return;
      }

      if (this.state === GAME_STATES.MENU) {
         if (this.inputSystem.isPressed('start')) {
            this.startGame();
         }

         return;
      }

      this.handlePauseInput();

      if (this.inputSystem.isPressed('restart')) {
         this.restartLevel();
      }

      if (
         this.state === GAME_STATES.WON &&
         this.inputSystem.isPressed('next')
      ) {
         this.goToNextLevel();
      }

      if (
         this.state === GAME_STATES.PAUSED ||
         this.state === GAME_STATES.WON ||
         this.state === GAME_STATES.LOST
      ) {
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

      if (CollisionSystem.checkHazardCollision(this.player, this.hazards)) {
         this.state = GAME_STATES.LOST;
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

      if (GAME_CONFIG.debug.showWorldGrid) {
         this.renderer.drawWorldGrid(this.camera);
      }

      for (const platform of this.platforms) {
         platform.draw(this.renderer, this.camera);
      }

      for (const platform of this.platforms) {
         platform.draw(this.renderer, this.camera);
      }

      for (const hazard of this.hazards) {
         hazard.draw(this.renderer, this.camera);
      }

      this.goal.draw(this.renderer, this.camera);

      if (!(GAME_CONFIG.debug.levelEditMode && GAME_CONFIG.debug.hidePlayerInEditMode)) {
         this.player.draw(this.renderer, this.camera);
      }

      if (GAME_CONFIG.debug.showWorldGrid) {
         this.renderer.drawWorldGridLabels(this.camera);
      }

      if (GAME_CONFIG.debug.showCameraDeadZone) {
         this.renderer.drawCameraDeadZone(this.camera);
      }

      if (GAME_CONFIG.debug.showDebugText) {
         this.drawDebugInfo();
      }

      if (this.state === GAME_STATES.MENU && !GAME_CONFIG.debug.levelEditMode) {
         this.renderer.drawMenuScreen();
      }

      if (this.state === GAME_STATES.PAUSED) {
         this.renderer.drawPauseScreen();
      }

      if (this.state === GAME_STATES.WON) {
         const hasNextLevel = this.currentLevelIndex < levels.length - 1;

         this.renderer.drawOverlayMessage(
            hasNextLevel ? 'Fase concluída!' : 'Jogo concluído!',
            hasNextLevel
               ? 'Você chegou ao objetivo final.'
               : 'Você concluiu todas as fases disponíveis!\nRelaxa que logo tem mais!',
            hasNextLevel
               ? 'Pressione N para próxima fase ou R para reiniciar'
               : 'Pressione R para jogar novamente',
         );
      }

      if (this.state === GAME_STATES.LOST) {
         this.renderer.drawOverlayMessage(
            'Game Over!',
            'Você foi dessa pra melhor, continue tentando!',
            'Pressione R para tentar novamente',
         );
      }
   }

   drawDebugInfo() {
      if (!GAME_CONFIG.debug.levelEditMode) {
         this.renderer.drawDebugText([
            `Fase: ${this.currentLevelIndex + 1}/${levels.length}`,
            `Nome: ${this.currentLevel.name}`,
            `Tile X: ${Math.floor(this.player.x / GAME_CONFIG.tileSize)}`,
            `Tile Y: ${Math.floor(this.player.y / GAME_CONFIG.tileSize)}`,
         ]);

         return;
      }
      this.renderer.drawDebugText([
         'Modo: Edição',
         `Fase: ${this.currentLevelIndex + 1}/${levels.length}`,
         `Nome: ${this.currentLevel.name}`,
         `Camera X: ${Math.round(this.camera.x)}`,
         `Camera Y: ${Math.round(this.camera.y)}`,
         `Zoom: ${this.camera.zoom.toFixed(2)}`,
         '"," fase anterior ',
         '"." próxima fase',
      ]);
   }

   handleEditModeLevelInput() {
      const isPreviousPressed = this.inputSystem.isPressed('previousLevel');
      const isNextPressed = this.inputSystem.isPressed('nextLevelEdit');

      const justPressedPrevious =
         isPreviousPressed && !this.wasPreviousLevelPressed;

      const justPressedNext = isNextPressed && !this.wasNextLevelEditPressed;

      if (justPressedPrevious) {
         this.goToEditLevel(this.currentLevelIndex - 1);
      }

      if (justPressedNext) {
         this.goToEditLevel(this.currentLevelIndex + 1);
      }

      this.wasPreviousLevelPressed = isPreviousPressed;
      this.wasNextLevelEditPressed = isNextPressed;
   }

   goToEditLevel(levelIndex) {
      const lastLevelIndex = levels.length - 1;

      const safeLevelIndex = Math.min(Math.max(levelIndex, 0), lastLevelIndex);

      if (safeLevelIndex === this.currentLevelIndex) {
         return;
      }

      this.loadLevel(safeLevelIndex);
      this.state = GAME_STATES.PLAYING;
   }

   checkPlayerDeath() {
      if (this.player.y > GAME_CONFIG.deathZoneY) {
         this.state = GAME_STATES.LOST;
      }
   }
}
