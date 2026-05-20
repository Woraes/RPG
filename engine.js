/**
 * RPG POINT-AND-CLICK ADVENTURE ENGINE (engine.js)
 * Motor de jogo genérico, orientado por dados obtidos de story.js
 */

(function () {
  // --- VERIFICAÇÃO DE DADOS ---
  if (typeof STORY_DATA === 'undefined') {
    console.error("Erro Crítico: STORY_DATA não foi encontrado. Certifique-se de carregar story.js antes de engine.js.");
    return;
  }

  // --- LIMPAR DADOS LEGADOS ---
  const legacyKeys = ['misterio.storyState', 'cozinha_misteriosa_GDD.playerName', 'cozinha_misteriosa_GDD.storyState'];
  legacyKeys.forEach(key => localStorage.removeItem(key));

  const METADATA = STORY_DATA.metadata;
  const STORAGE_KEY = `${METADATA.id}.storyState`;

  // --- CONTROLE DE ESTADO ---
  let state = {
    inventory: [],
    flags: {},
    currentRoom: METADATA.startingRoom || ''
  };

  let equippedItemId = null;
  let activeCloseup = null; // Guarda os dados do closeup ativo

  // Mesa de Combinação (Forja)
  let forgeSlotA = null;
  let forgeSlotB = null;

  // --- CARREGAR E SALVAR ESTADO ---
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === 'object') {
        state.inventory = Array.isArray(saved.inventory) ? saved.inventory : [];
        state.flags = saved.flags && typeof saved.flags === 'object' ? saved.flags : {};
        state.currentRoom = saved.currentRoom || METADATA.startingRoom;
      }
    } catch (e) {
      console.warn("Falha ao carregar estado do localStorage, usando estado inicial padrão.");
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function hasItem(itemId) {
    return state.inventory.includes(itemId);
  }

  function addItem(itemId) {
    if (!STORY_DATA.items[itemId]) return;
    if (!hasItem(itemId)) {
      state.inventory.push(itemId);
      saveState();
    }
  }

  function removeItem(itemId) {
    state.inventory = state.inventory.filter(id => id !== itemId);
    if (equippedItemId === itemId) {
      equippedItemId = null;
      updateHandSlot();
    }
    saveState();
  }

  function hasFlag(flagName) {
    return Boolean(state.flags[flagName]);
  }

  function setFlag(flagName, value = true) {
    state.flags[flagName] = value;
    saveState();
  }

  // --- AUDIO SYSTEM ---
  function playSfx(type) {
    const audio = document.getElementById('fx-audio');
    if (!audio) return;
    
    let src = '';
    if (type === 'success') src = audio.dataset.success;
    if (type === 'locked') src = audio.dataset.locked;
    if (type === 'pickup') src = audio.dataset.pickup;
    if (type === 'click') src = audio.dataset.click;

    if (src) {
      audio.src = src;
      audio.play().catch(() => {});
    }
  }

  // --- ELEMENTOS DE DOM DO JOGO ---
  const roomTitleEl = document.getElementById('room-title');
  const roomGoalEl = document.getElementById('room-goal');
  const roomImageEl = document.getElementById('room-image');
  const frameEl = document.getElementById('scene-frame');
  const overlaysLayer = document.getElementById('overlays-layer');
  const itemsLayer = document.getElementById('scene-items-layer');
  const hotspotsLayer = document.getElementById('hotspots-layer');
  const lanternOverlay = document.getElementById('lantern-overlay');
  
  const panelEl = document.getElementById('room-items-panel');
  const countEl = document.getElementById('room-count');
  const handSlotBtn = document.getElementById('hand-slot');
  const dialogBox = document.getElementById('dialog-box');
  const dialogSpeaker = document.getElementById('dialog-speaker');
  const dialogText = document.getElementById('dialog-text');
  const storyToast = document.getElementById('story-toast');
  const tooltipEl = document.getElementById('gothic-tooltip');

  // Overlays extras
  const inventoryOverlay = document.getElementById('inventory-overlay');
  const sceneOverlay = document.getElementById('scene-overlay');
  const challengeOverlay = document.getElementById('challenge-overlay');
  const victoryOverlay = document.getElementById('victory-overlay');

  // --- FEEDBACKS E TOASTS ---
  function showToast(message) {
    if (!storyToast) return;
    storyToast.textContent = message;
    storyToast.classList.add('show');
    setTimeout(() => storyToast.classList.remove('show'), 2500);
  }

  function updateTooltip(text) {
    if (tooltipEl) tooltipEl.textContent = text;
  }

  // --- DIALOG SYSTEM ---
  let dialogSequence = [];
  let dialogIndex = 0;
  let dialogCallback = null;

  function triggerDialogue(sequence, callback = null) {
    if (!sequence || sequence.length === 0) {
      if (callback) callback();
      return;
    }
    dialogSequence = sequence;
    dialogIndex = 0;
    dialogCallback = callback;
    dialogBox.classList.add('active');
    advanceDialogue();
  }

  function advanceDialogue() {
    if (dialogIndex >= dialogSequence.length) {
      closeDialogue();
      return;
    }
    const current = dialogSequence[dialogIndex];
    dialogSpeaker.textContent = current.speaker || 'Narrador';
    dialogText.textContent = current.text || '';
    dialogIndex++;
    playSfx('click');
  }

  function closeDialogue() {
    dialogBox.classList.remove('active');
    if (dialogCallback) {
      const cb = dialogCallback;
      dialogCallback = null;
      cb();
    }
  }

  if (dialogBox) {
    dialogBox.addEventListener('click', advanceDialogue);
  }

  // --- TRANSITIONS ---
  function playTransition(action) {
    const gameWrap = document.getElementById('game-container');
    if (gameWrap) {
      gameWrap.style.filter = 'brightness(0) contrast(1.5)';
      gameWrap.style.transition = 'filter 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
      setTimeout(() => {
        action();
        gameWrap.style.filter = 'brightness(1) contrast(1)';
      }, 300);
    } else {
      action();
    }
  }

  // --- RESPONSIVIDADE E SYNC DE COORDENADAS ---
  function syncHotspotBounds(frame, image, layers) {
    if (!frame || !image || !layers) return;
    const frameRect = frame.getBoundingClientRect();
    const imgRect = image.getBoundingClientRect();
    
    layers.forEach(layer => {
      if (layer) {
        layer.style.left = (imgRect.left - frameRect.left) + 'px';
        layer.style.top = (imgRect.top - frameRect.top) + 'px';
        layer.style.width = imgRect.width + 'px';
        layer.style.height = imgRect.height + 'px';
      }
    });
  }

  function syncAllBounds() {
    if (activeCloseup) {
      const stage = document.getElementById('scene-stage');
      const stageImage = document.getElementById('scene-image');
      const stageHotspots = document.getElementById('scene-hotspots');
      const stageItems = document.getElementById('scene-items');
      const stageOverlays = document.getElementById('scene-overlays');
      syncHotspotBounds(stage, stageImage, [stageHotspots, stageItems, stageOverlays]);
    } else {
      syncHotspotBounds(frameEl, roomImageEl, [hotspotsLayer, itemsLayer, overlaysLayer]);
    }
  }

  function setLanternPosition(frame, rect, clientX, clientY, targetOverlay) {
    if (!rect || !targetOverlay) return;
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    targetOverlay.style.setProperty('--lantern-x', x + 'px');
    targetOverlay.style.setProperty('--lantern-y', y + 'px');
  }

  function centerLantern(rect, targetOverlay) {
    if (!rect || !targetOverlay) return;
    targetOverlay.style.setProperty('--lantern-x', (rect.width * 0.5) + 'px');
    targetOverlay.style.setProperty('--lantern-y', (rect.height * 0.5) + 'px');
  }

  // --- RENDER SCENERY OVERLAYS & ITEMS ---
  function renderVisualOverlays(container, overlays) {
    container.innerHTML = '';
    if (!overlays) return;

    overlays.forEach(overlay => {
      const shouldShow = hasFlag(overlay.flag);
      if (shouldShow) {
        const div = document.createElement('div');
        div.className = 'scene-visual-overlay';
        div.style.left = overlay.x + '%';
        div.style.top = overlay.y + '%';
        div.style.width = overlay.w + '%';
        div.style.height = overlay.h + '%';
        div.style.backgroundImage = `url('${overlay.image}')`;
        container.appendChild(div);
      }
    });
  }

  function renderPickupItems(container, hotspots) {
    container.innerHTML = '';
    if (!hotspots) return;

    hotspots.forEach(hs => {
      if (hs.action && hs.action.type === 'pickup') {
        const isCollected = hasFlag(hs.action.flag);
        if (!isCollected) {
          const item = STORY_DATA.items[hs.action.itemId];
          if (!item) return;

          // Se tiver activeIfFlag, só renderiza se a flag for true
          if (hs.activeIfFlag && !hasFlag(hs.activeIfFlag)) return;
          // Se tiver inactiveIfFlag, só renderiza se a flag for false
          if (hs.inactiveIfFlag && hasFlag(hs.inactiveIfFlag)) return;

          const prop = document.createElement('span');
          prop.className = `scene-item-prop item-${item.id}`;
          prop.style.left = (hs.x + hs.w / 2) + '%';
          prop.style.top = (hs.y + hs.h / 2) + '%';
          prop.setAttribute('aria-hidden', 'true');

          const iconContent = item.sprite
            ? `<img class="item-sprite" src="assets/images/itens/${item.sprite}" alt="${item.name}">`
            : `<span class="item-emoji">${item.emoji}</span>`;

          prop.innerHTML = `${iconContent}<span class="item-nameplate">${item.name}</span>`;
          container.appendChild(prop);
        }
      }
    });
  }

  // --- INTERACTION / HOTSPOTS SYSTEM ---
  function renderHotspots(container, hotspots, isCloseup = false, rerenderFn) {
    container.innerHTML = '';
    if (!hotspots) return;

    hotspots.forEach(hs => {
      // Checar se deve estar ativo
      if (hs.activeIfFlag && !hasFlag(hs.activeIfFlag)) return;
      if (hs.inactiveIfFlag && hasFlag(hs.inactiveIfFlag)) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      
      const hintClass = hs.action.type === 'pickup' ? 'hint-pickup' 
                      : (hs.action.type === 'scene' ? 'hint-scene' : 'hint-lock');
      
      btn.className = `scene-hotspot invisible-hotspot ${hintClass}`;
      btn.style.left = hs.x + '%';
      btn.style.top = hs.y + '%';
      btn.style.width = hs.w + '%';
      btn.style.height = hs.h + '%';
      btn.setAttribute('aria-label', hs.label);

      btn.addEventListener('mouseenter', () => updateTooltip(hs.label));
      btn.addEventListener('mouseleave', () => updateTooltip('Passe o mouse pela cena e investigue pontos ocultos.'));
      btn.addEventListener('click', () => handleAction(hs.action, rerenderFn));

      // Suporte a Drag and Drop (arrastar item para cá)
      if (hs.action.type === 'drag_place' || hs.action.type === 'use_item_flag') {
        btn.addEventListener('dragover', (e) => e.preventDefault());
        btn.addEventListener('drop', (e) => {
          e.preventDefault();
          const droppedItem = e.dataTransfer.getData('text/plain');
          if (droppedItem) {
            handleAction(hs.action, rerenderFn, droppedItem);
          }
        });
      }

      container.appendChild(btn);
    });
  }

  // --- ACTIONS HANDLER ---
  function handleAction(action, rerenderSceneFn, draggedItemId = null) {
    if (!action) return;

    // Se houver uma condição de item necessário (e não for drag_place que já trata isso)
    if (action.condition && action.type !== 'drag_place') {
      const itemToUse = draggedItemId || equippedItemId;
      if (itemToUse !== action.condition) {
        if (action.conditionFailedMessage) {
          triggerDialogue([{ speaker: 'Liora Voss', text: action.conditionFailedMessage }]);
        } else {
          showToast(`Requer: ${STORY_DATA.items[action.condition]?.name || action.condition}`);
        }
        return;
      }

      // Se passou na condição e tem um onUseItem definido
      if (action.onUseItem) {
        if (action.onUseItem.setFlag) setFlag(action.onUseItem.setFlag);
        if (action.onUseItem.message) {
          triggerDialogue([{ speaker: 'Liora Voss', text: action.onUseItem.message }]);
        }
        if (action.onUseItem.removeItem) removeItem(action.condition);
        
        renderAll();
        if (rerenderSceneFn) rerenderSceneFn();
        return;
      }
    }

    // 0. AÇÃO APENAS MENSAGEM
    if (action.type === 'message') {
      triggerDialogue([{ speaker: 'Liora Voss', text: action.message }]);
      return;
    }

    // 1. AÇÃO IR PARA SALA (goto)
    if (action.type === 'goto') {
      playTransition(() => enterRoom(action.room));
      return;
    }

    // 2. AÇÃO GOTO LOCKED (ir se destrancado por item)
    if (action.type === 'goto_locked') {
      if (!hasFlag(action.unlockFlag)) {
        const itemToUse = draggedItemId || equippedItemId;
        if (itemToUse && itemToUse !== action.item) {
          playSfx('locked');
          showToast(`Item errado! Requer: ${STORY_DATA.items[action.item].name}`);
          return;
        }
        if (!hasItem(action.item)) {
          playSfx('locked');
          showToast(`Trancado! Requer: ${STORY_DATA.items[action.item].name}`);
          return;
        }
        // Destrancar
        removeItem(action.item);
        setFlag(action.unlockFlag);
        playSfx('success');
        showToast(action.successMessage || "Passagem destrancada!");
      }
      playTransition(() => enterRoom(action.room));
      return;
    }

    // 3. AÇÃO COLETAR ITEM (pickup)
    if (action.type === 'pickup') {
      if (hasFlag(action.flag)) return;

      const proceedCollect = () => {
        addItem(action.itemId);
        setFlag(action.flag);
        playSfx('pickup');
        showToast(`Coletou: ${STORY_DATA.items[action.itemId].name}`);
        
        if (action.isVictory) {
          victoryOverlay.classList.remove('hidden');
          playSfx('success');
        }

        renderAll();
        if (rerenderSceneFn) rerenderSceneFn();
      };

      // Checa se o hotspot tem condição de flag externa ativa
      if (action.condition && !hasFlag(action.condition)) {
        playSfx('locked');
        triggerDialogue([
          { speaker: 'Investigador', text: action.conditionFailedMessage || 'Não posso fazer isso agora.' }
        ]);
        return;
      }

      // Abre mini-game de puzzle correspondente se estiver no dicionário
      const puzzleDef = STORY_DATA.puzzles[action.flag] || STORY_DATA.puzzles[action.itemId];
      if (puzzleDef) {
        openChallenge(puzzleDef, proceedCollect);
      } else {
        proceedCollect();
      }
      return;
    }

    // 4. AÇÃO ABRIR CLOSEUP (scene)
    if (action.type === 'scene') {
      openCloseup(action.scene);
      return;
    }

    // 5. AÇÃO RESOLVER MINI-GAME DEDICADO (puzzle)
    if (action.type === 'puzzle') {
      const puzzleId = action.puzzleId;
      const puzzleDef = STORY_DATA.puzzles[puzzleId];
      if (!puzzleDef) return;

      if (hasFlag(action.onSuccess.flag)) {
        showToast("Este mecanismo já foi solucionado.");
        return;
      }

      openChallenge(puzzleDef, () => {
        setFlag(action.onSuccess.flag);
        playSfx('success');
        
        if (action.onSuccess.message) {
          triggerDialogue([{ speaker: 'Liora Voss', text: action.onSuccess.message }], () => {
            if (action.onSuccess.victory) {
              victoryOverlay.classList.remove('hidden');
            }
          });
        } else {
          showToast("Enigma resolvido!");
          if (action.onSuccess.victory) {
            victoryOverlay.classList.remove('hidden');
          }
        }
        
        renderAll();
        if (rerenderSceneFn) rerenderSceneFn();
      });
      return;
    }

    // 6. AÇÃO ARRASTAR E POSICIONAR NO CENÁRIO (drag_place)
    if (action.type === 'drag_place') {
      const itemToUse = draggedItemId || equippedItemId;
      if (itemToUse && itemToUse !== action.requiredItem) {
        playSfx('locked');
        showToast(`Item errado. Requer: ${STORY_DATA.items[action.requiredItem].name}`);
        return;
      }
      if (!hasItem(action.requiredItem)) {
        playSfx('locked');
        showToast(`Requer colocar: ${STORY_DATA.items[action.requiredItem].name}`);
        return;
      }

      // Consome o item e posiciona
      removeItem(action.requiredItem);
      setFlag(action.setFlag);
      playSfx('success');
      showToast(action.successMessage || "Item posicionado!");

      renderAll();
      if (rerenderSceneFn) rerenderSceneFn();
      return;
    }
  }

  // --- CLOSE-UP (SCENE) OVERLAY SYSTEM ---
  function openCloseup(closeupData) {
    activeCloseup = closeupData;
    playSfx('click');

    const title = document.getElementById('scene-title');
    const stageImage = document.getElementById('scene-image');
    const stageHotspots = document.getElementById('scene-hotspots');
    const stageItems = document.getElementById('scene-items');
    const stageOverlays = document.getElementById('scene-overlays');
    const stageLantern = document.getElementById('scene-lantern');
    const stage = document.getElementById('scene-stage');

    title.textContent = closeupData.title || closeupData.name;
    stageImage.src = closeupData.image;

    function buildCloseupScene() {
      renderVisualOverlays(stageOverlays, closeupData.overlays);
      renderPickupItems(stageItems, closeupData.hotspots);
      renderHotspots(stageHotspots, closeupData.hotspots, true, buildCloseupScene);
      syncHotspotBounds(stage, stageImage, [stageHotspots, stageItems, stageOverlays]);
    }

    stageImage.onload = () => {
      buildCloseupScene();
      if (stageLantern) centerLantern(stage.getBoundingClientRect(), stageLantern);
    };

    stageImage.onerror = () => {
      stageImage.src = roomImageEl.src; // Fallback
      buildCloseupScene();
    };

    if (stage && stageLantern) {
      stage.onmousemove = (e) => {
        setLanternPosition(stage, stage.getBoundingClientRect(), e.clientX, e.clientY, stageLantern);
      };
      stage.ontouchmove = (e) => {
        if (e.touches && e.touches[0]) {
          setLanternPosition(stage, stage.getBoundingClientRect(), e.touches[0].clientX, e.touches[0].clientY, stageLantern);
        }
      };
    }

    sceneOverlay.classList.remove('hidden');
    document.body.classList.add('closeup-open');
  }

  function closeCloseup() {
    activeCloseup = null;
    sceneOverlay.classList.add('hidden');
    document.body.classList.remove('closeup-open');
    playSfx('click');
    renderAll();
  }

  const sceneExitBtn = document.getElementById('scene-exit');
  if (sceneExitBtn) {
    sceneExitBtn.addEventListener('click', closeCloseup);
  }

  sceneOverlay.addEventListener('click', (e) => {
    if (e.target === sceneOverlay) closeCloseup();
  });

  // --- PUZZLE INTERFACES (CHALLENGE OVERLAYS) ---
  function openChallenge(puzzleDef, onSolved) {
    const title = document.getElementById('challenge-title');
    const story = document.getElementById('challenge-story');
    const clue = document.getElementById('challenge-clue');
    const body = document.getElementById('challenge-body');
    const progress = document.getElementById('challenge-progress');
    const card = challengeOverlay.querySelector('.challenge-card');

    if (!title || !story || !body || !puzzleDef) return;

    card.className = `challenge-card puzzle-${puzzleDef.kind}`;
    title.textContent = puzzleDef.title;
    story.textContent = puzzleDef.story;
    clue.textContent = puzzleDef.clue || '';
    progress.textContent = '';
    body.innerHTML = '';
    body.className = `challenge-body puzzle-body-${puzzleDef.kind}`;

    function triggerFail(errText) {
      progress.textContent = errText || 'Combinação errada...';
      playSfx('locked');
      card.classList.remove('shake');
      void card.offsetWidth; // Trigger reflow
      card.classList.add('shake');
    }

    function triggerSuccess() {
      challengeOverlay.classList.add('hidden');
      playSfx('success');
      showToast("Solucionado!");
      onSolved();
    }

    // 1. PUZZLE DE SEQUÊNCIA
    if (puzzleDef.kind === 'sequence') {
      let currentStep = 0;
      
      const rail = document.createElement('div');
      rail.className = 'sequence-rail';
      puzzleDef.answer.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = 'sequence-node';
        dot.textContent = idx + 1;
        rail.appendChild(dot);
      });
      body.appendChild(rail);

      const controls = document.createElement('div');
      controls.className = 'sequence-controls';
      progress.textContent = `Progresso: 0 / ${puzzleDef.answer.length}`;

      puzzleDef.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'challenge-option';
        btn.textContent = opt;

        btn.addEventListener('click', () => {
          if (opt !== puzzleDef.answer[currentStep]) {
            // Reiniciar sequência
            currentStep = 0;
            body.querySelectorAll('.challenge-option').forEach(el => el.classList.remove('selected'));
            body.querySelectorAll('.sequence-node').forEach(el => el.classList.remove('done'));
            triggerFail('A fechadura estala. Sequência quebrada.');
            progress.textContent = `Progresso: 0 / ${puzzleDef.answer.length}`;
            return;
          }

          btn.classList.add('selected');
          const node = body.querySelectorAll('.sequence-node')[currentStep];
          if (node) node.classList.add('done');
          
          currentStep++;
          progress.textContent = `Progresso: ${currentStep} / ${puzzleDef.answer.length}`;
          playSfx('click');

          if (currentStep >= puzzleDef.answer.length) {
            setTimeout(triggerSuccess, 300);
          }
        });
        controls.appendChild(btn);
      });
      body.appendChild(controls);
    }

    // 2. PUZZLE DE TECLADO NUMÉRICO (CODE)
    if (puzzleDef.kind === 'code') {
      const face = document.createElement('div');
      face.className = 'safe-face';

      const input = document.createElement('input');
      input.className = 'challenge-code';
      input.placeholder = 'CÓDIGO';
      input.maxLength = 8;
      input.readOnly = true;
      face.appendChild(input);

      const grid = document.createElement('div');
      grid.className = 'keypad';
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].forEach(char => {
        const key = document.createElement('button');
        key.type = 'button';
        key.className = 'keypad-key';
        key.textContent = char;

        if (char === 'C') {
          key.addEventListener('click', () => {
            input.value = '';
            playSfx('click');
          });
        } else if (char === 'OK') {
          key.addEventListener('click', () => {
            if (input.value === puzzleDef.answer) {
              triggerSuccess();
            } else {
              triggerFail('Código Inválido!');
              input.value = '';
            }
          });
        } else {
          key.addEventListener('click', () => {
            if (input.value.length < input.maxLength) {
              input.value += char;
              playSfx('click');
            }
          });
        }
        grid.appendChild(key);
      });
      face.appendChild(grid);
      body.appendChild(face);
    }

    // 3. PUZZLE DE ESCOLHA SIMPLES (CHOICE)
    if (puzzleDef.kind === 'choice') {
      const grid = document.createElement('div');
      grid.className = 'choice-grid';

      puzzleDef.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'challenge-option';
        btn.textContent = opt;

        btn.addEventListener('click', () => {
          if (opt === puzzleDef.answer) {
            btn.classList.add('selected');
            setTimeout(triggerSuccess, 300);
          } else {
            triggerFail('Ação incorreta.');
          }
        });
        grid.appendChild(btn);
      });
      body.appendChild(grid);
    }

    // 4. PUZZLE DE COLETAR / LIMPAR RESÍDUOS (COLLECT)
    if (puzzleDef.kind === 'collect') {
      const cleaned = new Set();
      const board = document.createElement('div');
      board.className = 'dust-board';
      
      progress.textContent = `Sujeira removida: 0 / ${puzzleDef.pieces.length}`;

      puzzleDef.pieces.forEach(piece => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'challenge-option dust-piece';
        btn.textContent = piece;

        btn.addEventListener('click', () => {
          if (cleaned.has(piece)) return;
          cleaned.add(piece);
          btn.classList.add('selected');
          playSfx('click');
          progress.textContent = `Sujeira removida: ${cleaned.size} / ${puzzleDef.pieces.length}`;
          
          if (cleaned.size >= puzzleDef.pieces.length) {
            setTimeout(triggerSuccess, 300);
          }
        });
        board.appendChild(btn);
      });
      body.appendChild(board);
    }

    challengeOverlay.classList.remove('hidden');
  }

  const challengeCloseBtn = document.getElementById('challenge-close');
  if (challengeCloseBtn) {
    challengeCloseBtn.addEventListener('click', () => {
      challengeOverlay.classList.add('hidden');
    });
  }

  // --- INVENTÓRIO FÍSICO / FORJA RENDERING ---
  function renderBackpack() {
    if (!panelEl) return;
    panelEl.innerHTML = '';

    const selectedItem = equippedItemId ? STORY_DATA.items[equippedItemId] : null;

    const listContainer = document.createElement('div');
    listContainer.className = 'inventory-menu';
    listContainer.innerHTML = `
      <div class="inventory-titlebar">
        <div>
          <p class="eyebrow">Mochila do Investigador</p>
          <h2>Equipamentos</h2>
        </div>
        <span class="inventory-capacity">${state.inventory.length}/12</span>
      </div>
    `;

    const layout = document.createElement('div');
    layout.className = 'inventory-layout';

    // A. GRADE DE SLOTS DO INVENTÁRIO
    const grid = document.createElement('div');
    grid.className = 're-grid';

    // Itens combináveis marcados
    const combinables = {};
    STORY_DATA.combinations.forEach(combo => {
      combinables[combo.itemA] = true;
      combinables[combo.itemB] = true;
    });

    const totalSlots = Math.max(12, state.inventory.length);
    for (let i = 0; i < totalSlots; i++) {
      const itemId = state.inventory[i];
      const item = itemId ? STORY_DATA.items[itemId] : null;

      const slot = document.createElement(item ? 'button' : 'div');
      slot.className = `re-slot${item ? ' filled' : ''}${equippedItemId === itemId ? ' active' : ''}`;
      
      if (item) {
        slot.type = 'button';
        slot.draggable = true;

        const iconHtml = item.sprite
          ? `<img class="slot-sprite" src="assets/images/itens/${item.sprite}" alt="${item.name}">`
          : `<span class="slot-icon">${item.emoji}</span>`;
        
        const combinableIndicator = combinables[item.id] 
          ? `<span class="combine-mark" title="Item Combinável">⚙️</span>` 
          : '';

        slot.innerHTML = `${iconHtml}<span class="slot-name">${item.name}</span>${combinableIndicator}`;

        // Eventos
        slot.addEventListener('click', () => {
          equippedItemId = itemId;
          updateHandSlot();
          renderBackpack();
        });

        slot.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', itemId);
          equippedItemId = itemId;
          updateHandSlot();
        });
      } else {
        slot.innerHTML = `<span class="empty-slot">Vazio</span>`;
      }
      grid.appendChild(slot);
    }

    // B. PAINEL DE DETALHES E MESA DE COMBINAÇÃO
    const detailPanel = document.createElement('aside');
    detailPanel.className = 'item-detail';

    const detailHeaderHtml = selectedItem
      ? `
        ${selectedItem.sprite ? `<img class="detail-sprite" src="assets/images/itens/${selectedItem.sprite}" alt="${selectedItem.name}">` : `<div class="detail-emoji">${selectedItem.emoji}</div>`}
        <h3>${selectedItem.name}</h3>
        <p>${selectedItem.description || 'Um objeto coletado na cozinha.'}</p>
        <p class="detail-hint">Arraste-o para colocar no cenário ou jogue na mesa abaixo para combinar.</p>
      `
      : `
        <div class="detail-icon empty"></div>
        <h3>Mão Limpa</h3>
        <p>Selecione um item da mochila para examinar, equipar ou colocar no cenário.</p>
      `;

    detailPanel.innerHTML = detailHeaderHtml;

    // C. MESA DE FORJA / COMBINAÇÃO
    const forge = document.createElement('section');
    forge.className = 'combine-panel';
    forge.innerHTML = `
      <h3>Mesa de Combinar</h3>
      <p class="muted">Arrastar itens da mochila para combinar</p>
    `;

    const forgeWrap = document.createElement('div');
    forgeWrap.className = 'forge-wrap';

    function buildForgeSlot(name, value, setValFn) {
      const slot = document.createElement('div');
      slot.className = `forge-slot${value ? ' filled' : ''}`;
      slot.addEventListener('dragover', (e) => e.preventDefault());
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        if (id && hasItem(id)) {
          setValFn(id);
          playSfx('click');
          renderBackpack();
        }
      });

      if (value) {
        const item = STORY_DATA.items[value];
        slot.innerHTML = `
          ${item.sprite ? `<img class="slot-sprite" style="max-height: 40px;" src="assets/images/itens/${item.sprite}">` : `<span>${item.emoji}</span>`}
          <span class="slot-name" style="font-size:0.6rem;">${item.name}</span>
        `;
      } else {
        slot.innerHTML = `<span class="forge-empty">+</span>`;
      }
      return slot;
    }

    forgeWrap.appendChild(buildForgeSlot('A', forgeSlotA, (id) => forgeSlotA = id));
    forgeWrap.appendChild(buildForgeSlot('B', forgeSlotB, (id) => forgeSlotB = id));

    const combineBtn = document.createElement('button');
    combineBtn.type = 'button';
    combineBtn.className = 'forge-button';
    combineBtn.textContent = 'Combinar Elementos';
    combineBtn.addEventListener('click', combineForgeItems);

    forge.appendChild(forgeWrap);
    forge.appendChild(combineBtn);
    detailPanel.appendChild(forge);

    layout.appendChild(grid);
    layout.appendChild(detailPanel);
    listContainer.appendChild(layout);
    panelEl.appendChild(listContainer);

    if (countEl) countEl.textContent = `${state.inventory.length}/12`;
  }

  function combineForgeItems() {
    if (!forgeSlotA || !forgeSlotB) {
      showToast("Arraste 2 itens para forjar.");
      playSfx('locked');
      return;
    }

    const recipe = STORY_DATA.combinations.find(c => 
      (c.itemA === forgeSlotA && c.itemB === forgeSlotB) || 
      (c.itemA === forgeSlotB && c.itemB === forgeSlotA)
    );

    if (recipe) {
      removeItem(forgeSlotA);
      removeItem(forgeSlotB);
      addItem(recipe.result);
      
      forgeSlotA = null;
      forgeSlotB = null;

      playSfx('success');
      showToast(`Criou: ${STORY_DATA.items[recipe.result].name}`);
      
      if (recipe.successMessage) {
        triggerDialogue([
          { speaker: 'Forja', text: recipe.successMessage }
        ]);
      }
      
      renderAll();
    } else {
      playSfx('locked');
      showToast("Combinação Inválida!");
      forgeSlotA = null;
      forgeSlotB = null;
      renderBackpack();
    }
  }

  function updateHandSlot() {
    if (!handSlotBtn) return;
    const item = equippedItemId ? STORY_DATA.items[equippedItemId] : null;
    
    if (item) {
      const spriteHtml = item.sprite 
        ? `<img class="hand-sprite" src="assets/images/itens/${item.sprite}" alt="${item.name}">`
        : `<span class="hand-emoji">${item.emoji}</span>`;
      handSlotBtn.innerHTML = `${spriteHtml}<span class="hand-text">Equipado: ${item.name}</span>`;
    } else {
      handSlotBtn.innerHTML = `<span class="hand-text">Mão vazia</span>`;
    }
  }

  // --- BACKPACK INTERACTION POPUPS ---
  function openInventory() {
    inventoryOverlay.classList.remove('hidden');
    document.body.classList.add('inventory-open');
    playSfx('click');
    renderBackpack();
  }

  function closeInventory() {
    inventoryOverlay.classList.add('hidden');
    document.body.classList.remove('inventory-open');
    playSfx('click');
  }

  const toggleInventoryBtn = document.getElementById('hud-toggle-inventory');
  if (toggleInventoryBtn) {
    toggleInventoryBtn.addEventListener('click', () => {
      if (document.body.classList.contains('inventory-open')) closeInventory();
      else openInventory();
    });
  }

  const inventoryCloseBtn = document.getElementById('inventory-close');
  if (inventoryCloseBtn) {
    inventoryCloseBtn.addEventListener('click', closeInventory);
  }

  inventoryOverlay.addEventListener('click', (e) => {
    if (e.target === inventoryOverlay) closeInventory();
  });

  if (handSlotBtn) {
    handSlotBtn.addEventListener('click', openInventory);
  }

  // --- ENTER ROOM AND INITIALIZE ---
  function enterRoom(roomId) {
    const room = STORY_DATA.rooms[roomId];
    if (!room) {
      console.error(`Erro: Sala '${roomId}' não encontrada no banco de dados story.js.`);
      return;
    }

    state.currentRoom = roomId;
    saveState();

    activeCloseup = null;
    sceneOverlay.classList.add('hidden');
    document.body.classList.remove('closeup-open');

    // Atualiza HUD de forma síncrona
    if (roomTitleEl) roomTitleEl.textContent = room.title;
    if (roomGoalEl) roomGoalEl.textContent = room.goal || '';
    
    const hudTitle = document.getElementById('hud-room-title');
    const hudGoal = document.getElementById('hud-room-goal');
    if (hudTitle) hudTitle.textContent = room.title;
    if (hudGoal) hudGoal.textContent = room.goal || '';

    // Carrega fundo da sala
    roomImageEl.src = room.image;

    function buildRoomScene() {
      renderVisualOverlays(overlaysLayer, room.overlays);
      renderPickupItems(itemsLayer, room.hotspots);
      renderHotspots(hotspotsLayer, room.hotspots, false, buildRoomScene);
      syncHotspotBounds(frameEl, roomImageEl, [hotspotsLayer, itemsLayer, overlaysLayer]);
    }

    roomImageEl.onload = () => {
      buildRoomScene();
      centerLantern(frameEl.getBoundingClientRect(), lanternOverlay);
    };

    renderAll();
  }

  function renderAll() {
    renderBackpack();
    updateHandSlot();
  }

  // --- INITIALIZATION ---
  function init() {
    loadState();

    // Setup Clock Tick
    const clockNode = document.getElementById('hud-clock');
    function tick() {
      if (!clockNode) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      clockNode.textContent = `${hh}:${mm}`;
    }
    tick();
    setInterval(tick, 1000);

    // Setup Event Listeners para Mouse e Movimento de Lanterna
    if (frameEl && lanternOverlay) {
      frameEl.onmousemove = (e) => {
        setLanternPosition(frameEl, frameEl.getBoundingClientRect(), e.clientX, e.clientY, lanternOverlay);
      };
      frameEl.ontouchmove = (e) => {
        if (e.touches && e.touches[0]) {
          setLanternPosition(frameEl, frameEl.getBoundingClientRect(), e.touches[0].clientX, e.touches[0].clientY, lanternOverlay);
        }
      };
    }

    // Atalhos do teclado (I para inventário, ESC para fechar overlays)
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'i') {
        if (document.body.classList.contains('inventory-open')) closeInventory();
        else openInventory();
      }
      if (e.key === 'Escape') {
        if (document.body.classList.contains('inventory-open')) closeInventory();
        if (activeCloseup) closeCloseup();
        challengeOverlay.classList.add('hidden');
      }
    });

    window.addEventListener('resize', () => {
      syncAllBounds();
      if (!activeCloseup) centerLantern(frameEl.getBoundingClientRect(), lanternOverlay);
    });

    // Inicia na sala salva ou padrão
    const roomToLoad = state.currentRoom || METADATA.startingRoom;
    console.log(`%c 🗝️ RPG Engine: Carregando ${METADATA.title}... `, 'background: #121831; color: #d9b765; font-weight: bold; padding: 4px;');
    
    enterRoom(roomToLoad);

    // Dispara a introdução da sala se existir
    const introMsg = STORY_DATA.rooms[roomToLoad]?.intro;
    if (introMsg) {
      setTimeout(() => {
        triggerDialogue([{ speaker: 'Liora Voss', text: introMsg }]);
      }, 800);
    }
  }

  // Executa inicialização
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
