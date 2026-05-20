# Capítulo 01 - Ativos de Produção

## 1. Mapeamento de Assets de Imagem

### Fundos de Sala
```
Arquivo: casa_farol_principal.png
Dimensões: 1920x1080
Uso: Fundo da sala principal (casa de apoio do farol)
Descrição para IA: Interior de casa de apoio de farol costeiro após tempestade, 
  perspectiva frontal, madeira úmida, janelas com relâmpagos ao fundo, 
  iluminação dramática em azul e âmbar, estilo pintura digital semirrealista, 
  sem personagens, resolução 1920x1080
Hotspots visíveis na composição:
  - Porta da torre (centro-alto) com mecanismo de bronze circular
  - Estante de livros (esquerda)
  - Armário alto (direita)
  - Mesa de trabalho (centro-baixo)
  - Baú marítimo (frente-esquerda)
  - Painel solto na parede (direita-baixo)
  - Janela lateral (direita-cima)
  - Gancho vazio na parede (esquerda-alto)
```

### Cenas de Close-up (Overlays)
```
Arquivo: baú_marítimo_closed.png
Dimensões: 1200x800
Uso: Close-up do baú fechado antes do puzzle
Descrição: Baú antigo de madeira e metal, vista frontal, símbolo de maré em relevo 
  na tampa, ornamentos de bronze oxidado, fechadura com quatro espaços para símbolos, 
  estilo consistente com a sala principal

Arquivo: baú_marítimo_open.png
Dimensões: 1200x800
Uso: Close-up do baú depois de resolvido o puzzle
Descrição: Mesmo enquadramento, mesma perspectiva, mas a tampa está aberta 45 graus, 
  interior vazio e com marcas de uso, manivela de bronze visível no fundo escuro

Arquivo: armário_alto_vazio.png
Dimensões: 1000x900
Uso: Close-up do topo do armário (frasco de óleo visível)
Descrição: Topo de armário de madeira clara, frasco de vidro com líquido âmbar 
  (óleo), poeira, área de repouso clara indicando onde o frasco fica, luz difusa 
  caindo de cima

Arquivo: painel_mecanismo.png
Dimensões: 1200x900
Uso: Interface do mini-game da trava rotativa
Descrição: Painel de madeira e metal com mecanismo visível, trilhas metálicas 
  em forma de estrela, três discos giratórios no centro, encaixes claros, 
  manivela no topo esperando ser encaixada, eixo central com sinal de ferrugem, 
  iluminação que destaca os encaixes
```

### Sprites de Item (Inventário)
```
Arquivo: itens/banquinho_dobravel.png
Dimensões: 128x128
Uso: Ícone do banco no inventário
Descrição: Banquinho de madeira escura em perspectiva 3/4, encosto simples, 
  4 pernas, estilo consistente com a sala, fundo transparente

Arquivo: itens/chave_fenda_enferrujada.png
Dimensões: 128x128
Uso: Ícone da chave de fenda no inventário
Descrição: Chave de fenda com cabo de madeira, ponta de metal oxidado, 
  comprimento médio, vista lateral 45 graus, fundo transparente

Arquivo: itens/mapa_costa.png
Dimensões: 128x128
Uso: Ícone do mapa no inventário
Descrição: Mapa dobrado/enrolado com as bordas levemente úmidas, símbolos marítimos 
  visíveis, papel envelhecido, vista de cima, fundo transparente

Arquivo: itens/frasco_oleo.png
Dimensões: 128x128
Uso: Ícone do frasco de óleo no inventário
Descrição: Frasco de vidro redondo com tampinha de cortiça, líquido âmbar dentro, 
  rótulo com símbolo de âncora, vista frontal, fundo transparente

Arquivo: itens/manivela_bronze.png
Dimensões: 128x128
Uso: Ícone da manivela de bronze no inventário
Descrição: Manivela de bronze trabalhado, pesada, encaixes bem definidos, 
  com pequenos símbolos marítimos gravados, vista em perspectiva, fundo transparente
```

---

## 2. Definição de Itens do Inventário

```javascript
const CHAPTER_01_ITEMS = {
  banquinho_dobravel: {
    id: "banquinho_dobravel",
    name: "Banquinho Dobrável",
    sprite: "itens/banquinho_dobravel.png",
    description: "Um banquinho pequeno e leve. Pode ser arrastado para alcançar lugares altos.",
    type: "interactive",
    consumable: false
  },
  
  chave_fenda_enferrujada: {
    id: "chave_fenda_enferrujada",
    name: "Chave de Fenda Enferrujada",
    sprite: "itens/chave_fenda_enferrujada.png",
    description: "Ferramenta de metal com cabo de madeira. A ponta está oxidada mas ainda funciona.",
    type: "tool",
    consumable: false
  },
  
  mapa_costa: {
    id: "mapa_costa",
    name: "Mapa da Costa",
    sprite: "itens/mapa_costa.png",
    description: "Mapa antigo marcando pontos costeiros. Contém pistas visuais.",
    type: "clue",
    consumable: false
  },
  
  frasco_oleo: {
    id: "frasco_oleo",
    name: "Frasco de Óleo",
    sprite: "itens/frasco_oleo.png",
    description: "Óleo lubrificante com aroma de âmbar. Serve para desferrrujar mecanismos.",
    type: "consumable",
    consumable: true
  },
  
  manivela_bronze: {
    id: "manivela_bronze",
    name: "Manivela de Bronze",
    sprite: "itens/manivela_bronze.png",
    description: "Peça de bronze pesada com encaixes específicos. Parece faltar em algum mecanismo.",
    type: "key",
    consumable: false
  }
};
```

---

## 3. Definição de Puzzles

### Puzzle 1: Baú Marítimo (Observação)

```javascript
puzzle_baú_marítimo: {
  id: "puzzle_baú_marítimo",
  title: "Código do Baú Marítimo",
  story: "O baú está trancado com um mecanismo de símbolos. Não é coincidência que estejam ali.",
  clue: "Procure pistas na sala. O mapa, o livro, a rosa dos ventos... Tudo aponta para uma sequência.",
  kind: "symbols",
  
  symbols: [
    { id: "maré", label: "Símbolo de Maré", visual: "🌊" },
    { id: "ponto1", label: "Ponto Costeiro 1", visual: "⬆️" },
    { id: "ponto2", label: "Ponto Costeiro 2", visual: "➡️" },
    { id: "ponto3", label: "Ponto Costeiro 3", visual: "⬇️" },
    { id: "ponto4", label: "Ponto Costeiro 4", visual: "⬅️" }
  ],
  
  // A ordem correta vem observando:
  // 1. Livro da estante com símbolo de maré
  // 2. Mapa mostrando quatro pontos em ordem: cima, direita, baixo, esquerda
  // 3. Rosa dos ventos na parede confirmando direções
  correct_sequence: ["maré", "ponto1", "ponto2", "ponto3", "ponto4"],
  
  attempts: 3,
  onSuccess: {
    flag: "puzzle_baú_resolvido",
    message: "Um clique mecânico reverbera. A tampa do baú se abre lentamente.",
    reward_item: "manivela_bronze"
  },
  onFailure: {
    message: "Os símbolos não encaixam. Tente novamente.",
    penalty: "tentativa_desperdiçada"
  }
}
```

### Puzzle 2: Alcançar o Óleo (Manipulação)

```javascript
puzzle_alcançar_oleo: {
  id: "puzzle_alcançar_oleo",
  title: "Frasco Fora de Alcance",
  story: "O frasco de óleo está no topo do armário alto. Preciso de algo para alcançá-lo.",
  kind: "drag_place",
  
  // Este não é um puzzle formal, é interação com o cenário
  // Quando o jogador arrasta "banquinho_dobravel" para a frente do armário:
  required_item: "banquinho_dobravel",
  target_location: "frente_do_armário",
  
  onSuccess: {
    flag: "banco_posicionado",
    message: "Você coloca o banquinho firme no chão. Agora consegue alcançar o frasco.",
    visual_change: "banco_aparece_no_chão"
  },
  
  // Depois disso, hotspot do frasco é desbloqueado
  unblocks_item: "frasco_oleo"
}
```

### Puzzle 3: Trava Rotativa (Mini-game Mecânico)

```javascript
puzzle_trava_rotativa: {
  id: "puzzle_trava_rotativa",
  title: "Mecanismo da Trava do Farol",
  story: "A porta está travada por um mecanismo antigo de trilhas metálicas. Preciso conectar a energia do disco central até a trava.",
  clue: "A manivela encaixa no topo. O óleo deve ser aplicado ao eixo oxidado primeiro.",
  kind: "mechanical_alignment",
  
  // Pré-requisitos
  requires_item: "manivela_bronze",
  requires_item_on_target: "frasco_oleo", // Deve ser usado no eixo antes de encaixar a manivela
  requires_flag: "painel_aberto", // Deve ter removido o painel com a chave de fenda
  
  // Interface do mini-game
  interface: {
    width: 1000,
    height: 700,
    background: "painel_mecanismo.png"
  },
  
  // Peças giratórias
  pieces: [
    {
      id: "disco_central",
      type: "fixed",
      rotation: 0,
      x: 500,
      y: 350,
      description: "Disco central que fornece energia"
    },
    {
      id: "trilha_1",
      type: "rotatable",
      rotation: 0,
      x: 700,
      y: 200,
      connections: { left: "disco_central", right: "trilha_2" },
      description: "Primeira trilha"
    },
    {
      id: "trilha_2",
      type: "rotatable",
      rotation: 0,
      x: 700,
      y: 500,
      connections: { up: "trilha_1", down: "trava_final" },
      description: "Segunda trilha"
    },
    {
      id: "trava_final",
      type: "locked",
      x: 500,
      y: 600,
      description: "Trava da porta"
    }
  ],
  
  // Solução: alinhar as trilhas de modo que a energia flua em linha reta
  // Disco central -> Trilha 1 (girar 45°) -> Trilha 2 (girar -45°) -> Trava
  correct_alignment: {
    "trilha_1": 45,
    "trilha_2": 315
  },
  
  onSuccess: {
    flag: "trava_destrancada",
    message: "Um ruído mecânico profundo reverbera. A porta da torre se abre lentamente.",
    victory: true,
    next_chapter_unlocked: "capitulo_02"
  },
  
  onFailure: {
    message: "As trilhas não alinham. O sistema resiste.",
    penalty: null // Não há limite de tentativas
  }
}
```

---

## 4. Mapeamento de Hotspots da Sala

```javascript
const CHAPTER_01_HOTSPOTS = [
  {
    id: "porta_torre",
    label: "Porta da Torre do Farol",
    x: 45, y: 15, w: 10, h: 20,
    action: {
      type: "message",
      before_unlock: "A trava não cede. Precisa de alguma sequência ou peça que a ative.",
      after_unlock: "A porta está destrancada. A escada em espiral fica visível no topo."
    },
    unlocked_by_flag: "trava_destrancada"
  },
  
  {
    id: "estante_livros",
    label: "Estante de Livros Náuticos",
    x: 10, y: 30, w: 15, h: 40,
    action: {
      type: "scene",
      image: "estante_livros_closeup.png",
      title: "Livros Antigos",
      contains: [
        {
          id: "livro_maré",
          label: "Livro com Símbolo de Maré",
          x: 45, y: 55, w: 15, h: 25,
          action: { type: "clue", for_puzzle: "puzzle_baú_marítimo" }
        }
      ]
    }
  },
  
  {
    id: "mesa_trabalho",
    label: "Mesa de Trabalho",
    x: 35, y: 60, w: 20, h: 20,
    action: {
      type: "scene",
      image: "mesa_trabalho_closeup.png",
      title: "Mesa com Ferramentas",
      contains: [
        {
          id: "pickup_chave_fenda",
          label: "Chave de Fenda Enferrujada",
          x: 30, y: 50, w: 10, h: 15,
          action: { type: "pickup", item: "chave_fenda_enferrujada" }
        },
        {
          id: "pickup_mapa",
          label: "Mapa da Costa",
          x: 70, y: 45, w: 15, h: 20,
          action: { type: "pickup", item: "mapa_costa", clue: "puzzle_baú_marítimo" }
        }
      ]
    }
  },
  
  {
    id: "armário_alto",
    label: "Armário Alto",
    x: 75, y: 40, w: 12, h: 40,
    action: {
      type: "message",
      before_solution: "Há um frasco no topo, mas está fora de alcance. Preciso de algo para subir."
    },
    unlocked_when: "banco_posicionado"
  },
  
  {
    id: "topo_armário",
    label: "Frasco de Óleo no Topo",
    x: 75, y: 40, w: 12, h: 10,
    action: {
      type: "pickup",
      item: "frasco_oleo"
    },
    condition: "banco_posicionado"
  },
  
  {
    id: "baú_marítimo",
    label: "Baú Marítimo Trancado",
    x: 8, y: 75, w: 15, h: 18,
    action: {
      type: "puzzle",
      puzzle_id: "puzzle_baú_marítimo"
    }
  },
  
  {
    id: "painel_solto",
    label: "Painel Solto na Parede",
    x: 85, y: 70, w: 10, h: 15,
    action: {
      type: "message",
      requires_item: "chave_fenda_enferrujada",
      message: "Você usa a chave de fenda para remover o painel."
    },
    sets_flag: "painel_aberto"
  },
  
  {
    id: "mecanismo_trava",
    label: "Mecanismo da Trava (Atrás do Painel)",
    x: 85, y: 70, w: 10, h: 15,
    action: {
      type: "puzzle",
      puzzle_id: "puzzle_trava_rotativa"
    },
    condition: "painel_aberto",
    requires_item: "manivela_bronze"
  },
  
  {
    id: "banco_no_chão",
    label: "Piso Embaixo do Armário Alto",
    x: 75, y: 80, w: 12, h: 8,
    action: {
      type: "drag_place",
      accepts_item: "banquinho_dobravel",
      success_message: "Você coloca o banquinho firme no chão.",
      sets_flag: "banco_posicionado"
    }
  },
  
  {
    id: "rosa_dos_ventos",
    label: "Rosa dos Ventos (Quadro na Parede)",
    x: 50, y: 20, w: 12, h: 15,
    action: {
      type: "clue",
      message: "N ⬆️, L ➡️, S ⬇️, O ⬅️. As direções dos pontos costeiros.",
      for_puzzle: "puzzle_baú_marítimo"
    }
  }
];
```

---

## 5. Tabela de Flags de Estado

| Flag | Valor Inicial | Triggered By | Effect |
|------|---------------|--------------|--------|
| `puzzle_baú_resolvido` | false | Puzzle do baú correto | Baú fica visualmente aberto, libera manivela |
| `banco_posicionado` | false | Arrasto do banco para frente do armário | Permite coletar frasco de óleo, desbloqueio visual |
| `painel_aberto` | false | Usar chave de fenda no painel | Revela mecanismo da trava |
| `trava_destrancada` | false | Puzzle do mecanismo correto | Libera porta da torre, ativa tela de vitória |
| `chapter_01_complete` | false | Trava destancada + porta aberta | Prepara gancho para Capítulo 2 |

---

## 6. Guia de Geração de Imagens com Prompts

### Para o Faroleiro IA (Midjourney, DALL-E, etc.):

**Fundo Principal:**
```
Interior of a lighthouse keeper's cottage after a storm, front view perspective, 
wet wood, bronze circular lock mechanism on central door, scattered furniture, 
dramatic lighting with amber and blue tones, digital painting style, semi-realistic, 
no characters, no UI, 1920x1080px. Include: tall wooden cabinet on right, 
bookshelf on left, work table in center-bottom, old maritime trunk on front-left, 
loose wall panel bottom-right, window with storm visible.
```

**Baú Aberto:**
```
Same lighthouse cottage, same angle, but wooden maritime trunk in foreground is 
now open at 45 degrees, dark interior visible, empty of items, weathered metal 
hinges, bronze lock mechanism, same lighting, same style as background.
```

**Topo do Armário:**
```
Top of tall wooden cabinet interior from above 45-degree angle, glass bottle 
with amber oil, cork stopper, metal ring, clear dust areas indicating where item 
rested, diffuse light from above, lighthouse keeper's cottage aesthetic.
```

**Painel do Mecanismo:**
```
Ornate wooden and bronze panel featuring a mechanical lock system viewed head-on, 
central energy disc with star-shaped metal pathways, three rotatable discs in center, 
clear geometric connection points, weathered bronze, ornamental crank at top waiting 
to be installed, corroded central axle, dramatic lighting emphasizing the connections, 
fantasy/steampunk aesthetic, detailed craftsmanship.
```

---

## 7. Checklist de Implementação

- [ ] Gerar imagem: `casa_farol_principal.png`
- [ ] Gerar imagem: `baú_marítimo_closed.png`
- [ ] Gerar imagem: `baú_marítimo_open.png`
- [ ] Gerar imagem: `armário_alto_vazio.png`
- [ ] Gerar imagem: `painel_mecanismo.png`
- [ ] Gerar sprites: `itens/banquinho_dobravel.png`
- [ ] Gerar sprites: `itens/chave_fenda_enferrujada.png`
- [ ] Gerar sprites: `itens/mapa_costa.png`
- [ ] Gerar sprites: `itens/frasco_oleo.png`
- [ ] Gerar sprites: `itens/manivela_bronze.png`
- [ ] Integrar items em `story.js`
- [ ] Integrar puzzles em `story.js`
- [ ] Integrar hotspots em `story.js`
- [ ] Testar fluxo completo do capítulo
