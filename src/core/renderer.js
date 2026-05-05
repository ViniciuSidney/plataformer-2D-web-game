import { GAME_CONFIG } from '../config/gameConfig.js';

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
      const spacing = 120;

      this.context.strokeStyle = '#2a2a35';
      this.context.lineWidth = 1;

      for (let x = 0; x <= GAME_CONFIG.worldWidth; x += spacing) {
         const screenX = x - camera.x;

         this.context.beginPath();
         this.context.moveTo(screenX, 0);
         this.context.lineTo(screenX, this.canvas.height);
         this.context.stroke();
      }
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
}
