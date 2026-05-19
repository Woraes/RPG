(function () {
  const STORAGE_KEY = 'misterio.storyState';

  const ITEMS = {
    metal_handle: { id: 'metal_handle', name: 'Haste de Metal', emoji: '🦯' },
    gear_piece: { id: 'gear_piece', name: 'Engrenagem Enferrujada', emoji: '⚙️' },
    crank: { id: 'crank', name: 'Manivela Montada', emoji: '🔧' },
    library_key: { id: 'library_key', name: 'Chave da Biblioteca', emoji: '🔑' },
    hairpin: { id: 'hairpin', name: 'Grampo de Cabelo', emoji: '📌' },
    crowbar: { id: 'crowbar', name: 'Pe de Cabra', emoji: '🔨' },
    water_jar: { id: 'water_jar', name: 'Jarro de Agua', emoji: '🏺' },
    medallion: { id: 'medallion', name: 'Medalhao Antigo', emoji: '🏅' },
    metal_pliers: { id: 'metal_pliers', name: 'Alicate Metalico', emoji: '✂️' },
    safe_button: { id: 'safe_button', name: 'Botao de Cofre', emoji: '⚙️' },
    golden_key: { id: 'golden_key', name: 'Chave de Ouro', emoji: '🗝️' }
  };

  const COMBINATIONS = [
    { itemA: 'metal_handle', itemB: 'gear_piece', result: 'crank' }
  ];

  Object.assign(ITEMS, {
    metal_handle: { id: 'metal_handle', name: 'Haste de Metal', emoji: '[ferro]' },
    gear_piece: { id: 'gear_piece', name: 'Engrenagem Enferrujada', emoji: '[eng]' },
    crank: { id: 'crank', name: 'Manivela Montada', emoji: '[manivela]' },
    library_key: { id: 'library_key', name: 'Chave da Biblioteca', emoji: '[chave]' },
    hairpin: { id: 'hairpin', name: 'Grampo de Cabelo', emoji: '[grampo]' },
    crowbar: { id: 'crowbar', name: 'Pe de Cabra', emoji: '[barra]' },
    water_jar: { id: 'water_jar', name: 'Jarro de Agua', emoji: '[agua]' },
    medallion: { id: 'medallion', name: 'Medalhao Antigo', emoji: '[medalhao]' },
    metal_pliers: { id: 'metal_pliers', name: 'Alicate Metalico', emoji: '[alicate]' },
    safe_button: { id: 'safe_button', name: 'Botao de Cofre', emoji: '[dial]' },
    golden_key: { id: 'golden_key', name: 'Chave de Ouro', emoji: '[ouro]' }
  });

  const ITEM_DESCRIPTIONS = {
    metal_handle: 'Uma haste fria de ferro. Parece metade de uma manivela antiga.',
    gear_piece: 'Engrenagem pesada, ainda com dentes suficientes para funcionar.',
    crank: 'A haste e a engrenagem formam uma manivela firme.',
    library_key: 'Chave de bronze marcada com o brasao da biblioteca.',
    hairpin: 'Grampo fino, bom para pinos pequenos e fechaduras discretas.',
    crowbar: 'Barra de ferro curta. Serve para forcar madeira velha.',
    water_jar: 'Jarro pesado, cheio de agua escura e fria.',
    medallion: 'Medalhao antigo com tres simbolos: rosa, corvo e anel.',
    metal_pliers: 'Alicate de corte, forte o bastante para arame oxidado.',
    safe_button: 'Dial de cofre arrancado de algum mecanismo antigo.',
    golden_key: 'Chave final da mansao. O metal parece quente ao toque.'
  };

  const ITEM_SPRITES = {
    metal_handle: 'hastemetal.png',
    gear_piece: 'engrenagemenferrujada.png',
    crank: 'manivelamontada.png',
    library_key: 'chaveblibioteca.png',
    hairpin: 'grampodecabelo.png',
    crowbar: 'pedecabra.png',
    water_jar: 'jarro.png',
    medallion: 'medalhao.png',
    metal_pliers: 'alicate.png',
    safe_button: 'botaocofre.png',
    golden_key: 'chavedeouro.png'
  };

  const PUZZLES = {
    picked_metal_handle: {
      title: 'Algo preso no assoalho',
      story: 'A poeira cobre um objeto comprido. Limpe as partes certas sem chamar atencao.',
      clue: 'Remova as tres camadas de poeira clara.',
      kind: 'collect',
      pieces: ['Poeira do topo', 'Cinza lateral', 'Limo no encaixe']
    },
    picked_gear_piece: {
      title: 'Engrenagem solta',
      story: 'A engrenagem caiu dentro da caixa do relogio. Os dentes precisam alinhar antes de sair.',
      clue: 'Siga o ritmo do pendulo: esquerda, direita, centro.',
      kind: 'sequence',
      options: ['Esquerda', 'Centro', 'Direita'],
      answer: ['Esquerda', 'Direita', 'Centro']
    },
    picked_hairpin: {
      title: 'Grampo entre velas',
      story: 'O grampo esta escondido entre sombras e cera fria.',
      clue: 'A chama mais fraca revela primeiro, depois a vela quebrada.',
      kind: 'sequence',
      options: ['Vela alta', 'Vela fraca', 'Vela quebrada'],
      answer: ['Vela fraca', 'Vela quebrada']
    },
    picked_water_jar: {
      title: 'Jarro na escrivaninha',
      story: 'Tres recipientes iguais repousam sob livros mofados.',
      clue: 'O jarro util e o unico frio ao toque.',
      kind: 'choice',
      options: ['Jarro rachado', 'Jarro frio', 'Jarro vazio'],
      answer: 'Jarro frio'
    },
    clock_mechanism_open: {
      title: 'Mecanismo do relogio',
      story: 'A manivela encaixa, mas o mecanismo so aceita o giro no compasso correto.',
      clue: 'Marque as horas em que a casa silencia: XII, III, VI, IX.',
      kind: 'sequence',
      options: ['III', 'VI', 'IX', 'XII'],
      answer: ['XII', 'III', 'VI', 'IX']
    },
    portrait_lock_open: {
      title: 'Fechadura no retrato',
      story: 'O grampo toca tres pinos atras da moldura.',
      clue: 'Levante baixo, alto, medio.',
      kind: 'sequence',
      options: ['Pino baixo', 'Pino medio', 'Pino alto'],
      answer: ['Pino baixo', 'Pino alto', 'Pino medio']
    },
    fireplace_done: {
      title: 'Lareira ancestral',
      story: 'A agua nao basta. A grade precisa abrir antes que o medalhao apareca.',
      clue: 'Feche o ar, molhe as brasas, puxe a grade.',
      kind: 'sequence',
      options: ['Molhar brasas', 'Fechar ar', 'Puxar grade'],
      answer: ['Fechar ar', 'Molhar brasas', 'Puxar grade']
    },
    condessa_done: {
      title: 'Retrato da Condessa',
      story: 'O medalhao encaixa, mas os simbolos do brasao ainda estao fora de ordem.',
      clue: 'Familia, luto, juramento.',
      kind: 'sequence',
      options: ['Rosa', 'Corvo', 'Anel'],
      answer: ['Rosa', 'Corvo', 'Anel']
    },
    fountain_done: {
      title: 'Fonte da estatua',
      story: 'Os fios prendem o dreno. Um corte errado sela a grade de novo.',
      clue: 'Corte apenas os fios oxidados: cobre, preto, cobre.',
      kind: 'sequence',
      options: ['Cobre', 'Prata', 'Preto'],
      answer: ['Cobre', 'Preto', 'Cobre']
    },
    safe_open: {
      title: 'Cofre embutido',
      story: 'O botao encaixa no cofre. O diario da casa menciona o ano da queda.',
      clue: 'Ano gravado no rodape do retrato da Condessa.',
      kind: 'code',
      answer: '1847'
    },
    armario_done: {
      title: 'Armario travado',
      story: 'A madeira geme. A fechadura nao abre na forca, apenas no ritmo certo.',
      clue: 'Gire, puxe, segure, solte.',
      kind: 'sequence',
      options: ['Girar', 'Puxar', 'Segurar', 'Soltar'],
      answer: ['Girar', 'Puxar', 'Segurar', 'Soltar']
    },
    hall_stair_done: {
      title: 'Escadaria lateral',
      story: 'Uma placa solta esconde um compartimento no corrimao.',
      clue: 'Pressione pedra clara, depois pedra escura.',
      kind: 'sequence',
      options: ['Pedra clara', 'Pedra escura', 'Pedra rachada'],
      answer: ['Pedra clara', 'Pedra escura']
    }
  };

  let equippedItemId = null;
  let handSlot = null;

  const ROOM_DB = {
    hall: {
      title: 'Hall Principal',
      image: 'assets/images/hall_principal.png',
      goal: 'Explore lareira, armario, retratos e relogio para liberar caminhos.',
      hotspots: [
        { id: 'hall-down-door', label: 'Porta de baixo para Sala de Retratos', x: 47, y: 44, w: 8, h: 10, action: { type: 'goto', room: 'retratos' } },
        { id: 'hall-up-door', label: 'Porta de cima para Biblioteca (trancada)', x: 46, y: 7, w: 8, h: 9, action: { type: 'goto_locked', room: 'biblioteca', item: 'library_key', unlockFlag: 'libraryDoorOpen', successMessage: 'Porta da Biblioteca destrancada.' } },
        { id: 'hall-window', label: 'Janela para Jardim (trancada)', x: 69, y: 62, w: 9, h: 10, action: { type: 'goto_locked', room: 'jardim', item: 'crowbar', unlockFlag: 'gardenWindowOpen', successMessage: 'Janela forcada com Pe de Cabra.' } },
        { id: 'hall-metal', label: 'Algo metalico no chao', x: 13, y: 74, w: 6, h: 7, action: { type: 'pickup', item: 'metal_handle', flag: 'picked_metal_handle' } },
        {
          id: 'hall-clock',
          label: 'Relogio de Pendulo',
          x: 38,
          y: 47,
          w: 8,
          h: 12,
          action: {
            type: 'scene',
            scene: {
              id: 'scene-clock',
              title: 'Cena: Relogio de Pendulo',
              image: 'assets/images/scenes/hall_clock_scene_v2.png',
              fallbackImage: 'assets/images/hall_principal.png',
              hotspots: [
                { label: 'Engrenagem Enferrujada', x: 48, y: 88, w: 12, h: 9, action: { type: 'pickup', item: 'gear_piece', flag: 'picked_gear_piece' } },
                { label: 'Mecanismo do Relogio (trancado)', x: 44, y: 7, w: 18, h: 18, action: { type: 'use_item_reward', requiredItem: 'crank', consume: true, rewardItem: 'library_key', doneFlag: 'clock_mechanism_open', successMessage: 'Relogio aberto. Chave da Biblioteca obtida.' } }
              ]
            }
          }
        },
        {
          id: 'hall-portrait',
          label: 'Retrato Sombrio da parede esquerda',
          x: 8,
          y: 28,
          w: 8,
          h: 10,
          action: {
            type: 'scene',
            scene: {
              id: 'scene-portrait',
              title: 'Cena: Retrato Sombrio',
              image: 'assets/images/scenes/hall_portrait_scene_v2.png',
              fallbackImage: 'assets/images/hall_principal.png',
              hotspots: [
                { label: 'Fechadura escondida', x: 82, y: 76, w: 12, h: 15, action: { type: 'use_item_reward', requiredItem: 'hairpin', consume: true, rewardItem: 'crowbar', doneFlag: 'portrait_lock_open', successMessage: 'Painel secreto abriu. Pe de Cabra encontrado.' } }
              ]
            }
          }
        },
        {
          id: 'hall-fireplace',
          label: 'Lareira ancestral',
          x: 18,
          y: 70,
          w: 8,
          h: 9,
          action: {
            type: 'scene',
            scene: {
              id: 'scene-fireplace',
              title: 'Cena: Lareira em chamas',
              image: 'assets/images/scenes/hall_fireplace_scene_v2.png',
              fallbackImage: 'assets/images/hall_principal.png',
              hotspots: [
                { label: 'Mecanismo da grade da lareira', x: 47, y: 51, w: 12, h: 18, action: { type: 'use_item_reward', requiredItem: 'water_jar', consume: true, rewardItem: 'medallion', doneFlag: 'fireplace_done', successMessage: 'Mecanismo resfriado e aberto. Medalhao Antigo revelado.' } }
              ]
            }
          }
        },
        {
          id: 'hall-armario',
          label: 'Armario antigo',
          x: 77,
          y: 69,
          w: 9,
          h: 14,
          action: {
            type: 'scene',
            scene: {
              id: 'scene-armario',
              title: 'Cena: Armario antigo',
              image: 'assets/images/hall_principal.png',
              fallbackImage: 'assets/images/hall_principal.png',
              hotspots: [
                { label: 'Tranca interna do armario', x: 45, y: 56, w: 12, h: 20, action: { type: 'use_item_reward', requiredItem: 'crowbar', consume: false, rewardItem: 'hairpin', doneFlag: 'armario_done', successMessage: 'Tranca forcada. Um grampo caiu de dentro do armario.' } }
              ]
            }
          }
        },
        {
          id: 'hall-stair',
          label: 'Escadaria lateral',
          x: 60,
          y: 24,
          w: 10,
          h: 12,
          action: {
            type: 'scene',
            scene: {
              id: 'scene-hall-stair',
              title: 'Cena: Escadaria lateral',
              image: 'assets/images/hall_principal.png',
              fallbackImage: 'assets/images/hall_principal.png',
              hotspots: [
                { label: 'Placa solta no corrimao', x: 52, y: 48, w: 14, h: 20, action: { type: 'use_item_reward', requiredItem: 'metal_pliers', consume: false, rewardItem: 'gear_piece', doneFlag: 'hall_stair_done', successMessage: 'Compartimento aberto. Outra engrenagem foi encontrada.' } }
              ]
            }
          }
        }
      ]
    },
    retratos: {
      title: 'Sala de Retratos',
      image: 'assets/images/sala_retratos.png',
      goal: 'Pegue o grampo e resolva o retrato da condessa.',
      hotspots: [
        { id: 'retratos-back-hall', label: 'Porta para Hall Principal', x: 49, y: 52, w: 8, h: 16, action: { type: 'goto', room: 'hall' } },
        { id: 'retratos-hairpin', label: 'Grampo de Cabelo na mesa', x: 79, y: 70, w: 6, h: 8, action: { type: 'pickup', item: 'hairpin', flag: 'picked_hairpin' } },
        {
          id: 'retratos-condessa',
          label: 'Retrato da Condessa',
          x: 79,
          y: 41,
          w: 8,
          h: 14,
          action: {
            type: 'scene',
            scene: {
              id: 'scene-condessa',
              title: 'Cena: Retrato da Condessa',
              image: 'assets/images/scenes/retratos_condessa_scene.png',
              fallbackImage: 'assets/images/sala_retratos.png',
              hotspots: [
                { label: 'Orificio do Medalhao', x: 78, y: 28, w: 10, h: 12, action: { type: 'use_item_reward', requiredItem: 'medallion', consume: true, rewardItem: 'metal_pliers', doneFlag: 'condessa_done', successMessage: 'Moldura abriu. Alicate Metalico encontrado.' } }
              ]
            }
          }
        }
      ]
    },
    jardim: {
      title: 'Jardim Abandonado',
      image: 'assets/images/jardim_abandonado.png',
      goal: 'Drene a fonte para revelar o botao do cofre.',
      hotspots: [
        { id: 'jardim-back-hall', label: 'Voltar ao Hall', x: 76, y: 43, w: 10, h: 15, action: { type: 'goto', room: 'hall' } },
        {
          id: 'jardim-fonte',
          label: 'Fonte da Estatua',
          x: 48,
          y: 56,
          w: 9,
          h: 12,
          action: {
            type: 'scene',
            scene: {
              id: 'scene-fonte',
              title: 'Cena: Fonte da Estatua',
              image: 'assets/images/scenes/jardim_fonte_scene.png',
              fallbackImage: 'assets/images/jardim_abandonado.png',
              hotspots: [
                { label: 'Fios enferrujados', x: 50, y: 58, w: 10, h: 10, action: { type: 'use_item_reward', requiredItem: 'metal_pliers', consume: false, rewardItem: 'safe_button', doneFlag: 'fountain_done', successMessage: 'Fios cortados. Botao de Cofre obtido.' } }
              ]
            }
          }
        }
      ]
    },
    biblioteca: {
      title: 'Biblioteca Sombria',
      image: 'assets/images/biblioteca.png',
      goal: 'Ache o jarro e abra o cofre embutido.',
      hotspots: [
        { id: 'biblioteca-back-hall', label: 'Porta para Hall Principal', x: 3, y: 56, w: 8, h: 15, action: { type: 'goto', room: 'hall' } },
        { id: 'biblioteca-jar', label: 'Jarro de Agua na escrivaninha', x: 64, y: 74, w: 6, h: 8, action: { type: 'pickup', item: 'water_jar', flag: 'picked_water_jar' } },
        {
          id: 'biblioteca-safe',
          label: 'Cofre embutido entre os livros',
          x: 79,
          y: 55,
          w: 7,
          h: 9,
          action: {
            type: 'scene',
            scene: {
              id: 'scene-safe',
              title: 'Cena: Cofre Embutido',
              image: 'assets/images/scenes/biblioteca_safe_scene.png',
              fallbackImage: 'assets/images/biblioteca.png',
              hotspots: [
                { label: 'Entrada do botao de cofre', x: 49, y: 52, w: 10, h: 10, action: { type: 'use_item_reward', requiredItem: 'safe_button', consume: true, rewardItem: 'golden_key', doneFlag: 'safe_open', successMessage: 'Cofre aberto. Chave de Ouro conquistada.' } }
              ]
            }
          }
        }
      ]
    },
    laboratorio: {
      title: 'Laboratorio',
      image: 'assets/images/laboratorio.png',
      goal: 'Sala reservada para historia futura.',
      hotspots: [
        { id: 'lab-map', label: 'Voltar ao mapa', x: 6, y: 8, w: 12, h: 8, action: { type: 'goto_map' } }
      ]
    },
    sotao: {
      title: 'Sotao Misterioso',
      image: 'assets/images/sotao_misterioso.png',
      goal: 'Sala reservada para historia futura.',
      hotspots: [
        { id: 'sotao-map', label: 'Voltar ao mapa', x: 6, y: 8, w: 12, h: 8, action: { type: 'goto_map' } }
      ]
    }
  };

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!parsed || typeof parsed !== 'object') return { inventory: [], flags: {}, currentRoom: 'hall', victory: false };
      return {
        inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
        flags: parsed.flags && typeof parsed.flags === 'object' ? parsed.flags : {},
        currentRoom: parsed.currentRoom || 'hall',
        victory: Boolean(parsed.victory)
      };
    } catch (error) {
      return { inventory: [], flags: {}, currentRoom: 'hall', victory: false };
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function hasItem(state, itemId) {
    return state.inventory.includes(itemId);
  }

  function addItem(state, itemId) {
    if (!ITEMS[itemId]) return;
    if (!hasItem(state, itemId)) state.inventory.push(itemId);
  }

  function removeItem(state, itemId) {
    state.inventory = state.inventory.filter(function (id) { return id !== itemId; });
    if (equippedItemId === itemId) {
      equippedItemId = null;
      updateHandSlot();
    }
  }

  function hasFlag(state, flag) {
    return Boolean(state.flags[flag]);
  }

  function setFlag(state, flag) {
    state.flags[flag] = true;
  }

  function playSfx(type) {
    const audioTag = document.getElementById('fx-audio');
    if (!audioTag) return;
    if (type === 'success') {
      audioTag.src = audioTag.dataset.success || 'assets/audio/destrancar.mp3';
      audioTag.play().catch(function () {});
    }
    if (type === 'locked') {
      audioTag.src = audioTag.dataset.locked || 'assets/audio/somSombrio.mp3';
      audioTag.play().catch(function () {});
    }
    if (type === 'pickup') {
      audioTag.src = audioTag.dataset.pickup || 'assets/audio/ChaveGirando.mp3';
      audioTag.play().catch(function () {});
    }
  }

  const root = document.getElementById('room-root');
  if (!root) return;

  if (!localStorage.getItem('misterio.playerName')) {
    window.location.href = 'login.html';
    return;
  }

  const roomId = root.dataset.room;
  const roomData = ROOM_DB[roomId];
  if (!roomData) return;

  const state = loadState();
  const routeLocks = {
    biblioteca: 'libraryDoorOpen',
    jardim: 'gardenWindowOpen',
    laboratorio: '__future__',
    sotao: '__future__'
  };
  const requiredFlag = routeLocks[roomId];
  if (requiredFlag && !state.flags[requiredFlag]) {
    window.location.href = 'hall.html';
    return;
  }

  state.currentRoom = roomId;
  saveState(state);

  const titleEl = document.getElementById('room-title');
  const goalEl = document.getElementById('room-goal');
  const imageEl = document.getElementById('room-image');
  const panelEl = document.getElementById('room-items');
  const countEl = document.getElementById('room-count');
  const imageWrap = document.querySelector('.scene-image-wrap');
  const scenePanel = document.querySelector('.scene-panel');

  const sceneFrame = document.createElement('div');
  sceneFrame.className = 'scene-frame';
  if (imageWrap && imageEl && imageEl.parentNode === imageWrap) {
    imageWrap.insertBefore(sceneFrame, imageEl);
    sceneFrame.appendChild(imageEl);
  }

  const lanternOverlay = document.createElement('div');
  lanternOverlay.className = 'lantern-overlay';
  sceneFrame.appendChild(lanternOverlay);

  titleEl.textContent = roomData.title;
  goalEl.textContent = roomData.goal;
  imageEl.src = roomData.image;

  const toast = document.createElement('div');
  toast.className = 'story-toast';
  document.body.appendChild(toast);

  const tooltip = document.createElement('div');
  tooltip.className = 'gothic-tooltip';
  tooltip.textContent = 'Passe o mouse pela cena e descubra pontos ocultos.';
  document.body.appendChild(tooltip);

  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = [
    '<div class="hud-info">',
    '<p class="hud-title" id="hud-room-title"></p>',
    '<p class="hud-subtitle" id="hud-room-goal"></p>',
    '</div>',
    '<div class="hud-actions">',
    '<a class="hud-btn" href="mapa.html">Mapa</a>',
    '<button class="hud-btn" id="hud-toggle-inventory" type="button">Inventario</button>',
    '<span class="hud-clock" id="hud-clock">00:00</span>',
    '</div>'
  ].join('');
  document.body.appendChild(hud);

  const hudTitle = document.getElementById('hud-room-title');
  const hudGoal = document.getElementById('hud-room-goal');
  if (hudTitle) hudTitle.textContent = roomData.title;
  if (hudGoal) hudGoal.textContent = roomData.goal;

  const clockNode = document.getElementById('hud-clock');
  function tickClock() {
    if (!clockNode) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    clockNode.textContent = hh + ':' + mm;
  }
  tickClock();
  setInterval(tickClock, 1000);

  const toggleInventoryBtn = document.getElementById('hud-toggle-inventory');
  const inventoryOverlay = document.createElement('div');
  inventoryOverlay.className = 'inventory-overlay hidden';
  inventoryOverlay.innerHTML = [
    '<div class="inventory-shell">',
    '<button id="inventory-close" class="inventory-close" type="button">Fechar</button>',
    '</div>'
  ].join('');

  const inventoryShell = inventoryOverlay.querySelector('.inventory-shell');
  if (scenePanel && inventoryShell) inventoryShell.appendChild(scenePanel);
  document.body.appendChild(inventoryOverlay);

  function openInventory() {
    inventoryOverlay.classList.remove('hidden');
    document.body.classList.add('inventory-open');
  }

  function closeInventory() {
    inventoryOverlay.classList.add('hidden');
    document.body.classList.remove('inventory-open');
  }

  function toggleInventory() {
    if (document.body.classList.contains('inventory-open')) {
      closeInventory();
      return;
    }
    openInventory();
  }

  if (toggleInventoryBtn) {
    toggleInventoryBtn.addEventListener('click', toggleInventory);
  }

  const inventoryClose = document.getElementById('inventory-close');
  if (inventoryClose) inventoryClose.addEventListener('click', closeInventory);
  inventoryOverlay.addEventListener('click', function (event) {
    if (event.target === inventoryOverlay) closeInventory();
  });

  handSlot = document.createElement('button');
  handSlot.type = 'button';
  handSlot.className = 'hand-slot';
  handSlot.addEventListener('click', openInventory);
  document.body.appendChild(handSlot);

  function updateHandSlot() {
    if (!handSlot) return;
    const item = equippedItemId ? ITEMS[equippedItemId] : null;
    handSlot.innerHTML = item
      ? (ITEM_SPRITES[item.id]
        ? '<img class="hand-sprite" src="assets/images/itens/' + ITEM_SPRITES[item.id] + '" alt="' + item.name + '"><span class="hand-text">Mao: ' + item.name + '</span>'
        : '<span class="hand-emoji">' + item.emoji + '</span><span class="hand-text">Mao: ' + item.name + '</span>')
      : '<span class="hand-text">Mao vazia</span>';
  }
  updateHandSlot();

  const hotspotsLayer = document.createElement('div');
  hotspotsLayer.className = 'hotspots-layer';
  sceneFrame.appendChild(hotspotsLayer);

  const itemLayer = document.createElement('div');
  itemLayer.className = 'scene-items-layer';
  sceneFrame.appendChild(itemLayer);

  function syncMainHotspotBounds() {
    const wrapRect = sceneFrame.getBoundingClientRect();
    const imgRect = imageEl.getBoundingClientRect();
    [hotspotsLayer, itemLayer].forEach(function (layer) {
      layer.style.left = (imgRect.left - wrapRect.left) + 'px';
      layer.style.top = (imgRect.top - wrapRect.top) + 'px';
      layer.style.width = imgRect.width + 'px';
      layer.style.height = imgRect.height + 'px';
    });
  }

  function setLanternPosition(targetRect, clientX, clientY, targetOverlay) {
    if (!targetRect || !targetOverlay) return;
    const x = Math.max(0, Math.min(targetRect.width, clientX - targetRect.left));
    const y = Math.max(0, Math.min(targetRect.height, clientY - targetRect.top));
    targetOverlay.style.setProperty('--lantern-x', x + 'px');
    targetOverlay.style.setProperty('--lantern-y', y + 'px');
  }

  function centerLantern(targetRect, targetOverlay) {
    if (!targetRect || !targetOverlay) return;
    targetOverlay.style.setProperty('--lantern-x', (targetRect.width * 0.5) + 'px');
    targetOverlay.style.setProperty('--lantern-y', (targetRect.height * 0.5) + 'px');
  }

  const sceneOverlay = document.createElement('div');
  sceneOverlay.className = 'puzzle-scene-overlay hidden';
  sceneOverlay.innerHTML = [
    '<div class="puzzle-scene-shell">',
    '<button id="scene-exit" class="scene-exit" type="button">Fechar Cena</button>',
    '<h3 id="scene-title" class="scene-title"></h3>',
    '<div id="scene-stage" class="scene-stage">',
    '<img id="scene-image" class="scene-image-full" alt="Cena de puzzle">',
    '<div id="scene-lantern" class="lantern-overlay"></div>',
    '<div class="scene-dust-overlay" aria-hidden="true"></div>',
    '<div id="scene-items" class="scene-items-layer"></div>',
    '<div id="scene-hotspots" class="scene-hotspots"></div>',
    '</div>',
    '</div>'
  ].join('');
  document.body.appendChild(sceneOverlay);

  const challengeOverlay = document.createElement('div');
  challengeOverlay.className = 'challenge-overlay hidden';
  challengeOverlay.innerHTML = [
    '<div class="challenge-card">',
    '<button id="challenge-close" class="challenge-close" type="button">Fechar</button>',
    '<p class="eyebrow">Puzzle de investigacao</p>',
    '<h2 id="challenge-title"></h2>',
    '<p id="challenge-story" class="challenge-story"></p>',
    '<p id="challenge-clue" class="challenge-clue"></p>',
    '<div id="challenge-body" class="challenge-body"></div>',
    '<p id="challenge-progress" class="challenge-progress"></p>',
    '</div>'
  ].join('');
  document.body.appendChild(challengeOverlay);

  const victoryOverlay = document.createElement('div');
  victoryOverlay.className = 'victory-overlay hidden';
  victoryOverlay.innerHTML = [
    '<div class="victory-card">',
    '<p class="eyebrow">Misterio Resolvido</p>',
    '<h2>Chave de Ouro obtida</h2>',
    '<p>Parabens. Cadeia principal completa. Novos capitulos podem iniciar daqui.</p>',
    '<a class="scene-link" href="mapa.html">Voltar ao mapa</a>',
    '</div>'
  ].join('');
  document.body.appendChild(victoryOverlay);

  let forgeA = null;
  let forgeB = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2500);
  }

  function updateTooltip(text) {
    tooltip.textContent = text;
  }

  function routeTo(room) {
    const routes = {
      hall: 'hall.html',
      retratos: 'sala-retratos.html',
      biblioteca: 'biblioteca.html',
      jardim: 'jardim.html',
      laboratorio: 'laboratorio.html',
      sotao: 'sotao.html'
    };
    if (!routes[room]) return;
    state.currentRoom = room;
    saveState(state);
    window.location.href = routes[room];
  }

  function getPuzzleForAction(action) {
    if (!action) return null;
    const key = action.flag || action.doneFlag || action.rewardItem || action.item;
    if (key && PUZZLES[key]) return PUZZLES[key];
    if (action.type === 'pickup' && ITEMS[action.item]) {
      return {
        title: 'Pista escondida',
        story: 'O objeto esta camuflado na cena. Observe os detalhes antes de recolher.',
        clue: 'Revele as tres marcas de poeira ao redor do item.',
        kind: 'collect',
        pieces: ['Marca esquerda', 'Marca central', 'Marca direita']
      };
    }
    if (action.type === 'use_item_reward') {
      return {
        title: 'Mecanismo antigo',
        story: 'O item certo encaixa, mas a casa ainda exige um ultimo gesto.',
        clue: 'Teste a ordem: observar, encaixar, puxar.',
        kind: 'sequence',
        options: ['Observar', 'Puxar', 'Encaixar'],
        answer: ['Observar', 'Encaixar', 'Puxar']
      };
    }
    return null;
  }

  function solveChallenge(onSolved) {
    challengeOverlay.classList.add('hidden');
    playSfx('success');
    showToast('Puzzle resolvido.');
    if (typeof onSolved === 'function') onSolved();
  }

  function markChallengeMistake(message) {
    const card = challengeOverlay.querySelector('.challenge-card');
    const progress = document.getElementById('challenge-progress');
    if (progress) progress.textContent = message || 'A casa range. Tente outra ordem.';
    if (!card) return;
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
    playSfx('locked');
  }

  function openChallenge(puzzle, onSolved) {
    const title = document.getElementById('challenge-title');
    const story = document.getElementById('challenge-story');
    const clue = document.getElementById('challenge-clue');
    const body = document.getElementById('challenge-body');
    const progress = document.getElementById('challenge-progress');
    const card = challengeOverlay.querySelector('.challenge-card');
    if (!title || !story || !clue || !body || !progress || !puzzle) {
      if (typeof onSolved === 'function') onSolved();
      return;
    }

    if (card) card.className = 'challenge-card puzzle-' + puzzle.kind;
    title.textContent = puzzle.title;
    story.textContent = puzzle.story;
    clue.textContent = puzzle.clue || '';
    progress.textContent = '';
    body.innerHTML = '';
    body.className = 'challenge-body puzzle-body-' + puzzle.kind;

    if (puzzle.kind === 'sequence') {
      let step = 0;
      const rail = document.createElement('div');
      rail.className = 'sequence-rail';
      puzzle.answer.forEach(function (_entry, index) {
        const node = document.createElement('span');
        node.className = 'sequence-node';
        node.textContent = String(index + 1);
        rail.appendChild(node);
      });
      body.appendChild(rail);

      const controls = document.createElement('div');
      controls.className = 'sequence-controls';
      progress.textContent = 'Sequencia: 0/' + puzzle.answer.length;
      puzzle.options.forEach(function (option) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'challenge-option';
        button.textContent = option;
        button.addEventListener('click', function () {
          if (option !== puzzle.answer[step]) {
            step = 0;
            body.querySelectorAll('.challenge-option').forEach(function (node) {
              node.classList.remove('selected');
            });
            body.querySelectorAll('.sequence-node').forEach(function (node) {
              node.classList.remove('done');
            });
            markChallengeMistake('Ordem quebrada. Recomece a sequencia.');
            progress.textContent = 'Sequencia: 0/' + puzzle.answer.length;
            return;
          }
          button.classList.add('selected');
          const node = body.querySelectorAll('.sequence-node')[step];
          if (node) node.classList.add('done');
          step++;
          progress.textContent = 'Sequencia: ' + step + '/' + puzzle.answer.length;
          if (step >= puzzle.answer.length) solveChallenge(onSolved);
        });
        controls.appendChild(button);
      });
      body.appendChild(controls);
    }

    if (puzzle.kind === 'choice') {
      const choiceGrid = document.createElement('div');
      choiceGrid.className = 'choice-grid';
      puzzle.options.forEach(function (option) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'challenge-option';
        button.textContent = option;
        button.addEventListener('click', function () {
          if (option !== puzzle.answer) {
            markChallengeMistake('Escolha errada. A pista continua escondida.');
            return;
          }
          button.classList.add('selected');
          solveChallenge(onSolved);
        });
        choiceGrid.appendChild(button);
      });
      body.appendChild(choiceGrid);
    }

    if (puzzle.kind === 'collect') {
      const collected = new Set();
      const board = document.createElement('div');
      board.className = 'dust-board';
      progress.textContent = 'Vestigios: 0/' + puzzle.pieces.length;
      puzzle.pieces.forEach(function (piece) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'challenge-option dust-piece';
        button.textContent = piece;
        button.addEventListener('click', function () {
          if (collected.has(piece)) return;
          collected.add(piece);
          button.classList.add('selected');
          progress.textContent = 'Vestigios: ' + collected.size + '/' + puzzle.pieces.length;
          if (collected.size >= puzzle.pieces.length) solveChallenge(onSolved);
        });
        board.appendChild(button);
      });
      body.appendChild(board);
    }

    if (puzzle.kind === 'code') {
      const safeFace = document.createElement('div');
      safeFace.className = 'safe-face';

      const input = document.createElement('input');
      input.className = 'challenge-code';
      input.inputMode = 'numeric';
      input.maxLength = 8;
      input.placeholder = 'Codigo';
      safeFace.appendChild(input);

      const keypad = document.createElement('div');
      keypad.className = 'keypad';
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].forEach(function (digit) {
        const key = document.createElement('button');
        key.type = 'button';
        key.className = 'keypad-key';
        key.textContent = digit;
        key.addEventListener('click', function () {
          input.value = (input.value + digit).slice(0, input.maxLength);
        });
        keypad.appendChild(key);
      });

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'challenge-submit';
      button.textContent = 'Testar codigo';

      function checkCode() {
        if ((input.value || '').trim() !== puzzle.answer) {
          markChallengeMistake('Codigo recusado.');
          input.select();
          return;
        }
        solveChallenge(onSolved);
      }

      button.addEventListener('click', checkCode);
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') checkCode();
      });
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'challenge-submit secondary';
      clear.textContent = 'Limpar';
      clear.addEventListener('click', function () {
        input.value = '';
        input.focus();
      });
      safeFace.appendChild(keypad);
      safeFace.appendChild(button);
      safeFace.appendChild(clear);
      body.appendChild(safeFace);
      setTimeout(function () { input.focus(); }, 80);
    }

    challengeOverlay.classList.remove('hidden');
  }

  function finishPickup(action, rerenderScene) {
    addItem(state, action.item);
    if (action.flag) setFlag(state, action.flag);
    saveState(state);
    playSfx('pickup');
    showToast('Item coletado: ' + ITEMS[action.item].emoji + ' ' + ITEMS[action.item].name);
    renderAll();
    if (rerenderScene) rerenderScene();
  }

  function finishUseItemReward(action, rerenderScene) {
    if (action.consume) removeItem(state, action.requiredItem);
    addItem(state, action.rewardItem);
    if (action.doneFlag) setFlag(state, action.doneFlag);
    saveState(state);
    playSfx('success');
    showToast(action.successMessage || 'Puzzle resolvido.');

    if (action.rewardItem === 'golden_key') {
      state.victory = true;
      saveState(state);
      victoryOverlay.classList.remove('hidden');
      victoryOverlay.classList.add('show');
    }

    renderAll();
    if (rerenderScene) rerenderScene();
  }

  function handleAction(action, rerenderScene, providedItemId) {
    if (!action || !action.type) return;

    if (action.type === 'goto') {
      routeTo(action.room);
      return;
    }

    if (action.type === 'goto_map') {
      window.location.href = 'mapa.html';
      return;
    }

    if (action.type === 'goto_locked') {
      if (!hasFlag(state, action.unlockFlag)) {
        const itemInUse = providedItemId || equippedItemId || null;
        if (itemInUse && itemInUse !== action.item) {
          playSfx('locked');
          showToast('Item errado. Requer: ' + ITEMS[action.item].name + '.');
          return;
        }
        if (!hasItem(state, action.item)) {
          playSfx('locked');
          showToast('Trancado. Requer: ' + ITEMS[action.item].name + '.');
          return;
        }
        removeItem(state, action.item);
        setFlag(state, action.unlockFlag);
        playSfx('success');
        showToast(action.successMessage || 'Porta destrancada.');
      }
      saveState(state);
      renderPanel();
      routeTo(action.room);
      return;
    }

    if (action.type === 'pickup') {
      if (action.flag && hasFlag(state, action.flag)) {
        showToast('Esse item ja foi coletado.');
        return;
      }
      openChallenge(getPuzzleForAction(action), function () {
        finishPickup(action, rerenderScene);
      });
      return;
    }

    if (action.type === 'scene') {
      openScene(action.scene);
      return;
    }

    if (action.type === 'use_item_reward') {
      if (action.doneFlag && hasFlag(state, action.doneFlag)) {
        showToast('Esse mecanismo ja foi resolvido.');
        return;
      }
      const itemInUse = providedItemId || equippedItemId || null;
      if (itemInUse && itemInUse !== action.requiredItem) {
        playSfx('locked');
        showToast('Item errado. Requer: ' + ITEMS[action.requiredItem].name + '.');
        return;
      }
      if (!hasItem(state, action.requiredItem)) {
        playSfx('locked');
        showToast('Requer: ' + ITEMS[action.requiredItem].name + '.');
        return;
      }
      openChallenge(getPuzzleForAction(action), function () {
        finishUseItemReward(action, rerenderScene);
      });
    }
  }

  function buildMainHotspot(hotspot) {
    const button = document.createElement('button');
    const actionType = hotspot.action.type;
    const hintClass = actionType === 'pickup' ? 'hint-pickup' : (actionType === 'scene' ? 'hint-scene' : 'hint-lock');
    button.type = 'button';
    button.className = 'scene-hotspot invisible-hotspot ' + hintClass;
    button.style.left = hotspot.x + '%';
    button.style.top = hotspot.y + '%';
    button.style.width = hotspot.w + '%';
    button.style.height = hotspot.h + '%';
    button.setAttribute('aria-label', hotspot.label);

    button.addEventListener('mouseenter', function () {
      updateTooltip(hotspot.label);
    });
    button.addEventListener('mouseleave', function () {
      updateTooltip('Passe o mouse pela cena e descubra pontos ocultos.');
    });
    button.addEventListener('click', function () {
      handleAction(hotspot.action);
    });

    if (hotspot.action.type === 'goto_locked' || hotspot.action.type === 'use_item_reward') {
      button.addEventListener('dragover', function (event) {
        event.preventDefault();
      });
      button.addEventListener('drop', function (event) {
        event.preventDefault();
        const droppedItem = event.dataTransfer.getData('text/plain');
        if (!droppedItem) return;
        handleAction(hotspot.action, null, droppedItem);
      });
    }

    return button;
  }

  function buildVisibleItem(hotspot) {
      if (!hotspot || !hotspot.action || hotspot.action.type !== 'pickup') return null;
      const item = ITEMS[hotspot.action.item];
      if (!item) return null;
      const prop = document.createElement('span');
      prop.className = 'scene-item-prop item-' + item.id;
      prop.style.left = (hotspot.x + hotspot.w / 2) + '%';
      prop.style.top = (hotspot.y + hotspot.h / 2) + '%';
      prop.setAttribute('aria-hidden', 'true');
      prop.innerHTML = '<img class="item-sprite" src="assets/images/itens/' + (ITEM_SPRITES[item.id] || (item.id + '.png')) + '" alt="' + item.name + '"><span class="item-nameplate">' + item.name + '</span>';
      return prop;
  }

  function renderMainItems() {
    itemLayer.innerHTML = '';
    roomData.hotspots.forEach(function (hotspot) {
      if (hotspot.action.type !== 'pickup') return;
      if (hotspot.action.flag && hasFlag(state, hotspot.action.flag)) return;
      const prop = buildVisibleItem(hotspot);
      if (prop) itemLayer.appendChild(prop);
    });
  }

  function renderMainHotspots() {
    hotspotsLayer.innerHTML = '';
    roomData.hotspots.forEach(function (hotspot) {
      if (hotspot.action.type === 'pickup' && hotspot.action.flag && hasFlag(state, hotspot.action.flag)) return;
      hotspotsLayer.appendChild(buildMainHotspot(hotspot));
    });
    renderMainItems();
    syncMainHotspotBounds();
  }

  function createForgeSlot(slotName, selectedItem) {
    const slot = document.createElement('div');
    slot.className = 'forge-slot' + (selectedItem ? ' filled' : '');
    slot.addEventListener('dragover', function (event) { event.preventDefault(); });
    slot.addEventListener('drop', function (event) {
      event.preventDefault();
      const id = event.dataTransfer.getData('text/plain');
      if (!id || !hasItem(state, id)) return;
      if (slotName === 'A') forgeA = id;
      if (slotName === 'B') forgeB = id;
      renderPanel();
    });
    slot.innerHTML = selectedItem
      ? '<span class="slot-icon item-' + selectedItem + '"></span><span class="slot-name">' + ITEMS[selectedItem].name + '</span>'
      : '<span class="forge-empty">+</span>';
    return slot;
  }

  function craftItems() {
    if (!forgeA || !forgeB) {
      showToast('Arraste dois itens para a forja.');
      return;
    }

    const combo = COMBINATIONS.find(function (entry) {
      return (entry.itemA === forgeA && entry.itemB === forgeB) || (entry.itemA === forgeB && entry.itemB === forgeA);
    });

    if (!combo) {
      showToast('Combinacao invalida.');
      return;
    }

    removeItem(state, forgeA);
    removeItem(state, forgeB);
    addItem(state, combo.result);
    saveState(state);
    forgeA = null;
    forgeB = null;
    playSfx('success');
    showToast('Forja concluida: ' + ITEMS[combo.result].name + '.');
    renderAll();
  }

  function renderPanel() {
    panelEl.innerHTML = '';

    const selectedItem = equippedItemId ? ITEMS[equippedItemId] : null;
    const menu = document.createElement('section');
    menu.className = 'inventory-menu';
    menu.innerHTML = [
      '<div class="inventory-titlebar">',
      '<div><p class="eyebrow">Arquivo pessoal</p><h2>Inventario</h2></div>',
      '<span class="inventory-capacity">' + state.inventory.length + '/11</span>',
      '</div>'
    ].join('');

    const layout = document.createElement('div');
    layout.className = 'inventory-layout';

    const grid = document.createElement('div');
    grid.className = 're-grid';
    const slots = Math.max(12, state.inventory.length);
    const combinableItems = {};
    COMBINATIONS.forEach(function (combo) {
      combinableItems[combo.itemA] = true;
      combinableItems[combo.itemB] = true;
    });
    for (let i = 0; i < slots; i++) {
      const itemId = state.inventory[i];
      const item = itemId ? ITEMS[itemId] : null;
      const slot = document.createElement(item ? 'button' : 'div');
      slot.className = 're-slot' + (item ? ' filled' : '') + (equippedItemId === itemId ? ' active' : '');
      if (item) {
        slot.type = 'button';
        slot.draggable = true;
        const sprite = ITEM_SPRITES[item.id]
          ? '<img class="slot-sprite" src="assets/images/itens/' + ITEM_SPRITES[item.id] + '" alt="' + item.name + '">'
          : '<span class="slot-icon item-' + item.id + '"></span>';
        const combineMark = combinableItems[item.id] ? '<span class="combine-mark" title="Item combinavel">&#9881;</span>' : '';
        slot.innerHTML = sprite + '<span class="slot-name">' + item.name + '</span>' + combineMark;
        slot.addEventListener('click', function () {
          equippedItemId = itemId;
          updateHandSlot();
          renderPanel();
        });
        slot.addEventListener('dragstart', function (event) {
          event.dataTransfer.setData('text/plain', itemId);
          equippedItemId = itemId;
          updateHandSlot();
        });
      } else {
        slot.innerHTML = '<span class="empty-slot">Vazio</span>';
      }
      grid.appendChild(slot);
    }

    const detail = document.createElement('aside');
    detail.className = 'item-detail';
    detail.innerHTML = selectedItem
      ? ((ITEM_SPRITES[selectedItem.id]
        ? '<img class="detail-sprite" src="assets/images/itens/' + ITEM_SPRITES[selectedItem.id] + '" alt="' + selectedItem.name + '">' 
        : '<div class="detail-icon item-' + selectedItem.id + '"></div>') + '<h3>' + selectedItem.name + '</h3><p>' + (ITEM_DESCRIPTIONS[selectedItem.id] || 'Item coletado durante a investigacao.') + '</p><p class="detail-hint">Arraste este item para um mecanismo ou para a mesa de combinacao.</p>')
      : '<div class="detail-icon empty"></div><h3>Nenhum item equipado</h3><p>Selecione um item da grade para examinar, equipar ou combinar.</p><p class="detail-hint">Itens coletados no cenario aparecem aqui como em um menu classico de survival horror.</p>';

    const forge = document.createElement('section');
    forge.className = 'combine-panel';
    forge.innerHTML = '<h3>Mesa de combinacao</h3><p>Arraste dois itens para testar uma combinacao.</p>';

    const wrap = document.createElement('div');
    wrap.className = 'forge-wrap';
    wrap.appendChild(createForgeSlot('A', forgeA));
    wrap.appendChild(createForgeSlot('B', forgeB));

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'forge-button';
    btn.textContent = 'Combinar';
    btn.addEventListener('click', craftItems);

    forge.appendChild(wrap);
    forge.appendChild(btn);
    detail.appendChild(forge);
    layout.appendChild(grid);
    layout.appendChild(detail);
    menu.appendChild(layout);

    const notes = document.createElement('section');
    notes.className = 'investigation-notes';
    notes.innerHTML = '<h3>Notas</h3><p>Objetos aparecem no cenario. Hotspots de mecanismos continuam escondidos: investigue pela lanterna e pelo contexto da sala.</p>';
    menu.appendChild(notes);

    panelEl.appendChild(menu);

    countEl.textContent = state.inventory.length + '/11';
  }

  function openScene(sceneData) {
    const title = document.getElementById('scene-title');
    const stageImage = document.getElementById('scene-image');
    const stageHotspots = document.getElementById('scene-hotspots');
    const stageItems = document.getElementById('scene-items');
    const stageLantern = document.getElementById('scene-lantern');
    const stage = document.getElementById('scene-stage');
    if (!title || !stageImage || !stageHotspots || !stageItems) return;

    function syncSceneHotspotBounds() {
      if (!stage) return;
      const stageRect = stage.getBoundingClientRect();
      const imgRect = stageImage.getBoundingClientRect();
      [stageHotspots, stageItems].forEach(function (layer) {
        layer.style.left = (imgRect.left - stageRect.left) + 'px';
        layer.style.top = (imgRect.top - stageRect.top) + 'px';
        layer.style.width = imgRect.width + 'px';
        layer.style.height = imgRect.height + 'px';
      });
    }

    function buildStage() {
      stageHotspots.innerHTML = '';
      stageItems.innerHTML = '';
      sceneData.hotspots.forEach(function (hotspot) {
        if (hotspot.action.type === 'pickup' && hotspot.action.flag && hasFlag(state, hotspot.action.flag)) return;
        if (hotspot.action.type === 'use_item_reward' && hotspot.action.doneFlag && hasFlag(state, hotspot.action.doneFlag)) return;

        const button = document.createElement('button');
        const actionType = hotspot.action.type;
        const hintClass = actionType === 'pickup' ? 'hint-pickup' : 'hint-lock';
        button.type = 'button';
        button.className = 'closeup-hotspot invisible-hotspot ' + hintClass;
        button.style.left = hotspot.x + '%';
        button.style.top = hotspot.y + '%';
        button.style.width = hotspot.w + '%';
        button.style.height = hotspot.h + '%';
        button.setAttribute('aria-label', hotspot.label);

        button.addEventListener('mouseenter', function () { updateTooltip(hotspot.label); });
        button.addEventListener('mouseleave', function () { updateTooltip('Passe o mouse pela cena e descubra pontos ocultos.'); });
        button.addEventListener('click', function () {
          handleAction(hotspot.action, buildStage);
        });

        if (hotspot.action.type === 'use_item_reward') {
          button.addEventListener('dragover', function (event) {
            event.preventDefault();
          });
          button.addEventListener('drop', function (event) {
            event.preventDefault();
            const droppedItem = event.dataTransfer.getData('text/plain');
            if (!droppedItem) return;
            handleAction(hotspot.action, buildStage, droppedItem);
          });
        }

        stageHotspots.appendChild(button);
        if (hotspot.action.type === 'pickup') {
          const prop = buildVisibleItem(hotspot);
          if (prop) stageItems.appendChild(prop);
        } else if (hotspot.action.type === 'use_item_reward') {
          const marker = document.createElement('span');
          marker.className = 'scene-mech-mark';
          marker.style.left = (hotspot.x + hotspot.w / 2) + '%';
          marker.style.top = (hotspot.y + hotspot.h / 2) + '%';
          marker.setAttribute('aria-hidden', 'true');
          marker.textContent = 'M';
          stageItems.appendChild(marker);
        }
      });
      syncSceneHotspotBounds();
    }

    title.textContent = sceneData.title;
    if (stage) stage.style.overflow = 'auto';
    stageImage.style.objectFit = 'contain';
    stageImage.style.maxWidth = '100%';
    stageImage.style.maxHeight = 'calc(100dvh - 180px)';

    stageImage.onerror = function () {
      stageImage.src = sceneData.fallbackImage || roomData.image;
      showToast('Cena dedicada nao encontrada ainda. Usando fallback temporario.');
    };
    stageImage.onload = function () {
      syncSceneHotspotBounds();
      if (stageLantern) centerLantern(stage.getBoundingClientRect(), stageLantern);
    };
    stageImage.src = sceneData.image;
    buildStage();

    if (stage && stageLantern) {
      stage.onmousemove = function (event) {
        setLanternPosition(stage.getBoundingClientRect(), event.clientX, event.clientY, stageLantern);
      };
      stage.ontouchmove = function (event) {
        if (!event.touches || !event.touches[0]) return;
        setLanternPosition(stage.getBoundingClientRect(), event.touches[0].clientX, event.touches[0].clientY, stageLantern);
      };
    }

    sceneOverlay.classList.remove('hidden');
  }

  function renderAll() {
    renderMainHotspots();
    renderPanel();
    if (state.victory || hasItem(state, 'golden_key')) {
      victoryOverlay.classList.remove('hidden');
      victoryOverlay.classList.add('show');
    }
  }

  sceneOverlay.addEventListener('click', function (event) {
    if (event.target === sceneOverlay) sceneOverlay.classList.add('hidden');
  });

  challengeOverlay.addEventListener('click', function (event) {
    if (event.target === challengeOverlay) challengeOverlay.classList.add('hidden');
  });

  const challengeClose = document.getElementById('challenge-close');
  if (challengeClose) {
    challengeClose.addEventListener('click', function () {
      challengeOverlay.classList.add('hidden');
    });
  }

  const sceneExit = document.getElementById('scene-exit');
  if (sceneExit) {
    sceneExit.addEventListener('click', function () {
      sceneOverlay.classList.add('hidden');
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key.toLowerCase() === 'i') {
      toggleInventory();
    }
    if (event.key === 'Escape' && document.body.classList.contains('inventory-open')) {
      closeInventory();
    }
    if (event.key === 'Escape' && !challengeOverlay.classList.contains('hidden')) {
      challengeOverlay.classList.add('hidden');
    }
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'h') {
      document.body.classList.toggle('debug-hotspots');
      showToast(document.body.classList.contains('debug-hotspots') ? 'Debug hotspots: ON' : 'Debug hotspots: OFF');
    }
  });

  imageEl.addEventListener('load', function () {
    syncMainHotspotBounds();
    centerLantern(sceneFrame.getBoundingClientRect(), lanternOverlay);
  });

  imageWrap.addEventListener('mousemove', function (event) {
    setLanternPosition(sceneFrame.getBoundingClientRect(), event.clientX, event.clientY, lanternOverlay);
  });

  imageWrap.addEventListener('touchmove', function (event) {
    if (!event.touches || !event.touches[0]) return;
    setLanternPosition(sceneFrame.getBoundingClientRect(), event.touches[0].clientX, event.touches[0].clientY, lanternOverlay);
  }, { passive: true });

  window.addEventListener('resize', function () {
    syncMainHotspotBounds();
    centerLantern(sceneFrame.getBoundingClientRect(), lanternOverlay);
  });

  window.addEventListener('orientationchange', function () {
    setTimeout(function () {
      syncMainHotspotBounds();
      centerLantern(sceneFrame.getBoundingClientRect(), lanternOverlay);
    }, 120);
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', function () {
      syncMainHotspotBounds();
      centerLantern(sceneFrame.getBoundingClientRect(), lanternOverlay);
    });
  }

  renderAll();
})();
