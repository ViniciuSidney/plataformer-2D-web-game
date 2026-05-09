import { Entity } from './entity.js';

export class Goal extends Entity {
   constructor({ x, y, width, height, color = '#2dd4bf' }) {
      super({
         x,
         y,
         width,
         height,
         color,
      });
   }

   draw(renderer, camera) {
      renderer.drawGoalPortalBody(
         this.x,
         this.y,
         this.width,
         this.height,
         this.color,
         camera,
      );
   }
}