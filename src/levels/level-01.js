import { parseLevelText } from '../systems/levelTextParser.js';
import { level01Map } from './maps/level-01-map.js';

export const level01 = parseLevelText({
   name: 'Level 01 - Introdução',
   map: level01Map,
});
