import { Entity } from './entity.js';

export class Hazard extends Entity {
   constructor({ x, y, width, height, color = '#ff5c7a' }) {
      super({
         x,
         y,
         width,
         height,
         color,
      });
   }

   draw(renderer, camera) {
      renderer.drawHazardSpikes(
         this.x,
         this.y,
         this.width,
         this.height,
         this.color,
         camera,
      );
   }
}
