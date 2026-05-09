export const LEVEL_SYMBOLS = {
   EMPTY: '.',

   PLAYER: 'J',
   GOAL: 'G',

   COLLECTIBLE: 'C',
   HAZARD: 'H',

   GROUND: 'B',
   PLATFORM: 'P',
   SEPARATE_PLATFORM: 'S',
};

export const TILE_DEFINITIONS = {
   [LEVEL_SYMBOLS.GROUND]: {
      type: 'solid',
      visualType: 'ground',
      sprite: 'ground',
   },

   [LEVEL_SYMBOLS.PLATFORM]: {
      type: 'solid',
      visualType: 'platform',
      sprite: 'platform',
   },

   [LEVEL_SYMBOLS.SEPARATE_PLATFORM]: {
      type: 'solid',
      visualType: 'separate',
      sprite: 'separatePlatform',
   },
};

export const ENTITY_DEFINITIONS = {
   [LEVEL_SYMBOLS.PLAYER]: {
      type: 'playerStart',
   },

   [LEVEL_SYMBOLS.GOAL]: {
      type: 'goal',
   },

   [LEVEL_SYMBOLS.COLLECTIBLE]: {
      type: 'collectible',
   },

   [LEVEL_SYMBOLS.HAZARD]: {
      type: 'hazard',
   },
};

export function isSolidSymbol(symbol) {
   return Boolean(TILE_DEFINITIONS[symbol]);
}

export function getTileDefinition(symbol) {
   return TILE_DEFINITIONS[symbol];
}

export function getEntityDefinition(symbol) {
   return ENTITY_DEFINITIONS[symbol];
}
