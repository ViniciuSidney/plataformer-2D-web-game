import {
   platform,
   position,
   goal,
   hole,
   groundWithHoles,
} from '../utils/levelBuilder.js';

import { GAME_CONFIG } from '../config/gameConfig.js';

const worldColumns = GAME_CONFIG.world.columns;

export const level01 = {
   name: 'Level 01',

   playerStart: position(2, 26),

   platforms: [
      // chão principal com buraco
      ...groundWithHoles(0, 28, worldColumns, 6, [
         hole(28, 12),
      ]),

      // sequência de pulos
      platform(8, 26, 5, 2),
      platform(17, 24, 5, 4),
      platform(26, 22, 2, 1),
      platform(32, 28, 4, 1),

      // fim da fase
      platform(32, 22, 6),
   ],

   goal: goal(45, 26, 1, 2),
};