import {
   platform,
   position,
   goal,
   hole,
   groundWithHoles,
   hazard,
   collectible,
} from '../utils/levelBuilder.js';

import { GAME_CONFIG } from '../config/gameConfig.js';

const worldColumns = GAME_CONFIG.world.columns;

export const level02 = {
   name: 'Level 02 - O começo',

   playerStart: position(2, 26),

   platforms: [
      ...groundWithHoles(0, 28, worldColumns, 6, [
         hole(6, 8),
         hole(16, 8),
         hole(26, 8),
         hole(36, 8),
      ]),

      platform(13, 26, 1, 0.5),
      platform(8, 24, 3, 0.5),
      platform(2, 25, 2, 0.5),
      platform(0, 22, 1, 0.5),
      platform(1, 23.5, 1, 0.5),
      platform(4, 20, 1, 0.5),
      platform(8, 18, 1, 0.5),
      platform(13, 17, 1, 0.5),
      platform(14, 16, 2, 18),

      platform(11, 28, 3, 1),

      platform(18.5, 29, 3, 1),

      platform(29, 29, 2, 1),

      platform(39, 29, 2, 1),
   ],

   hazards: [
      //hazard(12, 27, 2, 1),
      //hazard(30, 27, 2, 1)
   ],

   collectibles: [
      collectible(12, 27),
      collectible(19.5, 28),
      collectible(29.5, 28),
      collectible(39.5, 28),
   ],

   goal: goal(45, 26, 1, 2),
};
