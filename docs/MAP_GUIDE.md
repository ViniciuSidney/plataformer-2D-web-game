# Guia de Símbolos dos Mapas

Este arquivo documenta os símbolos usados nos mapas textuais das fases.

---

## Entidades

| Símbolo | Significado | Uso |
|---|---|---|
| `.` | Vazio | Espaço sem colisão e sem entidade |
| `J` | Início do jogador | Define onde o jogador começa a fase |
| `G` | Portal / objetivo final | Define o objetivo de conclusão da fase |
| `C` | Moeda coletável | Coletável opcional |
| `H` | Perigo / espinho | Causa derrota ao tocar |

---

## Tiles sólidos

| Símbolo | Tipo visual | Sprite lógico | Uso |
|---|---|---|---|
| `B` | `ground` | `ground` | Terreno/chão fundível |
| `P` | `platform` | `platform` | Plataforma conectável |
| `S` | `separate` | `separatePlatform` | Plataforma separada/destacada |

---

## Recomendações de uso

Use `B` para chão, paredes, pilares e estruturas que devem parecer parte do terreno.

Use `P` para plataformas e estruturas que podem se conectar visualmente com outras plataformas.

Use `S` para peças que devem parecer independentes, com mais destaque visual.

---

## Regras visuais

Tiles `B` se fundem visualmente com outros tiles `B`.

Tiles `P` se conectam visualmente com outros tiles `P`.

Tiles `S` não se fundem visualmente com outros tiles.

---

## Exemplo

```txt
................................................
.........................C......................
......................SSSS......................
...............PPPP.............................
..J.........................................G...
BBBBBBBBBB......BBBBBBBBBBBB....BBBBBBBBBBBBBBBB
BBBBBBBBBB......BBBBBBBBBBBB....BBBBBBBBBBBBBBBB