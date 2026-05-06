import {
   platform,
   position,
   goal,
   hole,
   groundWithHoles,
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

      platform(19, 29, 2, 1),

      platform(12, 28, 2, 1),
      platform(13, 26, 1, 0.5),
      platform(8, 24, 3, 0.5),
      platform(2, 24, 2, 0.5),
      platform(0, 22, 1, 0.5),
      platform(4, 20, 1, 0.5),
      platform(8, 18, 1, 0.5),
      platform(13, 17, 1, 0.5),

      platform(14, 16, 2, 12),

      platform(29, 29, 2, 1),

      platform(39, 29, 2, 1),
   ],

   goal: goal(45, 26, 1, 2),
};
