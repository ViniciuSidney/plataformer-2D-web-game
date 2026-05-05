import { Entity } from './entity.js';

export class Goal extends Entity {
   constructor({ x, y, width, height, color = '#8bfdad' }) {
      super({
         x,
         y,
         width,
         height,
         color,
      });
   }
}
