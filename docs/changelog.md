# Changelog

Todas as mudanças importantes do projeto serão documentadas aqui.

## [Unreleased] - v0.1

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
- Limites de movimentação dentro do mundo.
- Câmera acompanhando o jogador.
- Mundo maior que a área visível do Canvas.
- Grade visual temporária para debug da câmera.
- Configuração básica de física.
- Gravidade aplicada ao jogador.
- Pulo básico.
- Entidade de plataforma.
- Sistema de carregamento de fases.
- Primeira fase de teste.
- Chão e plataformas dentro do mundo.
- Colisão vertical com plataformas.
- Colisão completa com plataformas.

### Corrigido
- Correção de nomenclatura do arquivo do sistema de colisão.
- Ajustes em imports após padronização de nomes de arquivos.

### Alterado
- O chão deixou de ser desenhado diretamente pelo renderizador e passou a ser tratado como plataforma da fase.
- A movimentação do jogador passou a usar separação por eixo para melhorar a colisão.
- O limite de movimento passou a considerar o tamanho do mundo, não apenas o tamanho visível do Canvas.