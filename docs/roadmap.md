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
Transformar a base jogável da v0.1 em uma experiência mais completa, com menu inicial, fluxo de telas, sistema de fases, obstáculos, coletáveis, HUD, feedbacks visuais, melhorias minimalistas e criação de fases por mapas textuais.

### Status
Concluída.

---

## Concluído na v0.2

- Menu inicial funcional ✅
- Menu inicial em tela cheia ✅
- Menu inicial com cenário decorativo ✅
- Menu inicial criado por mapa textual ✅
- Menu inicial alinhado à grade de tiles ✅
- Ação principal do menu com destaque visual ✅
- Tela de pausa ✅
- Tela de vitória de fase ✅
- Tela de derrota/Game Over ✅
- Tela de jogo concluído ✅
- Sistema centralizado de telas com `screens.js` ✅
- Animação de entrada nas telas de estado ✅
- Ações principais destacadas nas telas ✅
- Opção de voltar ao menu inicial em telas de estado ✅
- Restrição do comando de menu apenas para telas de estado ✅
- Restrição do comando de reinício apenas para telas de estado ✅
- Sistema de troca de fases ✅
- Criação de pelo menos duas fases jogáveis ✅
- Seleção de fase no modo edição ✅
- Troca de fase por teclado no modo edição ✅
- Sistema de atualização com fixed timestep ✅
- Física estabilizada em diferentes taxas de FPS ✅
- Obstáculos/perigos simples ✅
- Entidade de perigo/dano ✅
- Coletáveis opcionais de moeda ✅
- Contador de coletáveis ✅
- HUD centralizada no topo ✅
- HUD escalável conforme a quantidade de linhas ✅
- Animação no contador de moedas ao coletar ✅
- Popup `+1` ao coletar moedas ✅
- Efeito visual ao coletar moedas ✅
- Portal energético como objetivo final ✅
- Efeito visual de vitória ao tocar no portal ✅
- Animação do player entrando no portal ✅
- Efeito visual de derrota ao tocar perigo ou cair ✅
- Reação visual do player ao tocar perigos ✅
- Reação diferente ao tocar perigo por cima e pela lateral ✅
- Knockback visual lateral em trajetória parabólica ✅
- Animações visuais do player ✅
- Idle visual do player ✅
- Animação de movimento do player ✅
- Animação visual de pulo e queda ✅
- Impacto visual ao aterrissar ✅
- Player ajustado para 1 tile de tamanho ✅
- Moedas com brilho e flutuação visual ✅
- Perigos com visual de espinhos ✅
- Plataformas com topo destacado e corpo em camadas ✅
- Gradiente inferior no cenário ✅
- Melhorias visuais minimalistas dos elementos principais ✅
- Sistema de criação de fases por mapa textual ✅
- Parser de fases por caracteres ✅
- União horizontal e vertical de blocos contínuos ✅
- Centralização dos símbolos dos mapas em `levelSymbols.js` ✅
- Preparação de tiles para sprites lógicos ✅
- Variações visuais por sprite no `renderer.js` ✅
- Guia de símbolos dos mapas ✅
- Conversão das fases para mapas textuais ✅
- Correção de vazamentos visuais ao voltar ao menu ✅
- Correção do painel transparente em telas de estado ✅

---

## Concluído no fechamento da v0.2

- Revisão do fluxo completo do jogo ✅
- Revisão e balanceamento das fases 1 e 2 ✅
- Ajuste dos textos finais das telas visuais ✅
- Teste final de comandos ✅
- Teste final dos efeitos visuais ✅
- Teste final do modo edição ✅
- Atualização da documentação final da v0.2 ✅
- Fechamento da v0.2 ✅

---

## Fechamento da v0.2

A versão v0.2 foi considerada concluída porque o jogo possui:

- Menu inicial funcional e visualmente definido
- Fluxo básico de telas
- Pelo menos duas fases jogáveis
- Sistema de troca de fases
- Obstáculos simples
- Coletáveis opcionais
- Interface mínima de jogo
- HUD funcional
- Feedback visual ao coletar moedas
- Feedback visual ao vencer
- Feedback visual ao perder
- Player com animações visuais básicas
- Física estável independente da taxa de FPS
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