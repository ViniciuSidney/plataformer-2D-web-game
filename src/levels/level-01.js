import {
  platform,
  position,
  goal,
  hole,
  groundWithHoles,
} from "../utils/levelBuilder.js";

import { GAME_CONFIG } from "../config/gameConfig.js";

const worldColumns = GAME_CONFIG.world.columns;

export const level01 = {
  name: "Level 01",

  playerStart: position(2, 26),

  platforms: [
    // chão principal com buraco
    ...groundWithHoles(0, 28, worldColumns, 6, 
      [hole(10, 6), hole(28, 12)]),

    // sequência de pulos
    platform(7, 26, 2, 2),

    platform(12, 29, 2, 1),
    platform(12, 24, 1, 1),

    platform(16, 22, 4, 3.5),

    platform(16, 27, 5, 1),
    platform(27, 23, 1, 5),
    platform(26, 22, 2, 1),
    platform(32, 28, 5, 1),
  
    platform(32, 18, 1, 4),

    platform(40, 26, 2, 2),

    platform(42, 23.5, 2, 1),


    // fim da fase
    platform(32, 22, 6),
  ],

  goal: goal(34, 20, 1, 2),
};
