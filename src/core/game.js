import { GAME_CONFIG } from "../config/gameConfig.js";
import { GAME_STATES } from "../utils/constants.js";

import { Renderer } from "./renderer.js";
import { Loop } from "./loop.js";
import { Camera } from "./camera.js";

import { createScreenData } from "../ui/screens.js";
import { createHUDData } from "../ui/hud.js";

import { Player } from "../entities/player.js";

import { InputSystem } from "../systems/inputSystem.js";
import { LevelSystem } from "../systems/levelSystem.js";
import { CollisionSystem } from "../systems/collisionSystem.js";

import { levels } from "../levels/index.js";

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
    this.collectibles = LevelSystem.createCollectibles(this.currentLevel);

    this.collectedCount = 0;
    this.effects = [];
    this.coinHUDPulse = 0;

    this.state = GAME_CONFIG.debug.levelEditMode
      ? GAME_STATES.PLAYING
      : GAME_STATES.MENU;

    this.wasPausePressed = false;
    this.wasMenuPressed = false;
    this.wasRestartPressed = false;

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

  /* =========================================================
      Setup / Inicialização
   ========================================================= */

  get totalLevels() {
    return levels.length;
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

  /* =========================================================
      Levels / Estados principais
   ========================================================= */

  loadLevel(levelIndex) {
    this.currentLevelIndex = levelIndex;
    this.currentLevel = levels[this.currentLevelIndex];

    this.platforms = LevelSystem.createPlatforms(this.currentLevel);
    this.goal = LevelSystem.createGoal(this.currentLevel);
    this.hazards = LevelSystem.createHazards(this.currentLevel);
    this.collectibles = LevelSystem.createCollectibles(this.currentLevel);

    this.collectedCount = 0;
    this.effects = [];
    this.coinHUDPulse = 0;

    this.player.reset(this.currentLevel.playerStart);

    if (GAME_CONFIG.debug.levelEditMode) {
      this.camera.setView(GAME_CONFIG.debug.editCamera);
    } else {
      this.camera.follow(this.player);
    }
  }

  startGame() {
    this.state = GAME_STATES.PLAYING;
    this.currentLevelIndex = 0;
    this.loadLevel(this.currentLevelIndex);
  }

  restartLevel() {
    this.state = GAME_STATES.PLAYING;
    this.loadLevel(this.currentLevelIndex);
  }

  goToMenu() {
    this.state = GAME_STATES.MENU;
    this.currentLevelIndex = 0;
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

  /* =========================================================
      Update principal
   ========================================================= */

  update() {
    if (this.updateEditMode()) return;
    if (this.updateMenu()) return;

    this.handleStateInputs();

    if (this.shouldPauseGameplayUpdate()) return;

    this.updateGameplay();
  }

  updateEditMode() {
    if (!GAME_CONFIG.debug.levelEditMode) {
      return false;
    }

    this.handleEditModeLevelInput();
    return true;
  }

  updateMenu() {
    if (this.state !== GAME_STATES.MENU) {
      return false;
    }

    if (this.inputSystem.isPressed("start")) {
      this.startGame();
    }

    return true;
  }

  handleStateInputs() {
    this.handlePauseInput();
    this.handleMenuInput();
    this.handleRestartInput();
    this.handleNextLevelInput();
  }

  shouldPauseGameplayUpdate() {
    return this.state !== GAME_STATES.PLAYING;
  }

  updateGameplay() {
    this.updatePlayer();
    this.handlePlayerCollisions();
    this.player.updateLandingAnimation();

    this.handleCollectibles();
    this.updateEffects();
    this.updateHUDAnimations();

    this.checkWinCondition();
    this.checkHazardCollision();
    this.checkPlayerDeath();
    this.updateCamera();
  }

  updatePlayer() {
    this.player.update(this.inputSystem);
  }

  handlePlayerCollisions() {
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
  }

  handleCollectibles() {
    const collectedItems = CollisionSystem.collectItems(
      this.player,
      this.collectibles,
    );

    if (collectedItems.length === 0) {
      return;
    }

    this.collectedCount += collectedItems.length;
    this.coinHUDPulse = 1;

    collectedItems.forEach((collectible) => {
      this.createCollectEffect(collectible);
    });
  }

  createCollectEffect(collectible) {
    const centerX = collectible.x + collectible.width / 2;
    const centerY = collectible.y + collectible.height / 2;

    const particles = Array.from({ length: 8 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 8;

      return {
        angle,
        distance: 10 + Math.random() * 8,
        radius: 2 + Math.random() * 1.5,
      };
    });

    this.effects.push({
      type: "coinCollect",
      x: centerX,
      y: centerY,
      age: 0,
      duration: 28,
      color: "#ffd166",
      particles,
    });

    this.effects.push({
      type: "floatingText",
      text: "+1",
      x: centerX,
      y: centerY - 10,
      age: 0,
      duration: 38,
      color: "#ffd166",
    });
  }

  updateEffects() {
    this.effects.forEach((effect) => {
      effect.age++;
    });

    this.effects = this.effects.filter((effect) => {
      return effect.age < effect.duration;
    });
  }

  updateHUDAnimations() {
    this.coinHUDPulse += (0 - this.coinHUDPulse) * 0.16;

    if (this.coinHUDPulse < 0.01) {
      this.coinHUDPulse = 0;
    }
  }

  drawEffects() {
    this.effects.forEach((effect) => {
      if (effect.type === "coinCollect") {
        this.renderer.drawCoinCollectEffect(effect, this.camera);
      }

      if (effect.type === "floatingText") {
        this.renderer.drawFloatingTextEffect(effect, this.camera);
      }
    });
  }

  checkWinCondition() {
    if (!this.goal) return;

    if (CollisionSystem.checkGoalCollision(this.player, this.goal)) {
      this.state = GAME_STATES.WON;
    }
  }

  checkHazardCollision() {
    if (CollisionSystem.checkHazardCollision(this.player, this.hazards)) {
      this.state = GAME_STATES.LOST;
    }
  }

  checkPlayerDeath() {
    if (this.player.y > GAME_CONFIG.deathZoneY) {
      this.state = GAME_STATES.LOST;
    }
  }

  updateCamera() {
    this.camera.follow(this.player);
  }

  /* =========================================================
      Inputs de estado
   ========================================================= */

  handlePauseInput() {
    const isPausePressed = this.inputSystem.isPressed("pause");
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

  handleMenuInput() {
    const isMenuPressed = this.inputSystem.isPressed("menu");
    const justPressedMenu = isMenuPressed && !this.wasMenuPressed;

    const canReturnToMenu =
      this.state === GAME_STATES.PAUSED ||
      this.state === GAME_STATES.WON ||
      this.state === GAME_STATES.LOST;

    if (justPressedMenu && canReturnToMenu) {
      this.goToMenu();
    }

    this.wasMenuPressed = isMenuPressed;
  }

  handleRestartInput() {
    const isRestartPressed = this.inputSystem.isPressed("restart");
    const justPressedRestart = isRestartPressed && !this.wasRestartPressed;

    const canRestartLevel =
      this.state === GAME_STATES.PAUSED ||
      this.state === GAME_STATES.WON ||
      this.state === GAME_STATES.LOST;

    if (justPressedRestart && canRestartLevel) {
      this.restartLevel();
    }

    this.wasRestartPressed = isRestartPressed;
  }

  handleNextLevelInput() {
    if (this.state !== GAME_STATES.WON) {
      return;
    }

    if (this.inputSystem.isPressed("next")) {
      this.goToNextLevel();
    }
  }

  /* =========================================================
      Modo edição
   ========================================================= */

  handleEditModeLevelInput() {
    const isPreviousPressed = this.inputSystem.isPressed("previousLevel");
    const isNextPressed = this.inputSystem.isPressed("nextLevelEdit");

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

  /* =========================================================
      Draw principal
   ========================================================= */

  draw() {
    this.renderer.clear();

    this.drawGoalGlow();

    if (GAME_CONFIG.debug.showWorldGrid) {
      this.renderer.drawWorldGrid(this.camera);
    }

    this.drawPlatforms();
    this.drawCollectibles();
    this.drawEffects();
    this.drawGoal();
    this.drawPlayer();
    this.drawHazards();

    this.drawDebug();
    this.drawUI();
  }

  drawPlatforms() {
    const sortedPlatforms = [...this.platforms].sort((a, b) => b.y - a.y);

    for (const platform of sortedPlatforms) {
      const visualType = this.getPlatformVisualType(platform);

      const isGround = visualType === "ground";
      const isSeparate = visualType === "separate";
      const isPlatform = visualType === "platform";

      const platformsThatFuseAbove = this.getPlatformsThatFuseAbove(platform);

      const visibleTopSegments = this.getVisibleTopSegments(
        platform,
        platformsThatFuseAbove,
      );

      const isSupported = this.isPlatformSupported(platform);

      let showBottomShade = false;

      if (isGround) {
        showBottomShade = false;
      }

      if (isPlatform) {
        showBottomShade = !isSupported;
      }

      if (isSeparate) {
        showBottomShade = true;
      }

      platform.draw(this.renderer, this.camera, {
        showBottomShade,
        showTopHighlight: visibleTopSegments.length > 0,
        topSegments: isSeparate ? null : visibleTopSegments,
        visualType,
        sprite: platform.sprite,
      });
    }
  }

  drawCollectibles() {
    for (const collectible of this.collectibles) {
      collectible.draw(this.renderer, this.camera);
    }
  }

  drawHazards() {
    for (const hazard of this.hazards) {
      hazard.draw(this.renderer, this.camera);
    }
  }

  drawPlayer() {
    if (
      GAME_CONFIG.debug.levelEditMode &&
      GAME_CONFIG.debug.hidePlayerInEditMode
    ) {
      return;
    }

    this.player.draw(this.renderer, this.camera);
  }

  drawGoalGlow() {
    if (!this.goal) return;

    this.renderer.drawGoalPortalGlow(
      this.goal.x,
      this.goal.y,
      this.goal.width,
      this.goal.height,
      this.goal.color,
      this.camera,
    );
  }

  drawGoal() {
    if (!this.goal) return;

    this.renderer.drawGoalPortalBody(
      this.goal.x,
      this.goal.y,
      this.goal.width,
      this.goal.height,
      this.goal.color,
      this.camera,
    );
  }

  drawDebug() {
    if (GAME_CONFIG.debug.showWorldGrid) {
      this.renderer.drawWorldGridLabels(this.camera);
    }

    if (GAME_CONFIG.debug.showCameraDeadZone) {
      this.renderer.drawCameraDeadZone(this.camera);
    }

    if (GAME_CONFIG.debug.showDebugText) {
      this.drawDebugInfo();
    }
  }

  drawUI() {
    const hudData = createHUDData(this);

    if (hudData) {
      this.renderer.drawHUD(hudData);
    }

    const screenData = createScreenData(this);

    if (screenData && !GAME_CONFIG.debug.levelEditMode) {
      this.renderer.drawPanelScreen(screenData);
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
      "Modo: Edição",
      `Fase: ${this.currentLevelIndex + 1}/${levels.length}`,
      `Nome: ${this.currentLevel.name}`,
      `Camera X: ${Math.round(this.camera.x)}`,
      `Camera Y: ${Math.round(this.camera.y)}`,
      `Zoom: ${this.camera.zoom.toFixed(2)}`,
      '"," fase anterior',
      '"." próxima fase',
    ]);
  }

  /* =========================================================
      Plataformas / Fusão visual
   ========================================================= */

  getPlatformVisualType(platform) {
    return platform.visualType || "platform";
  }

  getPlatformsThatFuseAbove(platform) {
    const currentVisualType = this.getPlatformVisualType(platform);

    if (currentVisualType === "separate") {
      return [];
    }

    return this.platforms.filter((otherPlatform) => {
      if (otherPlatform === platform) return false;

      const otherVisualType = this.getPlatformVisualType(otherPlatform);

      const shouldFuse =
        (currentVisualType === "ground" && otherVisualType === "ground") ||
        (currentVisualType === "platform" && otherVisualType === "platform");

      if (!shouldFuse) {
        return false;
      }

      const isTouchingFromAbove = this.areValuesClose(
        otherPlatform.y + otherPlatform.height,
        platform.y,
      );

      const hasHorizontalOverlap =
        otherPlatform.x < platform.x + platform.width &&
        otherPlatform.x + otherPlatform.width > platform.x;

      return isTouchingFromAbove && hasHorizontalOverlap;
    });
  }

  getVisibleTopSegments(platform, platformsAbove) {
    let segments = [
      {
        start: platform.x,
        end: platform.x + platform.width,
      },
    ];

    platformsAbove.forEach((abovePlatform) => {
      const coverStart = Math.max(platform.x, abovePlatform.x);
      const coverEnd = Math.min(
        platform.x + platform.width,
        abovePlatform.x + abovePlatform.width,
      );

      segments = segments.flatMap((segment) => {
        const noOverlap =
          coverEnd <= segment.start || coverStart >= segment.end;

        if (noOverlap) {
          return [segment];
        }

        const result = [];

        if (coverStart > segment.start) {
          result.push({
            start: segment.start,
            end: coverStart,
          });
        }

        if (coverEnd < segment.end) {
          result.push({
            start: coverEnd,
            end: segment.end,
          });
        }

        return result;
      });
    });

    return segments.map((segment) => ({
      x: segment.start,
      width: segment.end - segment.start,
    }));
  }

  isPlatformSupported(platform) {
    const isOnWorldFloor =
      platform.y + platform.height >= GAME_CONFIG.worldHeight;

    if (isOnWorldFloor) {
      return true;
    }

    return this.platforms.some((otherPlatform) => {
      if (otherPlatform === platform) return false;

      const isTouchingFromBelow = this.areValuesClose(
        platform.y + platform.height,
        otherPlatform.y,
      );

      const hasHorizontalOverlap =
        platform.x < otherPlatform.x + otherPlatform.width &&
        platform.x + platform.width > otherPlatform.x;

      return isTouchingFromBelow && hasHorizontalOverlap;
    });
  }

  areValuesClose(a, b, tolerance = 1) {
    return Math.abs(a - b) <= tolerance;
  }
}
