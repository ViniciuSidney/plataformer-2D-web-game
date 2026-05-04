import { Platform } from "../entities/platform.js";

export class LevelSystem {
  static createPlatforms(levelData) {
    return levelData.platforms.map((platformData) => {
      return new Platform(platformData);
    });
  }
}