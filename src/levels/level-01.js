import { platform, position, goal } from '../utils/levelBuilder.js';

export const level01 = {
   name: 'Level 01',
   playerStart: position(2, 22),

   platforms: [
      //x, y, widthInTiles, heightInTiles



      // chão inicial
      platform(0, 28, 28, 6),

      // buraco
      platform(40, 28, 39, 6),

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
