import { parseLevelText } from '../systems/levelTextParser.js';
import { level02Map } from './maps/level-02-map.js';

export const level02 = parseLevelText({
   name: 'Level 02 - Saltos e Perigos',
   map: level02Map,
});
