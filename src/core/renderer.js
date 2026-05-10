import { GAME_CONFIG } from '../config/gameConfig.js';

export class Renderer {
   // Base -----
   constructor(canvas) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
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
   // ----------

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
            this.context.strokeStyle = 'rgba(139, 233, 253, 0.22)';
            this.context.lineWidth = 1.25;
            this.context.setLineDash([]);
         } else {
            this.context.strokeStyle = '#2a2a35';
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
            this.context.strokeStyle = 'rgba(139, 233, 253, 0.22)';
            this.context.lineWidth = 1.25;
            this.context.setLineDash([]);
         } else {
            this.context.strokeStyle = '#2a2a35';
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

         this.drawGridLabel(`${column}`, screenX + 4, 14, 'top');
      }

      for (let row = startRow; row <= endRow; row++) {
         if (row % majorEvery !== 0) {
            continue;
         }

         const worldY = row * spacing;
         const screenY = (worldY - camera.y) * zoom;

         this.drawGridLabel(`${row}`, 6, screenY - 4, 'left');
      }

      this.context.restore();
   }

   drawGridLabel(text, x, y, position = 'top') {
      this.context.save();

      this.context.font = '11px JetBrains Mono';
      this.context.textAlign = 'left';
      this.context.textBaseline = 'top';

      const paddingX = 4;
      const paddingY = 2;
      const textWidth = this.context.measureText(text).width;
      const boxWidth = textWidth + paddingX * 2;
      const boxHeight = 16;

      let boxX = x;
      let boxY = y;

      if (position === 'left') {
         boxY = y - 6;
      }

      this.context.fillStyle = 'rgba(0, 0, 0, 0.25)';
      this.context.fillRect(boxX, boxY, boxWidth, boxHeight);

      this.context.fillStyle = 'rgba(139, 233, 253, 0.45)';
      this.context.fillText(text, boxX + paddingX, boxY + paddingY);

      this.context.restore();
   }

   drawDebugText(lines) {
      const lineHeight = 20;
      const padding = 12;

      const boxWidth = 260;
      const boxHeight = lines.length * lineHeight + padding * 2;

      this.context.save();

      this.context.fillStyle = 'rgba(0, 0, 0, 0.55)';
      this.context.fillRect(40, 44, boxWidth, boxHeight);

      this.context.fillStyle = '#f5f5f5';
      this.context.font = '14px JetBrains Mono';
      this.context.textAlign = 'left';
      this.context.textBaseline = 'top';

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

      this.context.strokeStyle = 'rgba(139, 233, 253, 0.35)';
      this.context.lineWidth = 2;
      this.context.strokeRect(x, y, deadZoneWidth, deadZoneHeight);

      this.context.restore();
   }
   // ----------

   // Screens / UI -----
   drawPanelScreen({
      variant = 'panel',
      title,
      subtitle = '',
      primaryAction = '',
      primaryActionEffect = 'none',
      lines = [],
      accentColor = '#f5f5f5',
      backgroundColor = '#000000',
      backgroundOpacity = 0.55,
      decoration = null,
   }) {
      const { context, canvas } = this;

      const titleFont = '700 42px JetBrains Mono';
      const subtitleFont = '400 18px JetBrains Mono';
      const lineFont = '400 14px JetBrains Mono';

      const subtitleLines = subtitle ? subtitle.split('\n') : [];

      const titleHeight = 52;
      const subtitleLineHeight = 28;
      const instructionLineHeight = 24;

      const gapAfterTitle = subtitleLines.length > 0 ? 18 : 0;
      const gapAfterSubtitle = lines.length > 0 || primaryAction ? 28 : 0;

      const paddingX = variant === 'fullscreen' ? 56 : 36;
      const paddingY = variant === 'fullscreen' ? 48 : 32;

      const panelWidth = variant === 'fullscreen' ? canvas.width : 620;

      const primaryActionHeight = primaryAction ? 34 : 0;
      const gapAfterPrimaryAction = primaryAction && lines.length > 0 ? 18 : 0;

      const panelHeight =
         variant === 'fullscreen'
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
         variant === 'fullscreen' ? 0 : (canvas.width - panelWidth) / 2;
      const panelY =
         variant === 'fullscreen' ? 0 : (canvas.height - panelHeight) / 2;

      context.save();

      context.fillStyle = this.hexToRgba(backgroundColor, backgroundOpacity);
      context.fillRect(0, 0, canvas.width, canvas.height);

      if (variant === 'fullscreen' && decoration?.type === 'menu-scene') {
         this.drawMenuScene(decoration);
      }

      if (variant === 'panel') {
         context.fillStyle = 'rgba(24, 24, 32, 0.92)';
         context.fillRect(panelX, panelY, panelWidth, panelHeight);

         context.fillStyle = accentColor;
         context.fillRect(panelX, panelY, panelWidth, 4);
      }

      context.textAlign = 'center';
      context.textBaseline = 'top';

      const contentCenterX = canvas.width / 2;

      let currentY =
         variant === 'fullscreen' ? canvas.height / 2 - 135 : panelY + paddingY;

      context.fillStyle = '#f5f5f5';
      context.font = titleFont;
      context.fillText(title, contentCenterX, currentY);

      currentY += titleHeight + gapAfterTitle;

      if (subtitleLines.length > 0) {
         context.fillStyle = '#a5a5b5';
         context.font = subtitleFont;

         subtitleLines.forEach((line) => {
            context.fillText(line, contentCenterX, currentY);
            currentY += subtitleLineHeight;
         });

         currentY += gapAfterSubtitle;
      }

      if (primaryAction) {
         const time = performance.now() / 1000;

         const isPulse = primaryActionEffect === 'pulse';
         const isGlow = primaryActionEffect === 'glow';

         const pulse = isPulse ? (Math.sin(time * 3) + 1) / 2 : 0;

         const fontSize = isPulse ? 18 + pulse * 1.5 : 17;
         const glowBlur = isPulse ? 8 + pulse * 10 : isGlow ? 8 : 0;
         const glowOpacity = isPulse ? 0.85 + pulse * 0.15 : 0.95;

         context.save();

         context.font = `700 ${fontSize}px JetBrains Mono`;
         context.textAlign = 'center';
         context.textBaseline = 'top';

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
            context.fillStyle = '#a5a5b5';
            context.fillText(line, contentCenterX, currentY);
            currentY += instructionLineHeight;
         });
      }

      context.restore();
   }

   drawHUD(lines) {
      const { context, canvas } = this;

      const lineHeight = 20;
      const paddingX = 18;
      const paddingY = 12;
      const minBoxWidth = 320;

      context.save();

      context.font = '600 14px JetBrains Mono';
      context.textAlign = 'center';
      context.textBaseline = 'top';

      const longestLineWidth = Math.max(
         ...lines.map((line) => context.measureText(line).width),
      );

      const boxWidth = Math.max(minBoxWidth, longestLineWidth + paddingX * 2);
      const boxHeight = lines.length * lineHeight + paddingY * 2;

      const boxX = (canvas.width - boxWidth) / 2;
      const boxY = 18;

      context.fillStyle = 'rgba(0, 0, 0, 0.45)';
      context.fillRect(boxX, boxY, boxWidth, boxHeight);

      lines.forEach((line, index) => {
         const textY = boxY + paddingY + index * lineHeight;

         context.fillStyle = index === 0 ? '#f5f5f5' : '#ffd166';
         context.fillText(line, canvas.width / 2, textY);
      });

      context.restore();
   }
   // ------------------

   // Menu Scene -----
   drawMenuScene(scene) {
      const { context, canvas } = this;
      const staticCamera = { x: 0, y: 0, zoom: 1 };

      context.save();

      // grade de fundo alinhada ao tileSize
      context.strokeStyle = 'rgba(255, 255, 255, 0.04)';
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
            scene.goal.color || '#2dd4bf',
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
                  visualType: ground.visualType || 'ground',
                  sprite: ground.sprite || 'ground',
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
                  visualType: platform.visualType || 'platform',
                  sprite: platform.sprite || 'platform',
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
               hazard.color || '#ff5c7a',
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
            scene.goal.color || '#2dd4bf',
            staticCamera,
         );
      }

      // player decorativo
      if (scene.player) {
         const rect = this.getMenuTileRect(scene.player);

         context.fillStyle = scene.player.color || '#f5f5f5';
         context.fillRect(rect.x, rect.y, rect.width, rect.height);
      }

      context.restore();
   }

   drawHazardStripMenu({ x, y, width, height, color = '#ff5c7a' }) {
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

      const color = collectible.color || '#ffd166';

      // glow externo
      this.drawCircle(baseX, floatingY, radius + 3, color, staticCamera, {
         opacity: 0.18,
         shadowColor: color,
         shadowBlur: 12,
      });

      // corpo principal
      this.drawCircle(baseX, floatingY, radius, color, staticCamera, {
         strokeColor: '#ffefb0',
         lineWidth: 1.5,
         shadowColor: color,
         shadowBlur: 8,
      });

      // brilho interno
      this.drawCircle(
         baseX - radius * 0.25,
         floatingY - radius * 0.25,
         radius * 0.28,
         '#fff4c7',
         staticCamera,
         {
            opacity: 0.9,
         },
      );
   }
   // ------------------

   // World Objects ----
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
      this.context.fillStyle = this.hexToRgba('#d6fff8', coreOpacity);
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

   drawGoalPortal(
      x,
      y,
      width,
      height,
      color,
      camera = { x: 0, y: 0, zoom: 1 },
   ) {
      this.drawGoalPortalGlow(x, y, width, height, color, camera);
      this.drawGoalPortalBody(x, y, width, height, color, camera);
   }

   drawHazardSpikes(
      x,
      y,
      width,
      height,
      color = '#ff5c7a',
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
      this.context.fillStyle = this.hexToRgba('#ffd6df', 0.45);

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
         visualType = 'platform',
         sprite = 'platform',
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
      if (visualType === 'separate') {
         this.context.fillStyle = 'rgba(255, 255, 255, 0.03)';
         this.context.fillRect(screenX, screenY, screenWidth, 1.5 * zoom);
      }

      this.context.restore();
   }

   getPlatformSpriteStyle(sprite = 'platform') {
      const spriteStyles = {
         ground: {
            bodyColor: '#292938',
            topColor: '#3a3a4d',
            bottomShadeColor: '#20202c',
            topHeightMultiplier: 0.14,
            maxTopHeight: 7,
            showBottomShadeByDefault: false,
         },

         platform: {
            bodyColor: '#2d2d3d',
            topColor: '#46465c',
            bottomShadeColor: '#20202c',
            topHeightMultiplier: 0.18,
            maxTopHeight: 8,
            showBottomShadeByDefault: true,
         },

         separatePlatform: {
            bodyColor: '#303044',
            topColor: '#55556f',
            bottomShadeColor: '#1f1f2b',
            topHeightMultiplier: 0.2,
            maxTopHeight: 8,
            showBottomShadeByDefault: true,
         },
      };

      return spriteStyles[sprite] || spriteStyles.platform;
   }
   // ------------------

   // Helpers ----------
   hexToRgba(hex, opacity = 1) {
      const normalizedHex = hex.replace('#', '');

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
   // ------------------
}
