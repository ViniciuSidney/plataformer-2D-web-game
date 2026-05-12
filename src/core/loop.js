export class Loop {
	constructor(update, draw) {
		this.update = update;
		this.draw = draw;

		this.lastTime = 0;
		this.accumulator = 0;

		this.fixedTimeStep = 1000 / 60;
		this.maxFrameTime = 250;

		this.isRunning = false;
	}

	start() {
		if (this.isRunning) return;

		this.isRunning = true;
		this.lastTime = performance.now();

		requestAnimationFrame((currentTime) => this.run(currentTime));
	}

	run(currentTime) {
		if (!this.isRunning) return;

		let frameTime = currentTime - this.lastTime;
		this.lastTime = currentTime;

		if (frameTime > this.maxFrameTime) {
			frameTime = this.maxFrameTime;
		}

		this.accumulator += frameTime;

		while (this.accumulator >= this.fixedTimeStep) {
			this.update();
			this.accumulator -= this.fixedTimeStep;
		}

		this.draw();

		requestAnimationFrame((nextTime) => this.run(nextTime));
	}

	stop() {
		this.isRunning = false;
	}
}
