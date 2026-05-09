/*
Legenda do mapa:

. = vazio

J = início do jogador
G = portal / objetivo final
C = moeda coletável
H = perigo / espinho

B = terreno / chão fundível
P = plataforma conectável
S = plataforma separada / destacada

Uso recomendado:

B → chão, paredes, pilares e massas sólidas que devem parecer fundidas
P → plataformas e estruturas que podem se conectar visualmente
S → plataformas que devem parecer peças separadas
*/

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
      description: 'Terreno/chão fundível',
   },

   [LEVEL_SYMBOLS.PLATFORM]: {
      type: 'solid',
      visualType: 'platform',
      sprite: 'platform',
      description: 'Plataforma conectável',
   },

   [LEVEL_SYMBOLS.SEPARATE_PLATFORM]: {
      type: 'solid',
      visualType: 'separate',
      sprite: 'separatePlatform',
      description: 'Plataforma separada/destacada',
   },
};

export const ENTITY_DEFINITIONS = {
   [LEVEL_SYMBOLS.PLAYER]: {
      type: 'playerStart',
      description: 'Posição inicial do jogador',
   },

   [LEVEL_SYMBOLS.GOAL]: {
      type: 'goal',
      description: 'Portal/objetivo final',
   },

   [LEVEL_SYMBOLS.COLLECTIBLE]: {
      type: 'collectible',
      description: 'Moeda coletável',
   },

   [LEVEL_SYMBOLS.HAZARD]: {
      type: 'hazard',
      description: 'Perigo/espinho',
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
