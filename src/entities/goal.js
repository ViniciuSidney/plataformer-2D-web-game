import { Entity } from './entity.js';

export class Goal extends Entity {
   constructor({ x, y, width, height, color = '#8be9fd' }) {
      super({
         x,
         y,
         width,
         height,
         color,
      });
   }
}
