# Changelog

Todas as mudanças importantes do projeto serão documentadas aqui.

## [Unreleased] - v0.2

### Adicionado
- Menu inicial funcional.
- Menu inicial em tela cheia.
- Cenário decorativo no menu inicial.
- Cenário do menu inicial criado por mapa textual.
- Cenário do menu inicial alinhado à grade de tiles.
- Destaque visual para a ação principal do menu.
- Tela de pausa.
- Tela de vitória de fase.
- Tela de derrota/Game Over.
- Tela de jogo concluído.
- Sistema centralizado de telas com `screens.js`.
- Animação de entrada para telas de estado.
- Ações principais destacadas nas telas de estado.
- Opção de voltar ao menu inicial a partir das telas de pausa, vitória e derrota.
- Sistema de troca de fases.
- Segunda fase jogável.
- Seleção de fase no modo edição.
- Troca de fase por teclado no modo edição.
- Fixed timestep no loop principal do jogo.
- Entidade de perigo/dano.
- Obstáculos perigosos nas fases.
- Entidade de coletável.
- Moedas coletáveis opcionais.
- Contador de moedas coletadas.
- HUD centralizada no topo da tela.
- HUD escalável conforme a quantidade de linhas.
- Animação no contador de moedas ao coletar.
- Popup `+1` ao coletar moedas.
- Efeito visual ao coletar moedas.
- Portal energético como objetivo final da fase.
- Efeito visual de vitória ao tocar no portal.
- Animação do player entrando no portal.
- Efeito visual de derrota ao tocar perigo ou cair.
- Reação visual do player ao tocar perigos.
- Reação diferenciada para perigo tocado por cima e pela lateral.
- Knockback visual lateral em trajetória parabólica.
- Idle visual do player.
- Animação visual de movimento do player.
- Animação visual de pulo e queda.
- Impacto visual ao aterrissar.
- Visual animado para moedas, com brilho e flutuação.
- Visual de espinhos para os perigos.
- Visual em camadas para plataformas.
- Gradiente inferior no cenário.
- Estilos visuais diferentes para tiles por sprite lógico.
- Sistema de criação de fases por mapa textual.
- Parser de fases baseado em caracteres.
- União horizontal e vertical de blocos contínuos no parser.
- Arquivo `levelSymbols.js` para centralizar símbolos, tipos visuais e sprites lógicos.
- Guia de símbolos dos mapas.
- Legenda oficial dos símbolos dos mapas.
- Conversão das fases para mapas textuais.

### Alterado
- O fluxo do jogo passou a usar estados mais organizados para menu, gameplay, pausa, vitória e derrota.
- O menu inicial deixou de ser apenas um painel e passou a ocupar a tela inteira.
- O menu inicial passou a usar a mesma lógica visual de tiles do jogo.
- As telas de pausa, vitória, derrota e fim de jogo passaram a usar uma estrutura visual padronizada.
- As telas de estado passaram a ter animação de entrada.
- A tela de fase concluída passou a usar destaque em verde azulado/teal.
- A tela de jogo concluído passou a usar destaque em amarelo dourado.
- O comando de voltar ao menu passou a funcionar apenas em telas de estado.
- O comando de reinício passou a funcionar apenas em telas de estado.
- O comando de avançar fase passou a funcionar apenas após a tela de vitória aparecer.
- As moedas passaram a ser coletáveis opcionais, sem bloquear a conclusão da fase.
- O objetivo final passou de um bloco simples para um portal energético.
- Os perigos passaram de blocos simples para espinhos visuais.
- O player passou a ter tamanho de 1 tile.
- O player passou a ter animações visuais sem alterar sua hitbox real.
- O player passou a reagir visualmente a perigo, pulo, queda, pouso e entrada no portal.
- As plataformas passaram a ter topo destacado e corpo com variações visuais.
- A criação de fases deixou de depender principalmente de código manual e passou a usar mapas por caracteres.
- Os tipos visuais dos tiles passaram a ser definidos pelos símbolos do mapa.
- O renderer passou a aplicar variações visuais com base em sprites lógicos.
- O loop principal passou a atualizar a lógica do jogo em ritmo fixo para estabilizar a física.

### Corrigido
- Correção do reinício da fase ao iniciar pelo menu.
- Correção de comportamento do zoom para não mostrar espaço vazio fora do mundo.
- Correção dos atalhos de troca de fase no modo edição.
- Ajuste dos comandos de menu e reinício para evitar acionamento durante a gameplay.
- Correção do brilho visual dos perigos e do portal para evitar aparência retangular.
- Ajuste da união visual de blocos gerados por mapa textual.
- Correção da velocidade do jogador em computadores com taxas de FPS diferentes.
- Correção do idle visual do player entrando no chão.
- Correção da sensação estranha na transição entre idle e movimento.
- Correção da animação da tela de derrota aparecendo escondida durante o delay.
- Correção do menu inicial sendo desenhado por cima da fase.
- Correção de vazamento visual ao voltar ao menu.
- Correção da transparência excessiva em painéis de vitória/derrota.
- Correção do estado visual do Canvas ao trocar entre telas.
- Correção do efeito de derrota por queda aparecendo fora da visão da câmera.
- Correção do repasse de direção do impacto ao tocar perigos.

### Planejado
- Revisar e balancear as fases iniciais.
- Revisar fluxo completo de estados do jogo.
- Ajustar textos finais das telas visuais.
- Fazer teste final do modo edição.
- Fazer teste final dos comandos.
- Fazer teste final dos efeitos visuais.
- Finalizar polimento visual básico da v0.2.

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