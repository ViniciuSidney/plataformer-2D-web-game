import { Entity } from './entity.js';

export class Collectible extends Entity {
   constructor({ x, y, width, height, color = '#ffd166' }) {
      super({
         x,
         y,
         width,
         height,
         color,
      });

      this.isCollected = false;

      this.baseY = y;

      this.floatAmplitude = 3;
      this.floatSpeed = 2.4;
      this.floatOffset = (x + y) * 0.01;
   }

   collect() {
      this.isCollected = true;
   }

   draw(renderer, camera) {
      if (this.isCollected) return;

      const time = performance.now() / 1000;
      const floatingY =
         this.baseY +
         Math.sin(time * this.floatSpeed + this.floatOffset) * this.floatAmplitude;

      const centerX = this.x + this.width / 2;
      const centerY = floatingY + this.height / 2;

      const radius = this.width / 2;
      const glowRadius = radius + 3;

      // glow externo
      renderer.drawCircle(
         centerX,
         centerY,
         glowRadius,
         '#ffd166',
         camera,
         {
            opacity: 0.18,
            shadowColor: '#ffd166',
            shadowBlur: 12,
         }
      );

      // corpo principal da moeda
      renderer.drawCircle(
         centerX,
         centerY,
         radius,
         '#ffd166',
         camera,
         {
            strokeColor: '#ffefb0',
            lineWidth: 1.5,
            shadowColor: '#ffd166',
            shadowBlur: 8,
         }
      );

      // brilho interno
      renderer.drawCircle(
         centerX - radius * 0.25,
         centerY - radius * 0.25,
         radius * 0.25,
         '#ffea98',
         camera,
         {
            opacity: 0.9,
         }
      );
   }
}