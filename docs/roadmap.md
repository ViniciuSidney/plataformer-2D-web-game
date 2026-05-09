# Roadmap

## v0.1 — Base inicial jogável

### Objetivo
Criar a primeira fundação jogável do projeto, com estrutura organizada, Canvas funcional, jogador controlável, câmera, física básica, colisão com plataformas, objetivo final, reinício e ferramentas iniciais de debug para criação de fases.

### Status
Concluída.

---

## Concluído na v0.1

- Estrutura inicial de arquivos ✅
- Documentação inicial do projeto ✅
- Canvas configurado ✅
- Renderização básica no Canvas ✅
- Loop principal do jogo ✅
- Jogador básico renderizado ✅
- Movimento lateral do jogador ✅
- Aceleração e desaceleração do jogador ✅
- Gravidade aplicada ao jogador ✅
- Gravidade melhorada durante a queda ✅
- Pulo básico ✅
- Pulo variável ✅
- Coyote time ✅
- Jump buffer ✅
- Limite de movimentação dentro do mundo ✅
- Mundo maior que a área visível do Canvas ✅
- Câmera seguindo o jogador ✅
- Câmera com zona morta ✅
- Câmera com suporte a zoom limitado ✅
- Plataforma/chão básico no mundo ✅
- Entidade de plataforma ✅
- Sistema de carregamento de fases ✅
- Construtor de fases por tiles ✅
- Criação de chão com buracos ✅
- Primeira fase de teste completa ✅
- Objetivo final da fase ✅
- Condição visual de vitória ✅
- Sistema simples de reinício ✅
- Queda/morte ao sair da área segura ✅
- Colisão vertical com plataformas ✅
- Colisão completa com plataformas ✅
- Grade visual de debug ✅
- Régua visual para criação de fases ✅
- Modo edição para visualizar fases ✅
- Controle dos elementos de debug por configuração ✅
- Correção de conflitos e restauração da versão com zoom limitado ✅
- Correção de nomenclatura do sistema de colisão ✅

---

## Fechamento da v0.1

A versão v0.1 foi considerada concluída porque o jogo possui:

- Um jogador controlável
- Movimento lateral funcional
- Física refinada de pulo e queda
- Câmera acompanhando o jogador
- Plataformas com colisão completa
- Uma fase simples jogável
- Um objetivo final
- Condição de vitória
- Sistema de reinício
- Morte por queda
- Ferramentas básicas de debug e edição de fase

---

# v0.2 — Estrutura de jogo, fases e experiência inicial

### Objetivo
Transformar a base jogável da v0.1 em uma experiência mais completa, com menu, fluxo de telas, sistema de fases, obstáculos, coletáveis, HUD, melhorias visuais minimalistas e criação de fases por mapas textuais.

### Status
Em desenvolvimento avançado.

---

## Concluído na v0.2

- Menu inicial funcional ✅
- Menu inicial em tela cheia ✅
- Menu inicial com cenário decorativo ✅
- Ação principal do menu com destaque visual ✅
- Tela de pausa ✅
- Tela de vitória de fase ✅
- Tela de derrota/Game Over ✅
- Tela de jogo concluído ✅
- Sistema centralizado de telas com `screens.js` ✅
- Ações principais destacadas nas telas ✅
- Opção de voltar ao menu inicial em telas de estado ✅
- Restrição do comando de menu apenas para telas de estado ✅
- Restrição do comando de reinício apenas para telas de estado ✅
- Sistema de troca de fases ✅
- Criação de pelo menos duas fases jogáveis ✅
- Seleção de fase no modo edição ✅
- Troca de fase por teclado no modo edição ✅
- Obstáculos/perigos simples ✅
- Entidade de perigo/dano ✅
- Coletáveis opcionais de moeda ✅
- Contador de coletáveis ✅
- HUD centralizada no topo ✅
- HUD escalável conforme a quantidade de linhas ✅
- Portal energético como objetivo final ✅
- Moedas com brilho e flutuação visual ✅
- Perigos com visual de espinhos ✅
- Plataformas com topo destacado e corpo em camadas ✅
- Melhorias visuais minimalistas dos elementos principais ✅
- Sistema de criação de fases por mapa textual ✅
- Parser de fases por caracteres ✅
- União horizontal e vertical de blocos contínuos ✅
- Centralização dos símbolos dos mapas em `levelSymbols.js` ✅
- Preparação de tiles para sprites lógicos ✅
- Variações visuais por sprite no `renderer.js` ✅
- Legenda oficial dos símbolos dos mapas ✅
- Conversão das fases para mapas textuais ✅

---

## Próximos passos da v0.2

- Revisar e balancear as fases 1 e 2
- Melhorar a documentação de criação de fases
- Criar guia de símbolos dos mapas
- Refinar comportamento visual de tiles `B`, `P` e `S`
- Melhorar feedback visual ao coletar moedas
- Melhorar feedback visual ao vencer/perder
- Revisar fluxo completo de estados do jogo
- Limpar métodos antigos de tela no `renderer.js`
- Remover ou arquivar sistemas antigos de criação manual de fases, se não forem mais usados
- Ajustar textos finais das telas visuais
- Finalizar polimento visual básico da v0.2

---

## Possível fechamento da v0.2

A versão v0.2 será considerada concluída quando o jogo tiver:

- Menu inicial funcional e visualmente definido
- Fluxo básico de telas
- Pelo menos duas fases jogáveis
- Sistema de troca de fases
- Obstáculos simples
- Coletáveis opcionais
- Interface mínima de jogo
- HUD funcional
- Debug controlável
- Criação de fases por mapa textual
- Símbolos de mapa documentados
- Visual minimalista mais definido
- Fases iniciais revisadas e jogáveis do início ao fim

---

## Ideias para v0.3 (Ainda a definir, suscetível a mudanças)

- Suporte inicial para dispositivos móveis
- Botões virtuais na tela
- Ajustes de responsividade
- Sistema de progresso salvo
- Seleção de fases
- Sons e efeitos simples
- Animações visuais mais completas
- Melhorias no modo edição
- Possível instalação como PWA
- Sprites reais para tiles e entidades
- Tileset visual dedicado
- Sistema de transição entre fases
- Tela de seleção de fases