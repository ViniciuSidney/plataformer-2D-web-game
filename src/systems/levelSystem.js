import { Platform } from '../entities/platform.js';
import { Goal } from '../entities/goal.js';

export class LevelSystem {
   static createPlatforms(levelData) {
      return levelData.platforms.map((platformData) => {
         return new Platform(platformData);
      });
   }

   static createGoal(levelData) {
      return new Goal(levelData.goal);
   }
}
