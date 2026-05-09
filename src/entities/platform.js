import { Entity } from './entity.js';

export class Platform extends Entity {
   constructor({
      x,
      y,
      width,
      height,
      color = '#2b2b3a',
      topColor = '#3a3a4d',
      bottomShadeColor = '#232330',
   }) {
      super({
         x,
         y,
         width,
         height,
         color,
      });

      this.topColor = topColor;
      this.bottomShadeColor = bottomShadeColor;
   }

   draw(renderer, camera, drawOptions = {}) {
      renderer.drawPlatformBlock(
         this.x,
         this.y,
         this.width,
         this.height,
         {
            bodyColor: this.color,
            topColor: this.topColor,
            bottomShadeColor: this.bottomShadeColor,
         },
         camera,
         drawOptions,
      );
   }
}
