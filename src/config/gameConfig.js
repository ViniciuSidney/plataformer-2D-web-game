export const GAME_CONFIG = {
   tileSize: 32,

   screen: {
      width: 960,
      height: 540,
   },

   world: {
      columns: 48,
      rows: 32,
   },

   deathZoneOffset: 2,

   cameraDeadZone: {
      width: 320,
      height: 220,
   },

   debug: {
      showWorldGrid: false,
      showCameraDeadZone: false,
      showDebugText: false,

      gridMajorLineEvery: 4,
      showGridRulerLabels: true,

      levelEditMode: true,
      editLevelIndex: 0, // 0 = Level 01
      hidePlayerInEditMode: true,

      editCamera: {
         x: 100,
         y: 720,
         zoom: 1.5,
      },
   },

   backgroundColor: '#181820',
};

GAME_CONFIG.width = GAME_CONFIG.screen.width;
GAME_CONFIG.height = GAME_CONFIG.screen.height;

GAME_CONFIG.worldWidth = GAME_CONFIG.world.columns * GAME_CONFIG.tileSize;
GAME_CONFIG.worldHeight = GAME_CONFIG.world.rows * GAME_CONFIG.tileSize;

GAME_CONFIG.deathZoneY =
   GAME_CONFIG.worldHeight + GAME_CONFIG.deathZoneOffset * GAME_CONFIG.tileSize;
