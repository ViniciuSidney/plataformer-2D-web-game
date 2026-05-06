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
      ...groundWithHoles(0, 28, worldColumns, 6, [hole(14, 8), hole(34, 6)]),

      platform(8, 25, 3, 1),
      platform(18, 24, 4, 1),
      platform(26, 24, 3, 1),
      platform(36, 24, 4, 1),
      platform(43, 22, 3, 1),
   ],

   goal: goal(45, 26, 1, 2),
};
