# Mansao Misterio - Documento de Evolucao

## 1) Estado Atual Implementado

### Base multipagina
- Login funcional em `login.html`
- Mapa de salas em `mapa.html`
- Salas separadas:
  - `hall.html`
  - `sala-retratos.html`
  - `biblioteca.html`
  - `jardim.html`
  - `laboratorio.html`
  - `sotao.html`

### Gameplay gradual (capitulo principal)
- Inventario persistente (localStorage)
- Cadeia linear sem softlock
- Mesa de forja com drag and drop
- Portas com bloqueio por item
- Puzzle por cenas dedicadas (nao e zoom)
- Tooltip dinamico no rodape
- Toasts de feedback
- Tela de vitoria ao obter Chave de Ouro

### Ajustes solicitados aplicados
- Hotspots menores e invisiveis ao jogador
- Clique abre cena de puzzle dedicada (overlay de cena)
- Cenario geral mais escuro
- Estrutura pronta para receber efeitos sonoros por arquivo
- Mochila com skin por imagem (estilo survival)
- Hall v2 conectado com novas artes (relogio, retrato, lareira)
- Overlay de poeira ativado em cena de puzzle fullscreen

## 2) Arquitetura tecnica atual

### Arquivos principais
- `room-pages.js`: logica de salas, puzzles, inventario, forja, estados, vitoria
- `multipage.css`: visual das salas, hotspots invisiveis, overlay de puzzle, mochila

### Estado global salvo
- Chave localStorage: `misterio.storyState`
- Campos:
  - `inventory`: itens coletados
  - `flags`: puzzles/portas concluidos
  - `currentRoom`: sala atual
  - `victory`: final principal

## 3) Fluxo da historia principal (Capitulo 1)

1. Hall: coletar Haste de Metal e Engrenagem
2. Forjar Manivela
3. Relogio: usar Manivela -> Chave da Biblioteca
4. Sala de Retratos: coletar Grampo
5. Retrato Sombrio (Hall): usar Grampo -> Pe de Cabra
6. Janela Hall: usar Pe de Cabra -> Jardim
7. Biblioteca: coletar Jarro de Agua
8. Lareira Hall: usar Jarro -> Medalhao
9. Condessa: usar Medalhao -> Alicate
10. Fonte Jardim: usar Alicate -> Botao de Cofre
11. Cofre Biblioteca: usar Botao -> Chave de Ouro

## 4) Onde colocar imagens de puzzle (cenas dedicadas)

Pasta obrigatoria:
- `assets/images/scenes/`

Arquivos esperados:
- `assets/images/scenes/hall_clock_scene.png`
- `assets/images/scenes/hall_portrait_scene.png`
- `assets/images/scenes/hall_fireplace_scene.png`
- `assets/images/scenes/retratos_condessa_scene.png`
- `assets/images/scenes/jardim_fonte_scene.png`
- `assets/images/scenes/biblioteca_safe_scene.png`
- `assets/images/scenes/backpack_theforest_style.png`

Tamanho recomendado (puzzles):
- 1920 x 1080 px (16:9)
- Minimo aceitavel: 1600 x 900 px

Tamanho recomendado (mochila):
- 1024 x 1024 px
- Alternativa: 2048 x 2048 px para alta definicao

## 5) Prompts prontos para gerar artes

### Prompt base (puzzles de cena)
"Dark gothic hidden-object puzzle scene, realistic game art, cinematic lighting, high detail, old mansion mystery atmosphere, deep shadows, subtle volumetric fog, interactive focal object in center, no text, no UI, 16:9, ultra detailed textures, physically based rendering look"

### Prompt especifico - Lareira
"Dark fireplace puzzle scene inside an old haunted mansion, burning embers and flames, a metallic medallion partially hidden inside the fire, wet stone textures, moody orange and blue contrast lighting, suspense atmosphere, realistic, no characters, no UI, 16:9, high detail"

### Prompt especifico - Relogio
"Antique pendulum clock close scene, opened inner mechanism with rusty gears and secret lock cavity, gothic mansion atmosphere, dusty particles, dramatic side light, realistic hidden-object puzzle art, no UI, 16:9"

### Prompt especifico - Retrato sombrio
"Victorian haunted portrait frame close scene, hidden lock behind damaged painting canvas, dark wall textures, candle rim light, mystery puzzle composition, realistic, no UI, 16:9"

### Prompt especifico - Condessa
"Old countess portrait puzzle scene, medallion socket in ornate frame, cracked varnish, gothic interior, dramatic chiaroscuro lighting, realistic, no UI, 16:9"

### Prompt especifico - Fonte
"Abandoned garden statue fountain puzzle scene, rusted wires around drainage mechanism, wet moss stone, moonlit fog, dark fantasy realism, no UI, 16:9"

### Prompt especifico - Cofre
"Hidden brass safe between old bookshelves, close puzzle scene, insertion slot for circular safe button, dusty library, dramatic warm key light, realistic, no UI, 16:9"

### Prompt mochila estilo The Forest
"Survival backpack top-view interface background inspired by gritty forest survival games, rough fabric texture, straps, worn leather details, dark military-green and brown palette, empty layout space for item slots, realistic, no text, no icons, square image"

## 6) Onde colocar sons (para ativar efeitos)

Pasta recomendada:
- `assets/audio/`

Arquivos usados automaticamente pelas salas:
- `assets/audio/sfx_success.mp3`
- `assets/audio/sfx_locked.mp3`
- `assets/audio/sfx_pickup.mp3`

Observacao:
- Se os arquivos nao existirem, o jogo continua normalmente sem som.

## 7) Gradualidade futura: novos capitulos e multiplayer

### Estrategia de evolucao
- Capitulo 1: atual (single player linear)
- Capitulo 2+: novos arcos de historia por sala/ala
- Multiplayer cooperativo:
  - estado sincronizado de inventario e puzzles
  - papeis diferentes por jogador
  - chat rapido e ping de hotspot

### Preparacao tecnica recomendada
- Separar dados de puzzle em JSON por capitulo
- Criar camada de eventos (ex: puzzle solved, item collected)
- Substituir localStorage por backend quando iniciar multiplayer
- Adotar IDs de sessao e lock otimista de puzzle por jogador

## 8) Checklist para continuar no proximo ciclo

- [ ] Inserir imagens finais em `assets/images/scenes/`
- [ ] Inserir SFX em `assets/audio/`
- [ ] Ajustar hotspots finos com base nas novas artes
- [ ] Adicionar transicoes animadas de abertura de cena
- [ ] Adicionar trilha ambiente por sala
- [ ] Iniciar blueprint de Capitulo 2
- [ ] Definir modelo de sincronizacao multiplayer

## 9) Sprint Hall (Foco Total Antes dos Outros)

Regra de producao:
- Nao avancar para novo cenario antes de fechar Hall em: arte, puzzle, som, transicoes e feedback.

Objetivo do sprint:
- Hall ser um micro-jogo completo, com fluxo claro e acabamento visual/sonoro.

### Entregaveis obrigatorios do Sprint Hall
- Cena Hall fullscreen com HUD fixo (Mapa, Inventario, Relogio)
- Todos os hotspots do Hall calibrados na arte final
- 3 cenas dedicadas do Hall funcionais (Relogio, Retrato, Lareira)
- Cadeia Hall -> Retratos -> Hall -> Jardim -> Hall -> Biblioteca sem bloqueio injusto
- Feedback total por som/tooltip/toast/animacao

## 10) Mapeamento do Hall (Arte Atual hall_principal.png)

Referencias visuais detectadas na imagem atual:
- Escadaria esquerda (porta superior)
- Porta central ao fundo (acesso para retratos)
- Janela grande lateral direita
- Relogio de pendulo proximo da base da escada
- Lareira pequena lateral direita inferior
- Itens no tapete/escada/chao (potenciais coletas)

Hotspots do Hall definidos para o capitulo atual:
1. Porta de baixo (Hall -> Sala de Retratos)
2. Porta de cima (Hall -> Biblioteca, trancada por Chave da Biblioteca)
3. Janela (Hall -> Jardim, trancada por Pe de Cabra)
4. Coleta inicial de Haste de Metal no chao
5. Entrada da cena Relogio
6. Entrada da cena Retrato Sombrio
7. Entrada da cena Lareira

Estados de controle no Hall:
- `libraryDoorOpen`: abre caminho para Biblioteca
- `gardenWindowOpen`: abre caminho para Jardim
- `picked_metal_handle`: coleta unica
- `picked_gear_piece`: coleta unica
- `clock_mechanism_open`: puzzle concluido
- `portrait_lock_open`: puzzle concluido
- `fireplace_done`: puzzle concluido

## 11) Fluxo de Puzzle (Hall-Centrico)

Fluxo principal que precisa ficar 100% polido:
1. Hall: pegar Haste de Metal
2. Cena Relogio: pegar Engrenagem
3. Mochila/Forja: criar Manivela
4. Cena Relogio: usar Manivela -> Chave Biblioteca
5. Sala Retratos: pegar Grampo
6. Cena Retrato Hall: usar Grampo -> Pe de Cabra
7. Hall Janela: usar Pe de Cabra -> liberar Jardim
8. Biblioteca: pegar Jarro de Agua
9. Cena Lareira: usar Jarro -> Medalhao
10. Cena Condessa: usar Medalhao -> Alicate
11. Cena Fonte: usar Alicate -> Botao de Cofre
12. Cena Cofre: usar Botao -> Chave de Ouro

Criticos de UX para esse fluxo:
- Jogador sempre saber o proximo objetivo por tooltip + painel
- Nenhum clique morto sem resposta
- Todo bloqueio mostrar item requerido

## 12) Pacote de Novas Imagens do Hall (Produzir Agora)

Pasta: `assets/images/scenes/`

Imagens Hall obrigatorias:
1. `hall_clock_scene_v2.png` (integrado)
2. `hall_portrait_scene_v2.png` (integrado)
3. `hall_fireplace_scene_v2.png` (integrado)
4. `hall_transition_dust_overlay.png` (integrado)

Especificacao tecnica:
- Resolucao: 1920x1080
- Formato: PNG
- Sem texto embutido
- Sem elementos de UI prontos
- Iluminacao escura com foco no elemento interativo

Guia de composicao por cena:
- Relogio: engrenagem visivel na base e mecanismo no centro
- Retrato: fechadura escondida em moldura/parte lateral
- Lareira: brasa central com item parcialmente visivel

## 13) Definicao de Pronto (DoD) do Hall

Hall so sera considerado pronto quando:
- [ ] Hotspots funcionarem em desktop e mobile
- [ ] Cenas dedicadas abrirem em tela grande sem distorcao
- [ ] Inventario abrir/fechar rapido sem travar cena
- [ ] Trilha e SFX principais estarem aplicados
- [ ] Fluxo completo ate liberar Biblioteca e Jardim estiver estavel
- [ ] Documento atualizado com alteracoes finais de coordenadas

Depois do DoD do Hall:
- Iniciar Sprint Retratos com o mesmo padrao

## 14) Plano Responsividade + PWA Mobile (Paisagem)

Problema observado:
- Em algumas telas, a arte do Hall estava sendo cortada.
- Em mobile (principalmente paisagem), isso prejudica leitura dos pontos de interesse.

Ajustes aplicados agora:
- Cena principal nao corta mais a imagem:
  - imagem passa a encaixar inteira (`contain`) no viewport
  - hotspots sao reposicionados dinamicamente para o retangulo real da imagem
- Cena de puzzle fullscreen tambem sem corte:
  - imagem da cena usa encaixe inteiro
  - hotspots da cena sincronizam com area real renderizada
- Layout otimizado para baixa altura (celulares em paisagem):
  - HUD e tooltip compactam em `max-height` menor
  - painel lateral ajusta altura util

Arquivos com essa melhoria:
- `multipage.css`
- `room-pages.js`

### Roadmap PWA (proxima etapa)

Fase 1 - instalavel:
- [ ] Criar `manifest.webmanifest`
- [ ] Definir icones (`192x192` e `512x512`)
- [ ] Configurar `display: standalone`
- [ ] Definir `orientation: landscape`

Fase 2 - offline basico:
- [ ] Criar `service-worker.js`
- [ ] Cache de shell (html/css/js)
- [ ] Cache de imagens de cena
- [ ] Estrategia fallback offline

Fase 3 - qualidade mobile:
- [ ] Safe-area iOS (`env(safe-area-inset-*)`)
- [ ] Bloqueio de zoom acidental em interacoes criticas
- [ ] Ajuste de alvo de toque (48px min)
- [ ] Testes Android Chrome + iOS Safari

### Criticos de aceite mobile
- Jogavel em paisagem sem corte de imagem principal
- Hotspots permanecem alinhados apos rotacao
- Inventario e mapa acessiveis sem encobrir HUD
- Cenas de puzzle legiveis em telas pequenas
