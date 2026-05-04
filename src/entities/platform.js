import { Entity } from "./entity.js";

export class Platform extends Entity {
  constructor({ x, y, width, height, color = "#2a2a35" }) {
    super({
      x,
      y,
      width,
      height,
      color,
    });
  }
}