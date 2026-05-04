export class CollisionSystem {
  static checkAABBCollision(entityA, entityB) {
    return (
      entityA.x < entityB.x + entityB.width &&
      entityA.x + entityA.width > entityB.x &&
      entityA.y < entityB.y + entityB.height &&
      entityA.y + entityA.height > entityB.y
    );
  }

  static resolveVerticalPlatformCollision(player, platforms) {
    player.isOnGround = false;

    for (const platform of platforms) {
      const isColliding = this.checkAABBCollision(player, platform);

      if (!isColliding) continue;

      const playerBottom = player.y + player.height;
      const platformTop = platform.y;

      const wasAbovePlatform =
        player.previousY + player.height <= platformTop;

      const isFalling = player.velocityY >= 0;

      if (wasAbovePlatform && isFalling) {
        player.y = platformTop - player.height;
        player.velocityY = 0;
        player.isOnGround = true;
      }
    }
  }
}