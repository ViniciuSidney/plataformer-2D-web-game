export class Entity {
  constructor({ x, y, width, height, color }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  update() {
    // Método reservado para futuras atualizações da entidade.
  }

  draw(renderer) {
    renderer.drawRect(this.x, this.y, this.width, this.height, this.color);
  }
}