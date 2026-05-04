export class Entity {
  constructor({ x, y, width, height, color }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;

    this.velocityX = 0;
    this.velocityY = 0;
  }

  update() {}

  draw(renderer, camera) {
    renderer.drawRect(this.x, this.y, this.width, this.height, this.color, camera);
  }
}