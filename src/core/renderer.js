import { GAME_CONFIG } from "../config/gameConfig.js";

export class Renderer {
  // Base -----
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  clear() {
    this.context.fillStyle = GAME_CONFIG.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawRect(x, y, width, height, color, camera = { x: 0, y: 0, zoom: 1 }) {
    const zoom = camera.zoom || 1;

    this.context.fillStyle = color;

    this.context.fillRect(
      (x - camera.x) * zoom,
      (y - camera.y) * zoom,
      width * zoom,
      height * zoom,
    );
  }

  drawCircle(
    x,
    y,
    radius,
    color,
    camera = { x: 0, y: 0, zoom: 1 },
    options = {},
  ) {
    const zoom = camera.zoom || 1;

    const {
      strokeColor = null,
      lineWidth = 0,
      shadowColor = null,
      shadowBlur = 0,
      opacity = 1,
    } = options;

    this.context.save();

    this.context.globalAlpha = opacity;
    this.context.fillStyle = color;

    if (shadowColor) {
      this.context.shadowColor = shadowColor;
      this.context.shadowBlur = shadowBlur;
    }

    this.context.beginPath();
    this.context.arc(
      (x - camera.x) * zoom,
      (y - camera.y) * zoom,
      radius * zoom,
      0,
      Math.PI * 2,
    );
    this.context.fill();

    if (strokeColor && lineWidth > 0) {
      this.context.strokeStyle = strokeColor;
      this.context.lineWidth = lineWidth;
      this.context.stroke();
    }

    this.context.restore();
  }

  // Debug -----
  drawWorldGrid(camera) {
    const spacing = GAME_CONFIG.tileSize;
    const zoom = camera.zoom || 1;

    const majorEvery = GAME_CONFIG.debug.gridMajorLineEvery || 4;

    const visibleWidth = this.canvas.width / zoom;
    const visibleHeight = this.canvas.height / zoom;

    const totalColumns = Math.ceil(GAME_CONFIG.worldWidth / spacing);
    const totalRows = Math.ceil(GAME_CONFIG.worldHeight / spacing);

    const startColumn = Math.max(0, Math.floor(camera.x / spacing) - 1);
    const endColumn = Math.min(
      totalColumns,
      Math.ceil((camera.x + visibleWidth) / spacing) + 1,
    );

    const startRow = Math.max(0, Math.floor(camera.y / spacing) - 1);
    const endRow = Math.min(
      totalRows,
      Math.ceil((camera.y + visibleHeight) / spacing) + 1,
    );

    this.context.save();

    for (let column = startColumn; column <= endColumn; column++) {
      const worldX = column * spacing;
      const screenX = (worldX - camera.x) * zoom;

      const isMajorLine = column % majorEvery === 0;

      this.context.beginPath();
      this.context.moveTo(screenX, 0);
      this.context.lineTo(screenX, this.canvas.height);

      if (isMajorLine) {
        this.context.strokeStyle = "rgba(139, 233, 253, 0.22)";
        this.context.lineWidth = 1.25;
        this.context.setLineDash([]);
      } else {
        this.context.strokeStyle = "#2a2a35";
        this.context.lineWidth = 1;
        this.context.setLineDash([4, 4]);
        this.context.lineDashOffset = (performance.now() / 120) % 8;
      }

      this.context.stroke();
    }

    for (let row = startRow; row <= endRow; row++) {
      const worldY = row * spacing;
      const screenY = (worldY - camera.y) * zoom;

      const isMajorLine = row % majorEvery === 0;

      this.context.beginPath();
      this.context.moveTo(0, screenY);
      this.context.lineTo(this.canvas.width, screenY);

      if (isMajorLine) {
        this.context.strokeStyle = "rgba(139, 233, 253, 0.22)";
        this.context.lineWidth = 1.25;
        this.context.setLineDash([]);
      } else {
        this.context.strokeStyle = "#2a2a35";
        this.context.lineWidth = 1;
        this.context.setLineDash([4, 4]);
        this.context.lineDashOffset = (performance.now() / 120) % 8;
      }

      this.context.stroke();
    }

    this.context.restore();
  }

  drawWorldGridLabels(camera) {
    if (!GAME_CONFIG.debug.showGridRulerLabels) {
      return;
    }

    const spacing = GAME_CONFIG.tileSize;
    const zoom = camera.zoom || 1;
    const majorEvery = GAME_CONFIG.debug.gridMajorLineEvery || 4;

    const visibleWidth = this.canvas.width / zoom;
    const visibleHeight = this.canvas.height / zoom;

    const totalColumns = Math.ceil(GAME_CONFIG.worldWidth / spacing);
    const totalRows = Math.ceil(GAME_CONFIG.worldHeight / spacing);

    const startColumn = Math.max(0, Math.floor(camera.x / spacing) - 1);
    const endColumn = Math.min(
      totalColumns,
      Math.ceil((camera.x + visibleWidth) / spacing) + 1,
    );

    const startRow = Math.max(0, Math.floor(camera.y / spacing) - 1);
    const endRow = Math.min(
      totalRows,
      Math.ceil((camera.y + visibleHeight) / spacing) + 1,
    );

    this.context.save();

    for (let column = startColumn; column <= endColumn; column++) {
      if (column % majorEvery !== 0) {
        continue;
      }

      const worldX = column * spacing;
      const screenX = (worldX - camera.x) * zoom;

      this.drawGridLabel(`${column}`, screenX + 4, 14, "top");
    }

    for (let row = startRow; row <= endRow; row++) {
      if (row % majorEvery !== 0) {
        continue;
      }

      const worldY = row * spacing;
      const screenY = (worldY - camera.y) * zoom;

      this.drawGridLabel(`${row}`, 6, screenY - 4, "left");
    }

    this.context.restore();
  }

  drawGridLabel(text, x, y, position = "top") {
    this.context.save();

    this.context.font = "11px JetBrains Mono";
    this.context.textAlign = "left";
    this.context.textBaseline = "top";

    const paddingX = 4;
    const paddingY = 2;
    const textWidth = this.context.measureText(text).width;
    const boxWidth = textWidth + paddingX * 2;
    const boxHeight = 16;

    let boxX = x;
    let boxY = y;

    if (position === "left") {
      boxY = y - 6;
    }

    this.context.fillStyle = "rgba(0, 0, 0, 0.25)";
    this.context.fillRect(boxX, boxY, boxWidth, boxHeight);

    this.context.fillStyle = "rgba(139, 233, 253, 0.45)";
    this.context.fillText(text, boxX + paddingX, boxY + paddingY);

    this.context.restore();
  }

  drawDebugText(lines) {
    const lineHeight = 20;
    const padding = 12;

    const boxWidth = 260;
    const boxHeight = lines.length * lineHeight + padding * 2;

    this.context.save();

    this.context.fillStyle = "rgba(0, 0, 0, 0.55)";
    this.context.fillRect(40, 44, boxWidth, boxHeight);

    this.context.fillStyle = "#f5f5f5";
    this.context.font = "14px JetBrains Mono";
    this.context.textAlign = "left";
    this.context.textBaseline = "top";

    lines.forEach((line, index) => {
      this.context.fillText(line, 52, 56 + index * lineHeight);
    });

    this.context.restore();
  }

  drawCameraDeadZone(camera) {
    const deadZone = GAME_CONFIG.cameraDeadZone;
    const zoom = camera.zoom || 1;

    const deadZoneWidth = deadZone.width * zoom;
    const deadZoneHeight = deadZone.height * zoom;

    const x = (this.canvas.width - deadZoneWidth) / 2;
    const y = (this.canvas.height - deadZoneHeight) / 2;

    this.context.save();

    this.context.strokeStyle = "rgba(139, 233, 253, 0.35)";
    this.context.lineWidth = 2;
    this.context.strokeRect(x, y, deadZoneWidth, deadZoneHeight);

    this.context.restore();
  }

  // Screens / UI -----
  drawPanelScreen(
    {
      variant = "panel",
      title,
      subtitle = "",
      primaryAction = "",
      primaryActionEffect = "none",
      lines = [],
      accentColor = "#f5f5f5",
      backgroundColor = "#000000",
      backgroundOpacity = 0.55,
      decoration = null,
    },
    transitionProgress = 1,
  ) {
    const { context, canvas } = this;

    const safeProgress = Math.min(Math.max(transitionProgress, 0), 1);
    const easedProgress = 1 - Math.pow(1 - safeProgress, 3);

    const animatedOpacity = backgroundOpacity * easedProgress;
    const panelScale = variant === "panel" ? 0.96 + easedProgress * 0.04 : 1;
    const panelOffsetY = variant === "panel" ? (1 - easedProgress) * 14 : 0;

    const titleFont = "700 42px JetBrains Mono";
    const subtitleFont = "400 18px JetBrains Mono";
    const lineFont = "400 14px JetBrains Mono";

    const subtitleLines = subtitle ? subtitle.split("\n") : [];

    const titleHeight = 52;
    const subtitleLineHeight = 28;
    const instructionLineHeight = 24;

    const gapAfterTitle = subtitleLines.length > 0 ? 18 : 0;
    const gapAfterSubtitle = lines.length > 0 || primaryAction ? 28 : 0;

    const paddingX = variant === "fullscreen" ? 56 : 36;
    const paddingY = variant === "fullscreen" ? 48 : 32;

    const panelWidth = variant === "fullscreen" ? canvas.width : 620;

    const primaryActionHeight = primaryAction ? 34 : 0;
    const gapAfterPrimaryAction = primaryAction && lines.length > 0 ? 18 : 0;

    const panelHeight =
      variant === "fullscreen"
        ? canvas.height
        : paddingY * 2 +
          titleHeight +
          gapAfterTitle +
          subtitleLines.length * subtitleLineHeight +
          gapAfterSubtitle +
          primaryActionHeight +
          gapAfterPrimaryAction +
          lines.length * instructionLineHeight;

    const panelX =
      variant === "fullscreen" ? 0 : (canvas.width - panelWidth) / 2;
    const panelY =
      variant === "fullscreen" ? 0 : (canvas.height - panelHeight) / 2;

    context.save();

    context.fillStyle = this.hexToRgba(backgroundColor, animatedOpacity);
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (variant === "fullscreen" && decoration?.type === "menu-scene") {
      this.drawMenuScene(decoration);
    }

    if (variant === "panel") {
      const panelCenterX = panelX + panelWidth / 2;
      const panelCenterY = panelY + panelHeight / 2;

      context.translate(panelCenterX, panelCenterY + panelOffsetY);
      context.scale(panelScale, panelScale);
      context.translate(-panelCenterX, -panelCenterY);

      context.fillStyle = "rgba(24, 24, 32, 0.92)";
      context.fillRect(panelX, panelY, panelWidth, panelHeight);

      context.fillStyle = accentColor;
      context.fillRect(panelX, panelY, panelWidth, 4);
    }

    context.textAlign = "center";
    context.textBaseline = "top";

    const contentCenterX = canvas.width / 2;

    let currentY =
      variant === "fullscreen" ? canvas.height / 2 - 135 : panelY + paddingY;

    context.fillStyle = "#f5f5f5";
    context.font = titleFont;
    context.fillText(title, contentCenterX, currentY);

    currentY += titleHeight + gapAfterTitle;

    if (subtitleLines.length > 0) {
      context.fillStyle = "#a5a5b5";
      context.font = subtitleFont;

      subtitleLines.forEach((line) => {
        context.fillText(line, contentCenterX, currentY);
        currentY += subtitleLineHeight;
      });

      currentY += gapAfterSubtitle;
    }

    if (primaryAction) {
      const time = performance.now() / 1000;

      const isPulse = primaryActionEffect === "pulse";
      const isGlow = primaryActionEffect === "glow";

      const pulse = isPulse ? (Math.sin(time * 3) + 1) / 2 : 0;

      const fontSize = isPulse ? 18 + pulse * 1.5 : 17;
      const glowBlur = isPulse ? 8 + pulse * 10 : isGlow ? 8 : 0;
      const glowOpacity = isPulse ? 0.85 + pulse * 0.15 : 0.95;

      context.save();

      context.font = `700 ${fontSize}px JetBrains Mono`;
      context.textAlign = "center";
      context.textBaseline = "top";

      if (isPulse || isGlow) {
        context.shadowColor = accentColor;
        context.shadowBlur = glowBlur;
      }

      context.fillStyle = this.hexToRgba(accentColor, glowOpacity);
      context.fillText(primaryAction, contentCenterX, currentY);

      context.restore();

      currentY += primaryActionHeight + gapAfterPrimaryAction;
    }

    if (lines.length > 0) {
      context.font = lineFont;

      lines.forEach((line) => {
        context.fillStyle = "#a5a5b5";
        context.fillText(line, contentCenterX, currentY);
        currentY += instructionLineHeight;
      });
    }

    context.restore();
  }

  drawHUD(items) {
    const { context, canvas } = this;

    const normalizedItems = items.map((item) => {
      if (typeof item === "string") {
        return {
          text: item,
          type: "normal",
          pulse: 0,
        };
      }

      return {
        text: item.text,
        type: item.type || "normal",
        pulse: item.pulse || 0,
      };
    });

    const lineHeight = 22;
    const paddingX = 18;
    const paddingY = 12;
    const minBoxWidth = 320;

    context.save();

    context.font = "600 14px JetBrains Mono";
    context.textAlign = "center";
    context.textBaseline = "top";

    const longestLineWidth = Math.max(
      ...normalizedItems.map((item) => context.measureText(item.text).width),
    );

    const boxWidth = Math.max(minBoxWidth, longestLineWidth + paddingX * 2);
    const boxHeight = normalizedItems.length * lineHeight + paddingY * 2;

    const boxX = (canvas.width - boxWidth) / 2;
    const boxY = 18;

    context.fillStyle = "rgba(0, 0, 0, 0.45)";
    context.fillRect(boxX, boxY, boxWidth, boxHeight);

    normalizedItems.forEach((item, index) => {
      const textX = canvas.width / 2;
      const textY = boxY + paddingY + index * lineHeight;

      if (item.type === "coins") {
        this.drawHUDPulseText(item.text, textX, textY, item.pulse, "#ffd166");

        return;
      }

      context.fillStyle = index === 0 ? "#f5f5f5" : "#a5a5b5";
      context.font = "600 14px JetBrains Mono";
      context.fillText(item.text, textX, textY);
    });

    context.restore();
  }

  drawHUDPulseText(text, x, y, pulse = 0, color = "#ffd166") {
    const safePulse = Math.max(0, Math.min(pulse, 1));

    const scale = 1 + safePulse * 0.18;
    const shake = Math.sin(performance.now() / 35) * safePulse * 2;

    this.context.save();

    this.context.translate(x + shake, y);
    this.context.scale(scale, scale);

    this.context.textAlign = "center";
    this.context.textBaseline = "top";
    this.context.font = "700 14px JetBrains Mono";

    this.context.shadowColor = color;
    this.context.shadowBlur = 10 * safePulse;

    this.context.fillStyle = color;
    this.context.fillText(text, 0, 0);

    this.context.restore();
  }

  // Menu Scene -----
  drawMenuScene(scene) {
    const { context, canvas } = this;
    const staticCamera = { x: 0, y: 0, zoom: 1 };

    context.save();

    // grade de fundo alinhada ao tileSize
    context.strokeStyle = "rgba(255, 255, 255, 0.04)";
    context.lineWidth = 1;

    const spacing = GAME_CONFIG.tileSize;

    for (let x = 0; x <= canvas.width; x += spacing) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }

    for (let y = 0; y <= canvas.height; y += spacing) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }

    // portal glow (atrás de tudo)
    if (scene.goal) {
      const rect = this.getMenuTileRect(scene.goal);

      this.drawGoalPortalGlow(
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        scene.goal.color || "#2dd4bf",
        staticCamera,
      );
    }

    // chão
    if (scene.grounds) {
      scene.grounds.forEach((ground) => {
        const rect = this.getMenuTileRect(ground);

        this.drawPlatformBlock(
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          {},
          staticCamera,
          {
            showTopHighlight: true,
            showBottomShade: false,
            visualType: ground.visualType || "ground",
            sprite: ground.sprite || "ground",
          },
        );
      });
    }

    // plataformas
    if (scene.platforms) {
      scene.platforms.forEach((platform) => {
        const rect = this.getMenuTileRect(platform);

        this.drawPlatformBlock(
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          {},
          staticCamera,
          {
            showTopHighlight: true,
            showBottomShade: true,
            visualType: platform.visualType || "platform",
            sprite: platform.sprite || "platform",
          },
        );
      });
    }

    // perigos
    if (scene.hazards) {
      scene.hazards.forEach((hazard) => {
        const rect = this.getMenuTileRect(hazard);

        this.drawHazardSpikes(
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          hazard.color || "#ff5c7a",
          staticCamera,
        );
      });
    }

    // coletáveis
    if (scene.collectibles) {
      scene.collectibles.forEach((collectible, index) => {
        this.drawMenuCollectible(collectible, index);
      });
    }

    // portal body (na frente)
    if (scene.goal) {
      const rect = this.getMenuTileRect(scene.goal);

      this.drawGoalPortalBody(
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        scene.goal.color || "#2dd4bf",
        staticCamera,
      );
    }

    // player decorativo
    if (scene.player) {
      const rect = this.getMenuTileRect(scene.player);

      this.drawPlayerCharacter(
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        {
          bodyColor: scene.player.color || "#f2f2f7",
          topColor: "#ffffff",
          shadeColor: "#d7d8e6",
          eyeColor: "#232330",

          idle: true,
          moving: false,

          moveBlend: 0,
          airBlend: 0,
          velocityY: 0,

          facing: 1,

          idleStretchAmplitude: 2,
          idleStretchSpeed: 2.2,

          walkSquashAmplitude: 0,
          walkTiltAmplitude: 0,

          jumpStretchAmount: 0,
          fallSquashAmount: 0,

          bobSeed: 1.2,
        },
        { x: 0, y: 0, zoom: 1 },
      );
    }

    context.restore();
  }

  drawHazardStripMenu({ x, y, width, height, color = "#ff5c7a" }) {
    const { context } = this;

    const spikeCount = Math.max(1, Math.floor(width / 16));
    const spikeWidth = width / spikeCount;

    context.save();
    context.fillStyle = color;

    for (let i = 0; i < spikeCount; i++) {
      const spikeX = x + i * spikeWidth;

      context.beginPath();
      context.moveTo(spikeX, y);
      context.lineTo(spikeX + spikeWidth / 2, y - height);
      context.lineTo(spikeX + spikeWidth, y);
      context.closePath();
      context.fill();
    }

    context.restore();
  }

  drawMenuCollectible(collectible, index = 0) {
    const staticCamera = { x: 0, y: 0, zoom: 1 };

    const size = collectible.size || 0.25;
    const radius = this.toMenuPixels(size) / 2;

    const baseX = this.toMenuPixels(collectible.column) + radius;
    const baseY = this.toMenuPixels(collectible.row) + radius;

    const time = performance.now() / 1000;

    const floatAmplitude = 3;
    const floatSpeed = 2.4;
    const floatOffset = (collectible.column + collectible.row + index) * 0.7;

    const floatingY =
      baseY + Math.sin(time * floatSpeed + floatOffset) * floatAmplitude;

    const color = collectible.color || "#ffd166";

    // glow externo
    this.drawCircle(baseX, floatingY, radius + 3, color, staticCamera, {
      opacity: 0.18,
      shadowColor: color,
      shadowBlur: 12,
    });

    // corpo principal
    this.drawCircle(baseX, floatingY, radius, color, staticCamera, {
      strokeColor: "#ffefb0",
      lineWidth: 1.5,
      shadowColor: color,
      shadowBlur: 8,
    });

    // brilho interno
    this.drawCircle(
      baseX - radius * 0.25,
      floatingY - radius * 0.25,
      radius * 0.28,
      "#fff4c7",
      staticCamera,
      {
        opacity: 0.9,
      },
    );
  }

  drawCoinCollectEffect(effect, camera = { x: 0, y: 0, zoom: 1 }) {
    const zoom = camera.zoom || 1;

    const progress = effect.age / effect.duration;
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const opacity = 1 - progress;

    const screenX = (effect.x - camera.x) * zoom;
    const screenY = (effect.y - camera.y) * zoom;

    const ringRadius = (8 + easedProgress * 18) * zoom;

    this.context.save();

    // anel de impacto
    this.context.strokeStyle = this.hexToRgba(effect.color, opacity * 0.75);
    this.context.lineWidth = Math.max(1, 2 * zoom);
    this.context.shadowColor = effect.color;
    this.context.shadowBlur = 10 * opacity;

    this.context.beginPath();
    this.context.arc(screenX, screenY, ringRadius, 0, Math.PI * 2);
    this.context.stroke();

    // brilho central subindo
    this.context.fillStyle = this.hexToRgba(effect.color, opacity * 0.45);
    this.context.beginPath();
    this.context.arc(
      screenX,
      screenY - easedProgress * 10 * zoom,
      (5 - progress * 2) * zoom,
      0,
      Math.PI * 2,
    );
    this.context.fill();

    // partículas
    effect.particles.forEach((particle) => {
      const distance = particle.distance * easedProgress * zoom;

      const particleX = screenX + Math.cos(particle.angle) * distance;
      const particleY =
        screenY +
        Math.sin(particle.angle) * distance -
        easedProgress * 8 * zoom;

      this.context.fillStyle = this.hexToRgba(effect.color, opacity);

      this.context.beginPath();
      this.context.arc(
        particleX,
        particleY,
        particle.radius * zoom * (1 - progress * 0.35),
        0,
        Math.PI * 2,
      );
      this.context.fill();
    });

    this.context.restore();
  }

  drawFloatingTextEffect(effect, camera = { x: 0, y: 0, zoom: 1 }) {
    const zoom = camera.zoom || 1;

    const progress = effect.age / effect.duration;
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const opacity = 1 - progress;

    const screenX = (effect.x - camera.x) * zoom;
    const screenY = (effect.y - camera.y) * zoom - easedProgress * 22 * zoom;

    const scale = 1 + (1 - progress) * 0.15;

    this.context.save();

    this.context.globalAlpha = opacity;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";

    this.context.font = `700 ${14 * zoom * scale}px JetBrains Mono`;

    this.context.shadowColor = effect.color || "#ffd166";
    this.context.shadowBlur = 8 * opacity;

    this.context.fillStyle = effect.color || "#ffd166";
    this.context.fillText(effect.text, screenX, screenY);

    this.context.restore();
  }

  // World Objects ----
  drawPlayerCharacter(
    x,
    y,
    width,
    height,
    options = {},
    camera = { x: 0, y: 0, zoom: 1 },
  ) {
    const {
      bodyColor = "#f2f2f7",
      topColor = "#ffffff",
      shadeColor = "#d7d8e6",
      eyeColor = "#232330",

      idle = false,
      moving = false,
      moveBlend = moving ? 1 : 0,
      airBlend = 0,
      velocityY = 0,
      facing = 1,

      idleStretchAmplitude = 2,
      idleStretchSpeed = 2.4,

      walkSquashAmplitude = 3,
      walkSquashSpeed = 12,
      walkTiltAmplitude = 1.2,

      jumpStretchAmount = 3,
      fallSquashAmount = 2.5,

      landImpactAmount = 0,
      landSquashAmount = 4,

      isDefeated = false,
      defeatHitDirection = null,
      defeatPushDirection = 0,
      defeatProgress = 0,

      isEnteringPortal = false,
      portalEnterProgress = 0,
      portalEnterTarget = null,

      bobSeed = 0,
    } = options;

    const zoom = camera.zoom || 1;

    const screenX = (x - camera.x) * zoom;
    const screenY = (y - camera.y) * zoom;
    const screenWidth = width * zoom;
    const screenHeight = height * zoom;

    let portalOffsetX = 0;
    let portalOffsetY = 0;
    let portalScale = 1;
    let portalOpacity = 1;
    let portalTintAmount = 0;
    let portalTilt = 0;

    const time = performance.now() / 1000;

    const safeMoveBlend = Math.max(0, Math.min(moveBlend, 1));
    const safeAirBlend = Math.max(0, Math.min(airBlend, 1));
    const groundBlend = 1 - safeAirBlend;
    const idleBlend = (1 - safeMoveBlend) * groundBlend;
    const safePortalProgress = Math.max(0, Math.min(portalEnterProgress, 1));

    if (isEnteringPortal && portalEnterTarget) {
      const easedPortalProgress = 1 - Math.pow(1 - safePortalProgress, 3);

      const playerCenterX = x + width / 2;
      const playerCenterY = y + height / 2;

      const targetDeltaX = portalEnterTarget.x - playerCenterX;
      const targetDeltaY = portalEnterTarget.y - playerCenterY;

      portalOffsetX = targetDeltaX * easedPortalProgress * zoom;
      portalOffsetY = targetDeltaY * easedPortalProgress * zoom;

      portalScale = 1 - easedPortalProgress * 0.72;
      portalOpacity = 1 - easedPortalProgress * 0.85;
      portalTintAmount = easedPortalProgress;
      portalTilt = Math.sin(easedPortalProgress * Math.PI) * 8;
    }

    const idleProgress = (Math.sin(time * idleStretchSpeed + bobSeed) + 1) / 2;

    const walkCycle = Math.sin(time * walkSquashSpeed);
    const walkPulse = Math.abs(walkCycle);

    const isJumping = velocityY < -0.2;
    const isFalling = velocityY > 0.2;

    const jumpStretch = isJumping ? jumpStretchAmount * safeAirBlend * zoom : 0;

    const fallSquash = isFalling ? fallSquashAmount * safeAirBlend * zoom : 0;
    const landingSquash = landImpactAmount * landSquashAmount * zoom;

    const idleStretch =
      idle && idleBlend > 0
        ? idleProgress * idleStretchAmplitude * idleBlend * zoom
        : 0;

    const walkSquash =
      walkPulse * walkSquashAmplitude * safeMoveBlend * groundBlend * zoom;

    const walkStretch =
      (1 - walkPulse) *
      walkSquashAmplitude *
      0.55 *
      safeMoveBlend *
      groundBlend *
      zoom;

    let visualWidth =
      screenWidth +
      walkSquash +
      fallSquash * 0.8 +
      landingSquash * 1.1 -
      jumpStretch * 0.25;

    let visualHeight =
      screenHeight +
      idleStretch +
      walkStretch +
      jumpStretch -
      walkSquash * 0.45 -
      fallSquash -
      landingSquash;

    visualWidth = Math.max(screenWidth * 0.82, visualWidth);
    visualHeight = Math.max(screenHeight * 0.82, visualHeight);

    const safeDefeatProgress = Math.max(0, Math.min(defeatProgress, 1));
    const defeatImpact = isDefeated ? 1 - safeDefeatProgress : 0;

    let defeatOffsetX = 0;
    let defeatOffsetY = 0;
    let defeatTilt = 0;

    if (isDefeated && defeatHitDirection === "top") {
      visualWidth += 5 * defeatImpact * zoom;
      visualHeight -= 6 * defeatImpact * zoom;
    }

    if (isDefeated && defeatHitDirection === "side") {
      const t = safeDefeatProgress;

      // acelera o começo do movimento
      const fastT = 1 - Math.pow(1 - t, 3.5);

      const throwDistance = 36 * zoom;
      const throwHeight = 20 * zoom;

      // X vai rápido para trás no começo
      defeatOffsetX = defeatPushDirection * throwDistance * fastT;

      // Y faz arco parabólico, mas também usando o progresso acelerado
      defeatOffsetY = -4 * throwHeight * fastT * (1 - fastT);

      const tiltStrength = 18;
      defeatTilt = defeatPushDirection * (1 - fastT * 0.65) * -tiltStrength;

      visualWidth -= 2 * (1 - fastT) * zoom;
      visualHeight += 3 * (1 - fastT) * zoom;
    }

    if (isDefeated && defeatHitDirection === "fall") {
      visualWidth *= 1 - 0.25 * safeDefeatProgress;
      visualHeight *= 1 - 0.25 * safeDefeatProgress;
    }

    visualWidth *= portalScale;
    visualHeight *= portalScale;

    const visualX =
      screenX - (visualWidth - screenWidth) / 2 + defeatOffsetX + portalOffsetX;

    const visualY =
      screenY + screenHeight - visualHeight + defeatOffsetY + portalOffsetY;

    const tilt =
      walkCycle *
      walkTiltAmplitude *
      safeMoveBlend *
      groundBlend *
      facing *
      zoom;

    const airTilt =
      safeAirBlend * facing * (isJumping ? 1.2 : isFalling ? -0.8 : 0);

    const finalTilt = tilt + airTilt + defeatTilt + portalTilt;

    const topHeight = Math.max(3, Math.min(visualHeight * 0.16, 6 * zoom));
    const sideShadeWidth = Math.max(2, Math.min(visualWidth * 0.14, 4 * zoom));
    const bottomShadeHeight = Math.max(
      2,
      Math.min(visualHeight * 0.14, 4 * zoom),
    );

    const eyeWidth = Math.max(4, visualWidth * 0.18);
    const eyeHeight = Math.max(2, visualHeight * 0.1);

    const eyeX =
      facing >= 0 ? visualX + visualWidth * 0.56 : visualX + visualWidth * 0.26;

    const eyeY = visualY + visualHeight * 0.34;

    let finalBodyColor = bodyColor;
    let finalTopColor = topColor;
    let finalShadeColor = shadeColor;
    let finalEyeColor = eyeColor;

    if (isDefeated) {
      finalBodyColor = this.mixColors(
        bodyColor,
        "#ff5c7a",
        0.65 * defeatImpact,
      );
      finalTopColor = this.mixColors(topColor, "#ffb3c1", 0.45 * defeatImpact);
      finalShadeColor = this.mixColors(
        shadeColor,
        "#ff5c7a",
        0.55 * defeatImpact,
      );
    }

    if (isEnteringPortal) {
      finalBodyColor = this.mixColors(
        finalBodyColor,
        "#2dd4bf",
        0.75 * portalTintAmount,
      );
      finalTopColor = this.mixColors(
        finalTopColor,
        "#d6fff8",
        0.8 * portalTintAmount,
      );
      finalShadeColor = this.mixColors(
        finalShadeColor,
        "#0f766e",
        0.5 * portalTintAmount,
      );
      finalEyeColor = this.mixColors(
        finalEyeColor,
        "#d6fff8",
        0.7 * portalTintAmount,
      );
    }

    this.context.globalAlpha = portalOpacity;

    this.context.save();

    // sombra fixa no chão apenas quando está próximo/encostado no chão
    if (groundBlend > 0.15) {
      this.context.fillStyle = "rgba(0, 0, 0, 0.14)";
      this.context.fillRect(
        screenX + screenWidth * 0.12,
        screenY + screenHeight + 2 * zoom,
        screenWidth * 0.76,
        3 * zoom,
      );
    }

    // rotação visual em torno da base do player
    this.context.translate(screenX + screenWidth / 2, screenY + screenHeight);
    this.context.rotate((finalTilt * Math.PI) / 180);
    this.context.translate(
      -(screenX + screenWidth / 2),
      -(screenY + screenHeight),
    );

    if (isEnteringPortal && safePortalProgress > 0) {
      this.context.shadowColor = "#2dd4bf";
      this.context.shadowBlur = 18 * safePortalProgress;
    }

    // corpo principal
    this.context.fillStyle = finalBodyColor;
    this.context.fillRect(visualX, visualY, visualWidth, visualHeight);

    // brilho no topo
    this.context.fillStyle = finalTopColor;
    this.context.fillRect(visualX, visualY, visualWidth, topHeight);

    // sombra lateral
    this.context.fillStyle = finalShadeColor;
    this.context.fillRect(
      visualX + visualWidth - sideShadeWidth,
      visualY,
      sideShadeWidth,
      visualHeight,
    );

    // sombra inferior
    const shadowWidth = screenWidth * (0.76 + landImpactAmount * 0.18);
    const shadowX = screenX + (screenWidth - shadowWidth) / 2;

    this.context.fillStyle = `rgba(0, 0, 0, ${0.14 + landImpactAmount * 0.08})`;
    this.context.fillRect(
      shadowX,
      screenY + screenHeight + 2 * zoom,
      shadowWidth,
      3 * zoom,
    );

    // olho/faixa minimalista
    this.context.fillStyle = finalEyeColor;
    this.context.fillRect(eyeX, eyeY, eyeWidth, eyeHeight);

    this.context.restore();
  }

  drawGoalPortalGlow(
    x,
    y,
    width,
    height,
    color,
    camera = { x: 0, y: 0, zoom: 1 },
  ) {
    const zoom = camera.zoom || 1;

    const screenX = (x - camera.x) * zoom;
    const screenY = (y - camera.y) * zoom;
    const screenWidth = width * zoom;
    const screenHeight = height * zoom;

    const time = performance.now() / 1000;
    const pulse = (Math.sin(time * 3) + 1) / 2;

    const glowOpacity = 0.14 + pulse * 0.1;
    const centerX = screenX + screenWidth / 2;
    const centerY = screenY + screenHeight / 2;

    this.context.save();

    // brilho oval externo
    this.context.beginPath();
    this.context.fillStyle = this.hexToRgba(color, glowOpacity);
    this.context.shadowColor = color;
    this.context.shadowBlur = 14 + pulse * 10;
    this.context.ellipse(
      centerX,
      centerY,
      screenWidth * 1.25,
      screenHeight * 0.75,
      0,
      0,
      Math.PI * 2,
    );
    this.context.fill();

    this.context.restore();
  }

  drawGoalPortalBody(
    x,
    y,
    width,
    height,
    color,
    camera = { x: 0, y: 0, zoom: 1 },
  ) {
    const zoom = camera.zoom || 1;

    const screenX = (x - camera.x) * zoom;
    const screenY = (y - camera.y) * zoom;
    const screenWidth = width * zoom;
    const screenHeight = height * zoom;

    const time = performance.now() / 1000;
    const pulse = (Math.sin(time * 3) + 1) / 2;
    const coreOpacity = 0.65 + pulse * 0.25;

    this.context.save();

    this.context.shadowBlur = 8 + pulse * 6;
    this.context.fillStyle = this.hexToRgba(color, 0.85);
    this.context.fillRect(screenX, screenY, screenWidth, screenHeight);

    // núcleo interno
    this.context.shadowBlur = 0;
    this.context.fillStyle = this.hexToRgba("#d6fff8", coreOpacity);
    this.context.fillRect(
      screenX + screenWidth * 0.2,
      screenY + screenHeight * 0.08,
      screenWidth * 0.6,
      screenHeight * 0.84,
    );

    // base do portal
    this.context.fillStyle = this.hexToRgba(color, 0.55);
    this.context.fillRect(
      screenX - 9 * zoom,
      screenY + screenHeight - 2,
      screenWidth + 18 * zoom,
      5 * zoom,
    );

    this.context.restore();
  }

  drawGoalPortal(x, y, width, height, color, camera = { x: 0, y: 0, zoom: 1 }) {
    this.drawGoalPortalGlow(x, y, width, height, color, camera);
    this.drawGoalPortalBody(x, y, width, height, color, camera);
  }

  drawHazardSpikes(
    x,
    y,
    width,
    height,
    color = "#ff5c7a",
    camera = { x: 0, y: 0, zoom: 1 },
  ) {
    const zoom = camera.zoom || 1;

    const screenX = (x - camera.x) * zoom;
    const screenY = (y - camera.y) * zoom;
    const screenWidth = width * zoom;
    const screenHeight = height * zoom;

    const time = performance.now() / 1000;
    const pulse = (Math.sin(time * 4) + 1) / 2;

    const glowOpacity = 0.1 + pulse * 0.1;
    const glowBlur = 8 + pulse * 6;

    const spikeCount = Math.max(1, Math.floor(width / 16));
    const spikeWidth = screenWidth / spikeCount;

    this.context.save();

    // brilho triangular externo
    this.context.fillStyle = this.hexToRgba(color, glowOpacity);
    this.context.shadowColor = color;
    this.context.shadowBlur = glowBlur;

    for (let i = 0; i < spikeCount; i++) {
      const spikeX = screenX + i * spikeWidth;

      this.context.beginPath();
      this.context.moveTo(spikeX - spikeWidth * 0.1, screenY + screenHeight);
      this.context.lineTo(
        spikeX + spikeWidth / 2,
        screenY - screenHeight * 0.2,
      );
      this.context.lineTo(
        spikeX + spikeWidth + spikeWidth * 0.1,
        screenY + screenHeight,
      );
      this.context.closePath();
      this.context.fill();
    }

    // espinhos principais
    this.context.fillStyle = this.hexToRgba(color, 0.92);
    this.context.shadowBlur = 4 + pulse * 3;

    for (let i = 0; i < spikeCount; i++) {
      const spikeX = screenX + i * spikeWidth;

      this.context.beginPath();
      this.context.moveTo(spikeX, screenY + screenHeight);
      this.context.lineTo(spikeX + spikeWidth / 2, screenY);
      this.context.lineTo(spikeX + spikeWidth, screenY + screenHeight);
      this.context.closePath();
      this.context.fill();
    }

    // brilho interno sutil
    this.context.shadowBlur = 0;
    this.context.fillStyle = this.hexToRgba("#ffd6df", 0.45);

    for (let i = 0; i < spikeCount; i++) {
      const spikeX = screenX + i * spikeWidth;

      this.context.beginPath();
      this.context.moveTo(
        spikeX + spikeWidth * 0.22,
        screenY + screenHeight * 0.82,
      );
      this.context.lineTo(
        spikeX + spikeWidth / 2,
        screenY + screenHeight * 0.22,
      );
      this.context.lineTo(
        spikeX + spikeWidth * 0.78,
        screenY + screenHeight * 0.82,
      );
      this.context.closePath();
      this.context.fill();
    }

    this.context.restore();
  }

  drawPlatformBlock(
    x,
    y,
    width,
    height,
    colors = {},
    camera = { x: 0, y: 0, zoom: 1 },
    options = {},
  ) {
    const zoom = camera.zoom || 1;

    const screenX = (x - camera.x) * zoom;
    const screenY = (y - camera.y) * zoom;
    const screenWidth = width * zoom;
    const screenHeight = height * zoom;

    const {
      showTopHighlight = true,
      showBottomShade = true,
      topSegments = null,
      visualType = "platform",
      sprite = "platform",
    } = options;

    const spriteStyle = this.getPlatformSpriteStyle(sprite);

    const bodyColor = colors.bodyColor || spriteStyle.bodyColor;
    const topColor = colors.topColor || spriteStyle.topColor;
    const bottomShadeColor =
      colors.bottomShadeColor || spriteStyle.bottomShadeColor;

    const topHeight = Math.max(
      3,
      Math.min(
        screenHeight * spriteStyle.topHeightMultiplier,
        spriteStyle.maxTopHeight * zoom,
      ),
    );

    const bottomShadeHeight = Math.max(
      2,
      Math.min(screenHeight * 0.12, 6 * zoom),
    );

    this.context.save();

    // corpo principal
    this.context.fillStyle = bodyColor;
    this.context.fillRect(screenX, screenY, screenWidth, screenHeight);

    // topo destacado
    if (showTopHighlight) {
      this.context.fillStyle = topColor;

      if (topSegments && topSegments.length > 0) {
        topSegments.forEach((segment) => {
          const segmentScreenX = (segment.x - camera.x) * zoom;
          const segmentScreenWidth = segment.width * zoom;

          this.context.fillRect(
            segmentScreenX,
            screenY,
            segmentScreenWidth,
            topHeight,
          );
        });
      } else {
        this.context.fillRect(screenX, screenY, screenWidth, topHeight);
      }
    }

    // sombra inferior
    if (showBottomShade) {
      this.context.fillStyle = bottomShadeColor;
      this.context.fillRect(
        screenX,
        screenY + screenHeight - bottomShadeHeight,
        screenWidth,
        bottomShadeHeight,
      );
    }

    // detalhe extra para plataformas separadas
    if (visualType === "separate") {
      this.context.fillStyle = "rgba(255, 255, 255, 0.03)";
      this.context.fillRect(screenX, screenY, screenWidth, 1.5 * zoom);
    }

    this.context.restore();
  }

  getPlatformSpriteStyle(sprite = "platform") {
    const spriteStyles = {
      ground: {
        bodyColor: "#292938",
        topColor: "#3a3a4d",
        bottomShadeColor: "#20202c",
        topHeightMultiplier: 0.14,
        maxTopHeight: 7,
        showBottomShadeByDefault: false,
      },

      platform: {
        bodyColor: "#2d2d3d",
        topColor: "#46465c",
        bottomShadeColor: "#20202c",
        topHeightMultiplier: 0.18,
        maxTopHeight: 8,
        showBottomShadeByDefault: true,
      },

      separatePlatform: {
        bodyColor: "#303044",
        topColor: "#55556f",
        bottomShadeColor: "#1f1f2b",
        topHeightMultiplier: 0.2,
        maxTopHeight: 8,
        showBottomShadeByDefault: true,
      },
    };

    return spriteStyles[sprite] || spriteStyles.platform;
  }

  // Helpers ----------
  hexToRgba(hex, opacity = 1) {
    const normalizedHex = hex.replace("#", "");

    const r = parseInt(normalizedHex.substring(0, 2), 16);
    const g = parseInt(normalizedHex.substring(2, 4), 16);
    const b = parseInt(normalizedHex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  toMenuPixels(value) {
    return value * GAME_CONFIG.tileSize;
  }

  getMenuTileRect(item) {
    return {
      x: this.toMenuPixels(item.column),
      y: this.toMenuPixels(item.row),
      width: this.toMenuPixels(item.width),
      height: this.toMenuPixels(item.height),
    };
  }

  mixColors(hexA, hexB, amount = 0.5) {
    const normalizedA = hexA.replace("#", "");
    const normalizedB = hexB.replace("#", "");

    const rA = parseInt(normalizedA.substring(0, 2), 16);
    const gA = parseInt(normalizedA.substring(2, 4), 16);
    const bA = parseInt(normalizedA.substring(4, 6), 16);

    const rB = parseInt(normalizedB.substring(0, 2), 16);
    const gB = parseInt(normalizedB.substring(2, 4), 16);
    const bB = parseInt(normalizedB.substring(4, 6), 16);

    const r = Math.round(rA + (rB - rA) * amount);
    const g = Math.round(gA + (gB - gA) * amount);
    const b = Math.round(bA + (bB - bA) * amount);

    return `rgb(${r}, ${g}, ${b})`;
  }
  // ------------------

  // Efeitos

  drawDefeatBurstEffect(effect, camera = { x: 0, y: 0, zoom: 1 }) {
    const zoom = camera.zoom || 1;

    const progress = effect.age / effect.duration;
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const opacity = 1 - progress;

    const screenX = (effect.x - camera.x) * zoom;
    const screenY = (effect.y - camera.y) * zoom;

    const ringRadius = (10 + easedProgress * 28) * zoom;

    this.context.save();

    // anel de impacto
    this.context.strokeStyle = this.hexToRgba(effect.color, opacity * 0.75);
    this.context.lineWidth = Math.max(1, 2 * zoom);
    this.context.shadowColor = effect.color;
    this.context.shadowBlur = 12 * opacity;

    this.context.beginPath();
    this.context.arc(screenX, screenY, ringRadius, 0, Math.PI * 2);
    this.context.stroke();

    // núcleo do impacto
    this.context.fillStyle = this.hexToRgba(effect.color, opacity * 0.38);
    this.context.beginPath();
    this.context.arc(
      screenX,
      screenY,
      (8 - progress * 4) * zoom,
      0,
      Math.PI * 2,
    );
    this.context.fill();

    // partículas
    effect.particles.forEach((particle) => {
      const distance = particle.distance * easedProgress * zoom;

      const particleX = screenX + Math.cos(particle.angle) * distance;
      const particleY = screenY + Math.sin(particle.angle) * distance;

      this.context.fillStyle = this.hexToRgba(effect.color, opacity);

      this.context.beginPath();
      this.context.arc(
        particleX,
        particleY,
        particle.radius * zoom * (1 - progress * 0.3),
        0,
        Math.PI * 2,
      );
      this.context.fill();
    });

    this.context.restore();
  }

  drawVictoryBurstEffect(effect, camera = { x: 0, y: 0, zoom: 1 }) {
    const zoom = camera.zoom || 1;

    const progress = effect.age / effect.duration;
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const opacity = 1 - progress;

    const screenX = (effect.x - camera.x) * zoom;
    const screenY = (effect.y - camera.y) * zoom;

    const ringRadius = (14 + easedProgress * 54) * zoom;
    const innerRingRadius = (6 + easedProgress * 28) * zoom;

    this.context.save();

    // anel externo energético
    this.context.strokeStyle = this.hexToRgba(effect.color, opacity * 0.95);
    this.context.lineWidth = Math.max(1, 2.8 * zoom);
    this.context.shadowColor = effect.color;
    this.context.shadowBlur = 22 * opacity;

    this.context.beginPath();
    this.context.arc(screenX, screenY, ringRadius, 0, Math.PI * 2);
    this.context.stroke();

    // anel interno
    this.context.strokeStyle = this.hexToRgba("#d6fff8", opacity * 0.7);
    this.context.lineWidth = Math.max(1, 1.6 * zoom);

    this.context.beginPath();
    this.context.arc(screenX, screenY, innerRingRadius, 0, Math.PI * 2);
    this.context.stroke();

    // núcleo subindo
    this.context.fillStyle = this.hexToRgba(effect.color, opacity * 0.55);
    this.context.beginPath();
    this.context.arc(
      screenX,
      screenY - easedProgress * 18 * zoom,
      (11 - progress * 5) * zoom,
      0,
      Math.PI * 2,
    );
    this.context.fill();

    // partículas subindo
    effect.particles.forEach((particle) => {
      const distance = particle.distance * easedProgress * zoom;

      const particleX = screenX + Math.cos(particle.angle) * distance;
      const particleY =
        screenY +
        Math.sin(particle.angle) * distance -
        easedProgress * 30 * zoom;

      this.context.fillStyle = this.hexToRgba(effect.color, opacity);

      this.context.beginPath();
      this.context.arc(
        particleX,
        particleY,
        particle.radius * zoom * (1 - progress * 0.3),
        0,
        Math.PI * 2,
      );
      this.context.fill();
    });

    this.context.restore();
  }

  drawScreenFlashEffect(effect) {
    const progress = effect.age / effect.duration;
    const opacity = (1 - progress) * (effect.opacity || 0.25);

    this.context.save();

    this.context.fillStyle = this.hexToRgba(effect.color || "#ff5c7a", opacity);
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.restore();
  }
}
