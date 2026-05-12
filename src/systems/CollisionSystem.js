export class CollisionSystem {
  static checkAABBCollision(entityA, entityB) {
    return (
      entityA.x < entityB.x + entityB.width &&
      entityA.x + entityA.width > entityB.x &&
      entityA.y < entityB.y + entityB.height &&
      entityA.y + entityA.height > entityB.y
    );
  }

  static resolveHorizontalPlatformCollision(player, platforms) {
    for (const platform of platforms) {
      const isColliding = this.checkAABBCollision(player, platform);

      if (!isColliding) continue;

      if (player.velocityX > 0) {
        player.x = platform.x - player.width;
        player.velocityX = 0;
      }

      if (player.velocityX < 0) {
        player.x = platform.x + platform.width;
        player.velocityX = 0;
      }
    }
  }

  static resolveVerticalPlatformCollision(player, platforms) {
    player.isOnGround = false;

    for (const platform of platforms) {
      const isColliding = this.checkAABBCollision(player, platform);

      if (!isColliding) continue;

      if (player.velocityY > 0) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.isOnGround = true;
      }

      if (player.velocityY < 0) {
        player.y = platform.y + platform.height;
        player.velocityY = 0;
      }
    }
  }

  static checkGoalCollision(player, goal) {
    return this.checkAABBCollision(player, goal);
  }

  static checkHazardCollision(player, hazards) {
    return hazards.some((hazard) => {
      return this.checkAABBCollision(player, hazard);
    });
  }

  static collectItems(player, collectibles) {
    const collectedItems = [];

    collectibles.forEach((collectible) => {
      if (collectible.isCollected) return;

      if (this.checkAABBCollision(player, collectible)) {
        collectible.collect();
        collectedItems.push(collectible);
      }
    });

    return collectedItems;
  }
}
