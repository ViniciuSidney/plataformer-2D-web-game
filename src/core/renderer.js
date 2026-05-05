import { GAME_CONFIG } from "../config/gameConfig.js";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  clear() {
    this.context.fillStyle = GAME_CONFIG.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawRect(x, y, width, height, color, camera = { x: 0, y: 0 }) {
    this.context.fillStyle = color;

    this.context.fillRect(x - camera.x, y - camera.y, width, height);
  }

  drawWorldGrid(camera) {
    const spacing = GAME_CONFIG.tileSize;
    const majorEvery = GAME_CONFIG.debug.gridMajorLineEvery || 4;
    const showLabels = GAME_CONFIG.debug.showGridRulerLabels;

    const totalColumns = Math.ceil(GAME_CONFIG.worldWidth / spacing);
    const totalRows = Math.ceil(GAME_CONFIG.worldHeight / spacing);

    const startColumn = Math.max(0, Math.floor(camera.x / spacing) - 1);
    const endColumn = Math.min(
      totalColumns,
      Math.ceil((camera.x + this.canvas.width) / spacing) + 1,
    );

    const startRow = Math.max(0, Math.floor(camera.y / spacing) - 1);
    const endRow = Math.min(
      totalRows,
      Math.ceil((camera.y + this.canvas.height) / spacing) + 1,
    );

    this.context.save();

    const majorStrokeColor = "rgba(79, 131, 143, 0.25)";

    // linhas verticais
    for (let column = startColumn; column <= endColumn; column++) {
      const worldX = column * spacing;
      const screenX = worldX - camera.x;

      const isMajorLine = column % majorEvery === 0;

      this.context.beginPath();
      this.context.moveTo(screenX, 0);
      this.context.lineTo(screenX, this.canvas.height);

      if (isMajorLine) {
        this.context.strokeStyle = majorStrokeColor;
        this.context.lineWidth = 1.25;
        this.context.setLineDash([]);
      } else {
        this.context.strokeStyle = "#2a2a35";
        this.context.lineWidth = 1;
        this.context.setLineDash([4, 4]);
        this.context.lineDashOffset = (performance.now() / 120) % 8;
      }

      this.context.stroke();

      if (showLabels && isMajorLine) {
        this.drawGridLabel(`${column}`, screenX + 4, 14, "top");
      }
    }

    // linhas horizontais
    for (let row = startRow; row <= endRow; row++) {
      const worldY = row * spacing;
      const screenY = worldY - camera.y;

      const isMajorLine = row % majorEvery === 0;

      this.context.beginPath();
      this.context.moveTo(0, screenY);
      this.context.lineTo(this.canvas.width, screenY);

      if (isMajorLine) {
        this.context.strokeStyle = majorStrokeColor;
        this.context.lineWidth = 1.25;
        this.context.setLineDash([]);
      } else {
        this.context.strokeStyle = "#2a2a35";
        this.context.lineWidth = 1;
        this.context.setLineDash([4, 4]);
        this.context.lineDashOffset = (performance.now() / 120) % 8;
      }

      this.context.stroke();

      if (showLabels && isMajorLine) {
        this.drawGridLabel(`${row}`, 6, screenY - 4, "left");
      }
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
    this.context.save();

    this.context.fillStyle = "rgba(0, 0, 0, 0.55)";
    this.context.fillRect(40, 44, 100, 88);

    this.context.fillStyle = "#f5f5f5";
    this.context.font = "14px JetBrains Mono";
    this.context.textAlign = "left";

    lines.forEach((line, index) => {
      this.context.fillText(line, 52, 62 + index * 20);
    });
    this.context.restore();
  }

  drawOverlayMessage(title, subtitle, restartText) {
    const { context, canvas } = this;

    context.save();

    context.fillStyle = "rgba(0, 0, 0, 0.55)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#f5f5f5";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.font = "700 42px Lexend";
    context.fillText(title, canvas.width / 2, canvas.height / 2 - 24);

    context.font = "400 18px Lexend";
    context.fillStyle = "#a5a5b5";
    context.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 24);

    context.font = "400 14px Lexend";
    context.fillStyle = "#a5a5b5";
    context.fillText(restartText, canvas.width / 2, canvas.height / 2 + 140);

    context.restore();
  }

  drawCameraDeadZone(camera) {
    const deadZone = GAME_CONFIG.cameraDeadZone;

    const x = (this.canvas.width - deadZone.width) / 2;
    const y = (this.canvas.height - deadZone.height) / 2;

    this.context.save();

    this.context.strokeStyle = "rgba(139, 233, 253, 0.35)";
    this.context.lineWidth = 2;
    this.context.strokeRect(x, y, deadZone.width, deadZone.height);

    this.context.restore();
  }
}
