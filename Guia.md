# Guia do Criador de Histórias — Motor RPG Point-and-Click

Este guia é a **receita definitiva** para criar novas histórias utilizando este motor de jogo de aventura gráfica gótica point-and-click.

Com a separação completa entre a lógica do motor (`engine.js`) e as regras da sua história (`story.js`), você pode criar um jogo completo apenas editando um arquivo de configuração JSON/JS e gerando as mídias (artes e sons).

---

## 1. Visão Geral da Arquitetura do Motor

O jogo funciona através de uma arquitetura modular de três camadas:
1. **`game.html` (Interface)**: Tela única de jogo contendo o viewport principal, barra lateral de inventário, caixa de diálogo gótica e overlays para close-ups de cena ou puzzles mecânicos dedicados.
2. **`engine.js` (Lógica)**: Gerencia o ciclo de jogo, manipulação do mouse (cursor limpo sem dedurar o hotspot), lanterna, salvamento automático via `localStorage`, lógica de inventário, combinações de forja, telas de puzzles e desenho dos estados do cenário.
3. **`story.js` (Conteúdo)**: Onde a sua história é inteiramente definida. É um banco de dados JavaScript que configura os itens, as forjas, os mini-games de puzzle, as salas e as interações.

---

## 2. A Estrutura de `story.js` (O Banco de Dados)

O arquivo `story.js` deve expor uma única variável global `STORY_DATA` com a seguinte estrutura de subobjetos:

```javascript
const STORY_DATA = {
  // Identificação e Metadados
  metadata: {
    id: "rpg_cozinha_misteriosa", // Chave única para o localStorage
    title: "O Mistério da Cozinha",
    author: "Investigador Paranormal",
    startingRoom: "cozinha"
  },

  // Catálogo de Itens Coletáveis e Utilizáveis
  items: {
    banco_madeira: {
      id: "banco_madeira",
      name: "Banco de Madeira",
      emoji: "🪑",
      sprite: "banco.png",
      description: "Um banco de madeira firme, ideal para alcançar prateleiras altas."
    },
    pote_doce: {
      id: "pote_doce",
      name: "Pote de Doces",
      emoji: "🏺",
      sprite: "potedoce.png",
      description: "Um jarro lacrado cheio de doces caseiros da Condessa."
    }
  },

  // Mesa de Combinação (Forja)
  combinations: [
    {
      itemA: "haste_metal",
      itemB: "engrenagem",
      result: "manivela",
      successMessage: "Você combinou a haste de metal e a engrenagem para criar uma Manivela!"
    }
  ],

  // Puzzles de Tela Dedicada
  puzzles: {
    puzzle_armario: {
      title: "Mecanismo da Tranca",
      story: "A fechadura range. Ela só abre se você mover os pinos no ritmo e na ordem exatos.",
      clue: "Ordem clássica: Girar, Puxar, Segurar, Soltar.",
      kind: "sequence",
      options: ["Girar", "Puxar", "Segurar", "Soltar"],
      answer: ["Girar", "Puxar", "Segurar", "Soltar"]
    }
  },

  // Banco de Dados de Salas (Cenários)
  rooms: {
    cozinha: {
      title: "Cozinha Velha",
      image: "assets/images/cozinha_principal.png",
      goal: "Explore a cozinha e encontre os doces escondidos no armário alto.",
      
      // Sobreposições visuais que aparecem quando certas flags são ativadas
      overlays: [
        {
          flag: "armario_aberto",
          image: "assets/images/scenes/armario_aberto_overlay.png",
          x: 5, y: 70, w: 15, h: 20 // Coordenadas em % da tela
        },
        {
          flag: "banco_posicionado",
          image: "assets/images/scenes/banco_posicionado_overlay.png",
          x: 25, y: 78, w: 10, h: 12
        }
      ],

      // Áreas interativas invisíveis
      hotspots: [
        {
          id: "armario",
          label: "Armário de Madeira",
          x: 5, y: 70, w: 15, h: 20,
          action: {
            type: "puzzle",
            puzzleId: "puzzle_armario",
            onSuccess: {
              type: "set_flag",
              flag: "armario_aberto",
              message: "A porta do armário abre com um estrondo gótico!"
            }
          },
          inactiveIfFlag: "armario_aberto" // Some/Desativa quando aberto
        },
        {
          id: "banco_coletavel",
          label: "Coletar Banco",
          x: 8, y: 75, w: 8, h: 10,
          action: {
            type: "pickup",
            itemId: "banco_madeira",
            flag: "picked_banco"
          },
          activeIfFlag: "armario_aberto", // Só interativo se o armário estiver aberto!
          inactiveIfFlag: "picked_banco" // Some após coletar
        },
        {
          id: "chao_armario_alto",
          label: "Chão embaixo do armário alto",
          x: 25, y: 78, w: 10, h: 12,
          action: {
            type: "drag_place",
            requiredItem: "banco_madeira",
            setFlag: "banco_posicionado",
            successMessage: "Você posicionou o banco no chão embaixo do armário alto."
          },
          inactiveIfFlag: "banco_posicionado" // Só pode colocar uma vez
        },
        {
          id: "pote_doce_alto",
          label: "Pote de doces na prateleira alta",
          x: 25, y: 30, w: 10, h: 10,
          action: {
            type: "pickup",
            itemId: "pote_doce",
            flag: "picked_doce",
            isVictory: true // Conquista final / Vitória
          },
          condition: "banco_posicionado", // Só funciona se o banco estiver posicionado!
          conditionFailedMessage: "Está muito alto, não consigo alcançar de jeito nenhum. Preciso de algo para subir."
        }
      ]
    }
  }
};
```

---

## 3. Guia de Mecânicas Especiais

### A. Sem Cursor Indicador (Cursor Padrão)
Para preservar o fator exploração de mistério, o cursor do mouse **não muda** para mãozinha (`pointer`) ao passar em cima de hotspots do cenário. A exploração deve depender da leitura visual do cenário, da iluminação da lanterna e de cliques baseados na intuição. Somente elementos clássicos de HUD (botão de Mapa, fechar close-up, etc.) alteram o cursor.

### B. Overlays Visuais Condicionais
Em vez de renderizar cenários inteiramente novos para cada pequena mudança de estado, a sala principal ou closeup aceita um array de `overlays`. Cada overlay é uma imagem transparente que é desenhada nas coordenadas exatas `x, y, w, h` apenas se uma flag do `localStorage` estiver ativada como `true`.
*   *Uso recomendado*: Mostrar portas abrindo, caixas vazias após coleta, baús destrancados ou itens colocados na cena.

### C. Drag-and-Place (Arrastar e Posicionar)
O motor suporta nativamente a ação de arrastar um item do inventário físico e soltá-lo em uma coordenada da sala para mudar o cenário.
*   Configure o hotspot com `action: { type: 'drag_place', requiredItem: 'item_id', setFlag: 'flag_nome' }`.
*   Ao arrastar o item correto e soltar no hotspot, o item é consumido do inventário, a flag é setada e o cenário renderiza o novo overlay visual correspondente àquela flag.

---

## 4. Tipos de Puzzles Suportados

Ao interagir com um hotspot ou closeup, você pode disparar um mini-game de puzzle dedicado:

1.  **`sequence` (Puzzle de Ordem/Ritmo)**:
    *   O jogador precisa clicar em botões/ações na sequência predefinida correta.
    *   *Exemplo*: Trancas mecânicas, religar cabos, rituais onde as ações têm ordem exata.
2.  **`code` (Cofres e Painéis Digitais)**:
    *   Abre um teclado numérico onde o jogador insere um código.
    *   *Exemplo*: Abrir cofres blindados, painéis elétricos com senhas encontradas em cartas.
3.  **`choice` (Seleção Correta)**:
    *   Dentre múltiplas opções visuais, o jogador deve selecionar a única correta.
    *   *Exemplo*: Escolher o jarro de água frio dentre jarros rachados ou vazios.
4.  **`collect` (Limpeza de Resíduos)**:
    *   O jogador deve clicar e limpar camadas de sujeira, poeira ou teias de aranha para revelar o objeto oculto.

---

## 5. Manual de Geração de Imagens com IA

Para criar novas salas ou itens consistentes com a estética gótica e misteriosa premium:

### A. Fundos de Sala (16:9 - 1920x1080)
> **Prompt:** "Interior of [room name], slightly isometric view from above, gothic mansion atmosphere, realistic game art style, cinematic lighting, deep shadows, subtle volumetric fog, ultra detailed textures, no characters, no UI, 16:9."

### B. Elementos de Overlay (Consistência é Tudo)
Ao gerar overlays (ex: o armário aberto), gere exatamente a mesma imagem do cenário original, mas com o armário aberto. Depois, no Photoshop ou através de corte em ferramenta web, separe apenas a área do armário e salve como PNG com fundo transparente.
> **Prompt:** "Same camera view, same angle and lighting of the [room name], but the wooden cabinet door is wide open showing a dark empty interior, identical background, game asset, 16:9."

### C. Itens de Inventário (Fundo Transparente)
Gere os sprites isolados em um fundo limpo para recortar perfeitamente para a mochila.
> **Prompt:** "Single isolated rustic [item name], game icon asset, dark gothic aesthetic, high quality hand-painted texture, isolated on black background, square image, centered."

---

## 6. Sons e Ambientação

Assegure-se de mapear os efeitos sonoros para as pastas corretas:
-   `assets/audio/sfx_success.mp3` — Sucesso de puzzle.
-   `assets/audio/sfx_locked.mp3` — Tentativa inválida/erro/bloqueio.
-   `assets/audio/sfx_pickup.mp3` — Ao coletar um item do cenário.
-   `assets/audio/sfx_click.mp3` — Feedback leve de clique em botões.
