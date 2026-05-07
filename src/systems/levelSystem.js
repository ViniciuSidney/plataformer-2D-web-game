import { Platform } from '../entities/platform.js';
import { Goal } from '../entities/goal.js';
import { Hazard } from '../entities/hazard.js';

export class LevelSystem {
   static createPlatforms(levelData) {
      return levelData.platforms.map((platformData) => {
         return new Platform(platformData);
      });
   }

   static createGoal(levelData) {
      return new Goal(levelData.goal);
   }

   static createHazards(levelData) {
      if (!levelData.hazards) {
         return [];
      }

      return levelData.hazards.map((hazardData) => {
         return new Hazard(hazardData);
      });
   }
}
