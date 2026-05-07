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
   }

   collect() {
      this.isCollected = true;
   }

   draw(renderer, camera) {
      if (this.isCollected) return;

      renderer.drawCircle(
         this.x + this.width,
         this.y + this.height,
         this.width / 2,
         this.color,
         camera,
      );
   }
}
