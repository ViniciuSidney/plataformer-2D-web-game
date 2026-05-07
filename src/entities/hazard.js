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
}
