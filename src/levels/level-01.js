import { platform, position, goal } from '../utils/levelBuilder.js';

export const level01 = {
   name: 'Level 01',
   playerStart: position(2, 22),

   platforms: [
      // chão inicial
      platform(0, 28, 28),

      // buraco
      platform(36, 28, 39),

      // sequência de pulos
      platform(8, 24, 5),
      platform(16, 21, 5),
      platform(25, 25, 6),

      // fim da fase
      platform(60, 24, 6),
   ],

   goal: goal(70, 26.5, 1, 1.5),
};
