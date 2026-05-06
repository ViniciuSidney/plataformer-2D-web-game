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

      this.zoom = 1;
   }

   setView({ x = 0, y = 0, zoom = 1 }) {
      this.zoom = zoom;
      this.applyZoomLimits();

      this.x = x;
      this.y = y;

      this.limitToWorld();
   }

   follow(target) {
      const targetScreenX = target.x - this.x;
      const targetScreenY = target.y - this.y;

      const deadZoneLeft = (this.width / this.zoom - this.deadZone.width) / 2;
      const deadZoneRight = deadZoneLeft + this.deadZone.width;

      const deadZoneTop = (this.height / this.zoom - this.deadZone.height) / 2;
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

   applyZoomLimits() {
      const minZoom = Math.max(
         this.width / this.worldWidth,
         this.height / this.worldHeight
      );

      const maxZoom = 2;

      this.zoom = clamp(this.zoom, minZoom, maxZoom);
   }

   limitToWorld() {
      const visibleWidth = this.width / this.zoom;
      const visibleHeight = this.height / this.zoom;

      const maxX = this.worldWidth - visibleWidth;
      const maxY = this.worldHeight - visibleHeight;

      if (maxX <= 0) {
         this.x = 0;
      } else {
         this.x = clamp(this.x, 0, maxX);
      }

      if (maxY <= 0) {
         this.y = 0;
      } else {
         this.y = clamp(this.y, 0, maxY);
      }
   }
}