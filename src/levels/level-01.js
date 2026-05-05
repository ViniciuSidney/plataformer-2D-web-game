
import { GAME_CONFIG } from '../config/gameConfig.js';

export const level01 = {
   playerStart: {
      x: 80,
      y: 200,
   },

   platforms: [
      {
         x: 0,
         y: 608,
         width: GAME_CONFIG.worldWidth / 2,
         height: GAME_CONFIG.worldHeight - 508,
      },
      {
         x: GAME_CONFIG.worldWidth / 1.5 ,
         y: 508,
         width: GAME_CONFIG.worldWidth / 2,
         height: GAME_CONFIG.worldHeight - 508,
      },
      {
         x: 260,
         y: 520,
         width: 160,
         height: 24,
      },
      {
         x: 520,
         y: 450,
         width: 160,
         height: 24,
      },
      {
         x: 1100,
         y: 550,
         width: 80,
         height: 24,
      },
      {
         x: 820,
         y: 430,
         width: 280,
         height: 24,
      },
      {
         x: 1180,
         y: 360,
         width: 180,
         height: 24,
      },
   ],

   goal: {
      x: 1300,
      y: 360 - 64,
      width: 36,
      height: 64,
   },
};
