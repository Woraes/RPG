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

  const ROOM_DB = {
    hall: {
      title: 'Hall Principal',
      image: 'assets/images/hall_principal.png',
      goal: 'Explore lareira, retratos e relogio para liberar caminhos.',
      hotspots: [
        { id: 'hall-down-door', label: 'Porta de baixo para Sala de Retratos', x: 55, y: 46, w: 7, h: 11, action: { type: 'goto', room: 'retratos' } },
        { id: 'hall-up-door', label: 'Porta de cima para Biblioteca (trancada)', x: 28, y: 22, w: 7, h: 11, action: { type: 'goto_locked', room: 'biblioteca', item: 'library_key', unlockFlag: 'libraryDoorOpen', successMessage: 'Porta da Biblioteca destrancada.' } },
        { id: 'hall-window', label: 'Janela para Jardim (trancada)', x: 79, y: 37, w: 8, h: 12, action: { type: 'goto_locked', room: 'jardim', item: 'crowbar', unlockFlag: 'gardenWindowOpen', successMessage: 'Janela forcada com Pe de Cabra.' } },
        { id: 'hall-metal', label: 'Algo metalico no chao', x: 35, y: 66, w: 5, h: 7, action: { type: 'pickup', item: 'metal_handle', flag: 'picked_metal_handle' } },
        {
          id: 'hall-clock',
          label: 'Relogio de Pendulo',
          x: 43,
          y: 49,
          w: 7,
          h: 16,
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
          x: 12,
          y: 40,
          w: 8,
          h: 12,
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
          x: 83,
          y: 78,
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
    if (type === 'success' && audioTag.dataset.success) {
      audioTag.src = audioTag.dataset.success;
      audioTag.play().catch(function () {});
    }
    if (type === 'locked' && audioTag.dataset.locked) {
      audioTag.src = audioTag.dataset.locked;
      audioTag.play().catch(function () {});
    }
    if (type === 'pickup' && audioTag.dataset.pickup) {
      audioTag.src = audioTag.dataset.pickup;
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
  state.currentRoom = roomId;
  saveState(state);

  const titleEl = document.getElementById('room-title');
  const goalEl = document.getElementById('room-goal');
  const imageEl = document.getElementById('room-image');
  const panelEl = document.getElementById('room-items');
  const countEl = document.getElementById('room-count');
  const imageWrap = document.querySelector('.scene-image-wrap');

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
  if (toggleInventoryBtn) {
    toggleInventoryBtn.addEventListener('click', function () {
      document.body.classList.toggle('panel-open');
    });
  }

  const hotspotsLayer = document.createElement('div');
  hotspotsLayer.className = 'hotspots-layer';
  imageWrap.appendChild(hotspotsLayer);

  function syncMainHotspotBounds() {
    const wrapRect = imageWrap.getBoundingClientRect();
    const imgRect = imageEl.getBoundingClientRect();
    hotspotsLayer.style.left = (imgRect.left - wrapRect.left) + 'px';
    hotspotsLayer.style.top = (imgRect.top - wrapRect.top) + 'px';
    hotspotsLayer.style.width = imgRect.width + 'px';
    hotspotsLayer.style.height = imgRect.height + 'px';
  }

  const sceneOverlay = document.createElement('div');
  sceneOverlay.className = 'puzzle-scene-overlay hidden';
  sceneOverlay.innerHTML = [
    '<div class="puzzle-scene-shell">',
    '<button id="scene-exit" class="scene-exit" type="button">Fechar Cena</button>',
    '<h3 id="scene-title" class="scene-title"></h3>',
    '<div id="scene-stage" class="scene-stage">',
    '<img id="scene-image" class="scene-image-full" alt="Cena de puzzle">',
    '<div class="scene-dust-overlay" aria-hidden="true"></div>',
    '<div id="scene-hotspots" class="scene-hotspots"></div>',
    '</div>',
    '</div>'
  ].join('');
  document.body.appendChild(sceneOverlay);

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

  function handleAction(action, rerenderScene) {
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
      addItem(state, action.item);
      if (action.flag) setFlag(state, action.flag);
      saveState(state);
      playSfx('pickup');
      showToast('Item coletado: ' + ITEMS[action.item].emoji + ' ' + ITEMS[action.item].name);
      renderAll();
      if (rerenderScene) rerenderScene();
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
      if (!hasItem(state, action.requiredItem)) {
        playSfx('locked');
        showToast('Requer: ' + ITEMS[action.requiredItem].name + '.');
        return;
      }

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
  }

  function buildMainHotspot(hotspot) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'scene-hotspot invisible-hotspot';
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

    return button;
  }

  function renderMainHotspots() {
    hotspotsLayer.innerHTML = '';
    roomData.hotspots.forEach(function (hotspot) {
      if (hotspot.action.type === 'pickup' && hotspot.action.flag && hasFlag(state, hotspot.action.flag)) return;
      hotspotsLayer.appendChild(buildMainHotspot(hotspot));
    });
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
    slot.innerHTML = selectedItem ? '<span>' + ITEMS[selectedItem].emoji + '</span>' : '<span>+</span>';
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

    const flow = [
      '1) Hall: Haste + Engrenagem -> Manivela',
      '2) Relogio: Manivela -> Chave Biblioteca',
      '3) Retratos: Grampo',
      '4) Quadro Hall: Grampo -> Pe de Cabra',
      '5) Janela Hall: Pe de Cabra -> Jardim',
      '6) Biblioteca: Jarro de Agua',
      '7) Lareira: Jarro -> Medalhao',
      '8) Condessa: Medalhao -> Alicate',
      '9) Fonte: Alicate -> Botao Cofre',
      '10) Cofre: Botao -> Chave de Ouro'
    ];

    const flowBox = document.createElement('section');
    flowBox.className = 'panel-block';
    flowBox.innerHTML = '<h3>Fluxo gradual principal</h3>' + flow.map(function (line) { return '<p class="panel-line">' + line + '</p>'; }).join('');
    panelEl.appendChild(flowBox);

    const bag = document.createElement('section');
    bag.className = 'panel-block backpack-block';
    bag.innerHTML = '<h3>Mochila</h3>';

    const inv = document.createElement('div');
    inv.className = 'inventory-grid';
    if (!state.inventory.length) {
      const empty = document.createElement('p');
      empty.className = 'panel-line muted';
      empty.textContent = 'Mochila vazia.';
      inv.appendChild(empty);
    }

    state.inventory.forEach(function (itemId) {
      const item = ITEMS[itemId];
      if (!item) return;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'inventory-chip';
      chip.draggable = true;
      chip.innerHTML = '<span>' + item.emoji + '</span>' + item.name;
      chip.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', itemId);
      });
      inv.appendChild(chip);
    });

    bag.appendChild(inv);
    panelEl.appendChild(bag);

    const forge = document.createElement('section');
    forge.className = 'panel-block';
    forge.innerHTML = '<h3>Mesa de Forja</h3>';

    const wrap = document.createElement('div');
    wrap.className = 'forge-wrap';
    wrap.appendChild(createForgeSlot('A', forgeA));
    wrap.appendChild(createForgeSlot('B', forgeB));

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'forge-button';
    btn.textContent = 'Forjar item';
    btn.addEventListener('click', craftItems);

    forge.appendChild(wrap);
    forge.appendChild(btn);
    panelEl.appendChild(forge);

    countEl.textContent = state.inventory.length + '/11';
  }

  function openScene(sceneData) {
    const title = document.getElementById('scene-title');
    const stageImage = document.getElementById('scene-image');
    const stageHotspots = document.getElementById('scene-hotspots');
    const stage = document.getElementById('scene-stage');
    if (!title || !stageImage || !stageHotspots) return;

    function syncSceneHotspotBounds() {
      if (!stage) return;
      const stageRect = stage.getBoundingClientRect();
      const imgRect = stageImage.getBoundingClientRect();
      stageHotspots.style.left = (imgRect.left - stageRect.left) + 'px';
      stageHotspots.style.top = (imgRect.top - stageRect.top) + 'px';
      stageHotspots.style.width = imgRect.width + 'px';
      stageHotspots.style.height = imgRect.height + 'px';
    }

    function buildStage() {
      stageHotspots.innerHTML = '';
      sceneData.hotspots.forEach(function (hotspot) {
        if (hotspot.action.type === 'pickup' && hotspot.action.flag && hasFlag(state, hotspot.action.flag)) return;
        if (hotspot.action.type === 'use_item_reward' && hotspot.action.doneFlag && hasFlag(state, hotspot.action.doneFlag)) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'closeup-hotspot invisible-hotspot';
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

        stageHotspots.appendChild(button);
      });
      syncSceneHotspotBounds();
    }

    title.textContent = sceneData.title;

    stageImage.onerror = function () {
      stageImage.src = sceneData.fallbackImage || roomData.image;
      showToast('Cena dedicada nao encontrada ainda. Usando fallback temporario.');
    };
    stageImage.onload = function () {
      syncSceneHotspotBounds();
    };
    stageImage.src = sceneData.image;
    buildStage();

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

  const sceneExit = document.getElementById('scene-exit');
  if (sceneExit) {
    sceneExit.addEventListener('click', function () {
      sceneOverlay.classList.add('hidden');
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key.toLowerCase() === 'i') {
      document.body.classList.toggle('panel-open');
    }
    if (event.key.toLowerCase() === 'h') {
      document.body.classList.toggle('debug-hotspots');
      showToast(document.body.classList.contains('debug-hotspots') ? 'Debug hotspots: ON' : 'Debug hotspots: OFF');
    }
  });

  imageEl.addEventListener('load', function () {
    syncMainHotspotBounds();
  });

  window.addEventListener('resize', function () {
    syncMainHotspotBounds();
  });

  window.addEventListener('orientationchange', function () {
    setTimeout(syncMainHotspotBounds, 120);
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', function () {
      syncMainHotspotBounds();
    });
  }

  renderAll();
})();
