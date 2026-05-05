import { GAME_CONFIG } from '../config/gameConfig.js';
import { clamp } from '../utils/math.js';

export class Camera {
   constructor() {
      this.x = 0;
      this.y = 0;

      this.width = GAME_CONFIG.width;
      this.height = GAME_CONFIG.height;

      this.worldWidth = GAME_CONFIG.worldWidth;
      this.worldHeight = GAME_CONFIG.worldHeight;

      this.deadZone = GAME_CONFIG.cameraDeadZone;
   }

   follow(target) {
      const targetScreenX = target.x - this.x;
      const targetScreenY = target.y - this.y;

      const deadZoneLeft = (this.width - this.deadZone.width) / 2;
      const deadZoneRight = deadZoneLeft + this.deadZone.width;

      const deadZoneTop = (this.height - this.deadZone.height) / 2;
      const deadZoneBottom = deadZoneTop + this.deadZone.height;

      if (targetScreenX < deadZoneLeft) {
         this.x = target.x - deadZoneLeft;
      }

      if (targetScreenX + target.width > deadZoneRight) {
         this.x = target.x + target.width - deadZoneRight;
      }

      if (targetScreenY < deadZoneTop) {
         this.y = target.y - deadZoneTop;
      }

      if (targetScreenY + target.height > deadZoneBottom) {
         this.y = target.y + target.height - deadZoneBottom;
      }

      this.limitToWorld();
   }

   limitToWorld() {
      this.x = clamp(this.x, 0, this.worldWidth - this.width);
      this.y = clamp(this.y, 0, this.worldHeight - this.height);
   }
}
