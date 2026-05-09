export const GAME_CONFIG = {
   tileSize: 32,

   screen: {
      width: 960,
      height: 512,
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
      showWorldGrid: true,
      showCameraDeadZone: false,
      showDebugText: false,

      gridMajorLineEvery: 4,
      showGridRulerLabels: false,

      levelEditMode: false,
      editLevelIndex: 0, // 0 = Level 01
      hidePlayerInEditMode: false,

      editCamera: {
         x: 300,
         y: 720,
         zoom: 0,
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
