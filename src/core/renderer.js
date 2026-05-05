import { GAME_CONFIG } from '../config/gameConfig.js';
import { LEVEL_CONFIG } from '../config/levelConfig.js';

export class Renderer {
   constructor(canvas) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
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

      this.context.save();

      this.context.strokeStyle = '#2a2a35';
      this.context.lineWidth = 1;
      this.context.setLineDash([4, 4]);
      this.context.lineDashOffset = (performance.now() / 120) % 8;

      for (let x = 0; x <= GAME_CONFIG.worldWidth; x += spacing) {
         const screenX = x - camera.x;

         this.context.beginPath();
         this.context.moveTo(screenX, 0);
         this.context.lineTo(screenX, this.canvas.height);
         this.context.stroke();
      }

      for (let y = 0; y <= GAME_CONFIG.worldHeight; y += spacing) {
         const screenY = y - camera.y;

         this.context.beginPath();
         this.context.moveTo(0, screenY);
         this.context.lineTo(this.canvas.width, screenY);
         this.context.stroke();
      }

      this.context.restore();
   }

   drawDebugText(lines) {
      this.context.save();

      this.context.fillStyle = 'rgba(0, 0, 0, 0.55)';
      this.context.fillRect(16, 24, 140, 88);

      this.context.fillStyle = '#f5f5f5';
      this.context.font = '14px JetBrains Mono';
      this.context.textAlign = 'left';

      lines.forEach((line, index) => {
         this.context.fillText(line, 32, 42 + index * 20);
      });

      this.context.restore();
   }

   drawOverlayMessage(title, subtitle, restartText) {
      const { context, canvas } = this;

      context.save();

      context.fillStyle = 'rgba(0, 0, 0, 0.55)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = '#f5f5f5';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      context.font = '700 42px Lexend';
      context.fillText(title, canvas.width / 2, canvas.height / 2 - 24);

      context.font = '400 18px Lexend';
      context.fillStyle = '#a5a5b5';
      context.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 24);

      context.font = '400 14px Lexend';
      context.fillStyle = '#a5a5b5';
      context.fillText(restartText, canvas.width / 2, canvas.height / 2 + 140);

      context.restore();
   }

   drawCameraDeadZone(camera) {
      const deadZone = GAME_CONFIG.cameraDeadZone;

      const x = (this.canvas.width - deadZone.width) / 2;
      const y = (this.canvas.height - deadZone.height) / 2;

      this.context.save();

      this.context.strokeStyle = 'rgba(139, 233, 253, 0.35)';
      this.context.lineWidth = 2;
      this.context.strokeRect(x, y, deadZone.width, deadZone.height);

      this.context.restore();
   }
}
