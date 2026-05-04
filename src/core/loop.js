export class Loop {
  constructor(update, draw) {
    this.update = update;
    this.draw = draw;

    this.animationFrameId = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.run();
  }

  stop() {
    this.isRunning = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  run() {
    if (!this.isRunning) return;

    this.update();
    this.draw();

    this.animationFrameId = requestAnimationFrame(() => this.run());
  }
}