# Changelog

Todas as mudanças importantes do projeto serão documentadas aqui.

## [Unreleased] - v0.2

### Planejado
- Menu inicial.
- Tela de pausa.
- Telas de vitória e derrota mais organizadas.
- Sistema de troca de fases.
- Segunda fase jogável.
- Obstáculos simples.
- Entidade de perigo/dano.
- Coletáveis simples.
- Interface básica dentro do jogo.
- Melhorias visuais minimalistas.
- Controle para ativar/desativar debug.
- Melhor separação entre modo jogo e modo edição.

---

## [v0.1] - Base inicial jogável

### Adicionado
- Estrutura inicial de arquivos do projeto.
- Documentação inicial com roadmap, changelog e ideias.
- Página HTML base do jogo.
- Estilos iniciais da interface.
- Canvas principal do jogo.
- Configuração inicial do Canvas.
- Sistema de renderização básica.
- Loop principal com `requestAnimationFrame`.
- Entidade base para objetos do jogo.
- Jogador básico renderizado no Canvas.
- Sistema de entrada por teclado.
- Movimento lateral do jogador.
- Aceleração e desaceleração do jogador.
- Configuração básica de física.
- Gravidade aplicada ao jogador.
- Gravidade melhorada durante a queda.
- Pulo básico.
- Pulo variável.
- Coyote time.
- Jump buffer.
- Limites de movimentação dentro do mundo.
- Mundo maior que a área visível do Canvas.
- Câmera acompanhando o jogador.
- Câmera com zona morta.
- Câmera com suporte a zoom limitado.
- Entidade de plataforma.
- Sistema de carregamento de fases.
- Construtor de fases por tiles.
- Criação de chão com buracos.
- Primeira fase de teste.
- Chão e plataformas dentro do mundo.
- Objetivo final da fase.
- Condição visual de vitória.
- Sistema simples de reinício.
- Morte por queda.
- Colisão vertical com plataformas.
- Colisão completa com plataformas.
- Grade visual temporária para debug da câmera.
- Régua visual para criação de fases.
- Modo edição para visualização de fases.
- Controle dos elementos de debug por configuração.

### Corrigido
- Correção de nomenclatura do arquivo do sistema de colisão.
- Ajustes em imports após padronização de nomes de arquivos.
- Correção dos limites da câmera com zoom reduzido.
- Resolução de conflitos entre alterações locais e remotas.

### Alterado
- O chão deixou de ser desenhado diretamente pelo renderizador e passou a ser tratado como plataforma da fase.
- A movimentação do jogador passou a usar separação por eixo para melhorar a colisão.
- O limite de movimento passou a considerar o tamanho do mundo, não apenas o tamanho visível do Canvas.
- O tamanho do mundo passou a ser calculado com base em tiles.
- A criação de fases passou a usar funções auxiliares como `platform()`, `position()`, `goal()`, `hole()` e `groundWithHoles()`.
- Os elementos de debug passaram a ser controlados por configurações.