/* ============================================
   MISTERIO - Central Game Engine (ES6 Module)
   ============================================ */

import { state } from './state.js';
import { ROOMS } from '../content/rooms.js';
import { ITEMS } from '../content/items.js';
import { COMBINATIONS } from '../content/puzzles.js';
import { AudioSystem } from './audio.js';
import { GameRenderer } from './renderer.js';

export class GameEngine {
  constructor() {
    this.canvas = null;
    this.renderer = null;
    this.bgImage = null;
    this.closeupImages = {};
    
    // Controle de loops e tempo
    this.loopActive = false;
    this.lightningTimer = 0;
    this.whisperTimer = 0;

    // Narrative & Dialogues
    this.dialogActive = false;
    this.dialogSequence = [];
    this.dialogIndex = 0;
    this.dialogCallback = null;

    // Crafting Slots
    this.craftSlots = [null, null];
  }

  init() {
    // 1. Carregar save se houver para atualizar o estado global
    state.loadFromStorage();

    // 2. Detecta qual página estamos
    const path = window.location.pathname;

    if (path.includes('map.html')) {
      // Página do Mapa
      this.updateStats();
      this.renderMap();
      
      // Ocultar loader
      const loader = document.getElementById('loading-screen');
      if (loader) loader.classList.add('hidden');
      return;
    }

    if (path.includes('hall.html') || path.includes('retrato.html') || path.includes('biblioteca.html') || path.includes('jardim.html')) {
      // Página de Cenário do Jogo
      this.canvas = document.getElementById('game-canvas');
      if (!this.canvas) return;

      this.renderer = new GameRenderer(this.canvas);

      // Setup Canvas Resize
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());

      // Setup Canvas Listeners
      this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.canvas.addEventListener('mousedown', () => this.handleCanvasClick());

      // Setup Keyboard Listeners
      window.addEventListener('keydown', (e) => {
        if (e.key === 'i' || e.key === 'I' || e.key === 'm' || e.key === 'M') {
          this.toggleInventory();
        }
      });

      // Setup Dialog overlay click listeners
      const dialogBox = document.getElementById('dialog-box');
      if (dialogBox) {
        dialogBox.addEventListener('click', () => this.advanceDialog());
      }

      this.updateStats();

      // Ocultar loader
      const loader = document.getElementById('loading-screen');
      if (loader) loader.classList.add('hidden');

      // Entra no cenário correspondente
      const roomToEnter = this.getCurrentRoomFromURL();
      this.enterRoom(roomToEnter);
      return;
    }

    // Caso padrão: index.html (Login / Menu Principal)
    const btnContinue = document.getElementById('btn-continue');
    const hasSave = state.loadFromStorage();
    if (btnContinue) {
      btnContinue.style.display = hasSave ? 'inline-block' : 'none';
    }

    // Preencher o nome do investigador se já existir
    const inputName = document.getElementById('investigator-name-input');
    if (inputName && state.investigatorName) {
      inputName.value = state.investigatorName;
    }

    const loader = document.getElementById('loading-screen');
    if (loader) loader.classList.add('hidden');
    
    const title = document.getElementById('title-screen');
    if (title) title.classList.remove('hidden');
  }

  getCurrentRoomFromURL() {
    const path = window.location.pathname;
    if (path.includes('hall.html')) return 'hall';
    if (path.includes('retrato.html')) return 'sala_retratos';
    if (path.includes('biblioteca.html')) return 'biblioteca';
    if (path.includes('jardim.html')) return 'jardim_abandonado';
    return state.currentRoom || 'hall';
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    if (!parent) return;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }

  handleMouseMove(e) {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.renderer.updateMouse(x, y);
  }

  startGame() {
    AudioSystem.init();
    AudioSystem.resume();

    // Resetar jogo do zero e registrar o nome do investigador
    const inputName = document.getElementById('investigator-name-input');
    const name = inputName ? inputName.value.trim() : '';

    state.reset();
    state.clearStorage();

    if (name) {
      state.investigatorName = name;
    }
    state.saveToStorage();

    // Redireciona para o primeiro cenário
    window.location.href = 'hall.html';
  }

  continueGame() {
    AudioSystem.init();
    AudioSystem.resume();

    state.loadFromStorage();
    
    const room = state.currentRoom || 'hall';
    const target = room === 'sala_retratos' ? 'retrato.html' :
                  room === 'biblioteca' ? 'biblioteca.html' :
                  room === 'jardim_abandonado' ? 'jardim.html' : 'hall.html';

    window.location.href = target;
  }

  enterRoom(roomId) {
    const room = ROOMS.find(r => r.id === roomId);
    if (!room) return;

    state.currentRoom = roomId;
    state.currentCloseup = null;
    state.saveToStorage();

    // Atualiza HUD de forma animada
    document.getElementById('hud-room-name').textContent = room.name;
    document.getElementById('hud-objective').textContent = room.desc;

    // Preload Room Background Image
    this.bgImage = new Image();
    this.bgImage.src = room.image;
    this.bgImage.onload = () => {
      this.resizeCanvas();
      this.updateHUDObjectList();
      this.updateStats();

      // Ambient system
      AudioSystem.stopAmbient();
      AudioSystem.playMusic();
      AudioSystem.playRain();
      if (roomId === 'hall') {
        AudioSystem.playClockTick();
      }

      // Tocar diálogos de narrativa se for a primeira entrada
      if (room.narrative && room.narrative.enter && !state.foundObjects.length && state.journal.length <= 1) {
        this.triggerDialogSequence(room.narrative.enter);
      }

      this.loopActive = true;
      this.startGameLoop();
    };
  }

  startGameLoop() {
    if (!this.loopActive) return;

    // 1. Ticks e atualizações atmosféricas
    this.tickAtmosphere();

    // 2. Renderiza a cena dependendo do estado
    const room = ROOMS.find(r => r.id === state.currentRoom);
    if (room) {
      if (state.currentCloseup) {
        this.renderer.drawCloseup(state.currentCloseup, this.bgImage, this.closeupImages);
      } else {
        this.renderer.drawRoom(room, this.bgImage, this.closeupImages);
      }
    }

    requestAnimationFrame(() => this.startGameLoop());
  }

  tickAtmosphere() {
    // A. Relâmpago e Trovão Procedural
    this.lightningTimer++;
    if (this.lightningTimer > 400 + Math.random() * 500) {
      this.lightningTimer = 0;
      this.renderer.triggerLightning();
      if (typeof AudioSystem.playThunder === 'function') {
        AudioSystem.playThunder();
      }
    }
    this.renderer.updateLightning();

    // B. Sussurros fantasmagóricos na escuridão
    this.whisperTimer++;
    if (this.whisperTimer > 900) {
      this.whisperTimer = 0;
      if (Math.random() > 0.65) AudioSystem.playWhisper();
    }
  }

  handleCanvasClick() {
    if (this.dialogActive || state.isVictory) return;

    const room = ROOMS.find(r => r.id === state.currentRoom);
    if (!room) return;

    const mousePos = this.renderer.toScenePoint(this.renderer.mouse.x, this.renderer.mouse.y);

    if (state.currentCloseup) {
      // 1. Clique no botão de voltar gótico
      if (this.renderer.isMouseOverBackButton()) {
        this.exitCloseup();
        return;
      }

      // 2. Clique em hiddenObject do closeup
      if (state.currentCloseup.objects) {
        const clickedObj = this.getObjectAtPosition(this.renderer.mouse.x, this.renderer.mouse.y, state.currentCloseup.objects, true);
        if (clickedObj) {
          this.collectObject(clickedObj);
          return;
        }
      }

      // 3. Clique em hotspot/desafio do closeup
      const clickedHotspot = this.getHotspotAtPosition(this.renderer.mouse.x, this.renderer.mouse.y, state.currentCloseup);
      if (clickedHotspot) {
        this.interactHotspot(clickedHotspot);
        return;
      }

      // 4. Fechar closeup se clicar fora do foco
      const view = this.renderer.getCloseupView(state.currentCloseup);
      const insideFocus = this.renderer.mouse.x >= view.focus.x && this.renderer.mouse.x <= view.focus.x + view.focus.w && this.renderer.mouse.y >= view.focus.y && this.renderer.mouse.y <= view.focus.y + view.focus.h;
      if (!insideFocus) {
        this.exitCloseup();
      }
      return;
    }

    // 5. Clique em portal de transição
    const clickedPortal = this.getPortalAtPosition(this.renderer.mouse.x, this.renderer.mouse.y, room);
    if (clickedPortal) {
      this.usePortal(clickedPortal);
      return;
    }

    // 6. Clique em hiddenObject do cenário principal
    if (room.hiddenObjects) {
      const clickedObj = this.getObjectAtPosition(this.renderer.mouse.x, this.renderer.mouse.y, room.hiddenObjects, false);
      if (clickedObj) {
        this.collectObject(clickedObj);
        return;
      }
    }

    // 7. Clique em closeup do cenário
    if (room.closeups) {
      const clickedCloseup = this.getCloseupAtPosition(this.renderer.mouse.x, this.renderer.mouse.y, room);
      if (clickedCloseup) {
        this.enterCloseup(clickedCloseup);
      }
    }
  }

  enterCloseup(closeup) {
    AudioSystem.playWoodCreak();
    this.loopActive = false; // Interrompe loop temporariamente para transição

    this.playSceneTransition(() => {
      state.currentCloseup = closeup;
      document.getElementById('hud-room-name').textContent = `${ROOMS.find(r => r.id === state.currentRoom).name} - ${closeup.name}`;
      document.getElementById('hud-objective').textContent = 'Zoom ativo. Examine os detalhes e clique em VOLTAR.';

      // Preload do Closeup se houver imagem específica
      const imagePath = closeup.closeupImage;
      if (imagePath) {
        if (!this.closeupImages[imagePath]) {
          const img = new Image();
          img.src = imagePath;
          img.onload = () => {
            this.closeupImages[imagePath] = img;
            this.loopActive = true;
            this.startGameLoop();
          };
          img.onerror = () => {
            // Em caso de erro, continua com fallback de crop dinâmico
            this.loopActive = true;
            this.startGameLoop();
          };
        } else {
          this.loopActive = true;
          this.startGameLoop();
        }
      } else {
        this.loopActive = true;
        this.startGameLoop();
      }
    });
  }

  exitCloseup() {
    if (!state.currentCloseup) return;
    AudioSystem._playSFX(200, 0.2, 'sine', 0.2);
    this.loopActive = false;

    this.playSceneTransition(() => {
      state.currentCloseup = null;
      const room = ROOMS.find(r => r.id === state.currentRoom);
      document.getElementById('hud-room-name').textContent = room.name;
      document.getElementById('hud-objective').textContent = room.desc;
      this.loopActive = true;
      this.startGameLoop();
    });
  }

  collectObject(obj) {
    state.foundObjects.push(obj.id);
    state.inventory.push(obj.id);
    state.addJournal(`Coletou o item: ${obj.name} (${ITEMS[obj.id].emoji})`);
    
    AudioSystem.playFind();
    this.showToast(`Item Coletado: ${obj.name} ✨`);
    
    this.updateHUDObjectList();
    this.updateStats();
    state.saveToStorage();
  }

  interactHotspot(hs) {
    if (state.completedHotspots.includes(hs.id)) return;

    if (hs.locked) {
      if (state.inventory.includes(hs.requiredItem)) {
        // Solucionar puzzle!
        hs.locked = false;
        state.completedHotspots.push(hs.id);
        
        // Remove item do inventário
        state.inventory = state.inventory.filter(i => i !== hs.requiredItem);

        AudioSystem.playPuzzleSolve();
        state.addJournal(`Desvendou o enigma: ${hs.name} usando ${hs.itemName}`);

        this.triggerDialogSequence([
          { speaker: 'Investigador', text: hs.unlockMessage }
        ], () => {
          if (hs.giveItem) {
            this.collectObject({ id: hs.giveItem, name: ITEMS[hs.giveItem].name });
          }
        });
      } else {
        // Bloqueado
        AudioSystem.playError();
        this.triggerDialogSequence([
          { speaker: 'Investigador', text: `Este ponto (${hs.name}) está trancado ou inacessível. Parece requerer algo específico...` }
        ]);
      }
    }
  }

  usePortal(portal) {
    if (portal.locked && !state.unlockedPortals.includes(portal.id)) {
      if (state.inventory.includes(portal.requiredItem)) {
        state.unlockedPortals.push(portal.id);
        state.inventory = state.inventory.filter(i => i !== portal.requiredItem);
        AudioSystem.playUnlock();
        state.addJournal(`Destrancou passagem: ${portal.name}`);

        this.triggerDialogSequence([
          { speaker: 'Investigador', text: portal.unlockMessage }
        ], () => {
          this.navigateToRoom(portal.room);
        });
      } else {
        AudioSystem.playError();
        this.triggerDialogSequence([
          { speaker: 'Investigador', text: `Esta passagem está bloqueada. Requer: ${portal.itemName}.` }
        ]);
      }
    } else {
      AudioSystem.playDoor();
      this.navigateToRoom(portal.room);
    }
  }

  navigateToRoom(roomId) {
    state.currentRoom = roomId;
    state.saveToStorage();

    const target = roomId === 'sala_retratos' ? 'retrato.html' :
                  roomId === 'biblioteca' ? 'biblioteca.html' :
                  roomId === 'jardim_abandonado' ? 'jardim.html' : 'hall.html';
    window.location.href = target;
  }

  // --- MATH POSITION COLLISION DETECTION ---
  getObjectAtPosition(mx, my, objects, isZoom) {
    const view = isZoom ? this.renderer.getCloseupView(state.currentCloseup) : null;
    return objects.find(obj => {
      if (state.foundObjects.includes(obj.id)) return false;
      let ox, oy;
      if (!isZoom) {
        const p = this.renderer.toScreenPoint(obj.x + obj.w / 2, obj.y + obj.h / 2);
        ox = p.x;
        oy = p.y;
      } else {
        const rx = (obj.x - view.crop.x) / view.crop.w;
        const ry = (obj.y - view.crop.y) / view.crop.h;
        ox = view.focus.x + rx * view.focus.w;
        oy = view.focus.y + ry * view.focus.h;
      }
      const dist = Math.sqrt((mx - ox) ** 2 + (my - oy) ** 2);
      return dist < 30; // 30px hit box circle
    });
  }

  getHotspotAtPosition(mx, my, cu) {
    if (!cu.hotspots) return null;
    const view = this.renderer.getCloseupView(cu);
    return cu.hotspots.find(hs => {
      if (state.completedHotspots.includes(hs.id)) return false;
      const rx = (hs.x - view.crop.x) / view.crop.w;
      const ry = (hs.y - view.crop.y) / view.crop.h;
      const rw = hs.w / view.crop.w;
      const rh = hs.h / view.crop.h;

      const hx = view.focus.x + rx * view.focus.w;
      const hy = view.focus.y + ry * view.focus.h;
      const hw = rw * view.focus.w;
      const hh = rh * view.focus.h;

      return mx >= hx && mx <= hx + hw && my >= hy && my <= hy + hh;
    });
  }

  getPortalAtPosition(mx, my, room) {
    if (!room.portals) return null;
    return room.portals.find(port => {
      const p1 = this.renderer.toScreenPoint(port.x, port.y);
      const p2 = this.renderer.toScreenPoint(port.x + port.w, port.y + port.h);
      return mx >= p1.x && mx <= p2.x && my >= p1.y && my <= p2.y;
    });
  }

  getCloseupAtPosition(mx, my, room) {
    if (!room.closeups) return null;
    return room.closeups.find(cu => {
      const p1 = this.renderer.toScreenPoint(cu.x, cu.y);
      const p2 = this.renderer.toScreenPoint(cu.x + cu.w, cu.y + cu.h);
      return mx >= p1.x && mx <= p2.x && my >= p1.y && my <= p2.y;
    });
  }

  // --- DIALOG SYSTEM ---
  triggerDialogSequence(seq, callback = null) {
    this.dialogSequence = seq;
    this.dialogIndex = 0;
    this.dialogActive = true;
    this.dialogCallback = callback;

    const dialogBox = document.getElementById('dialog-box');
    if (dialogBox) dialogBox.classList.add('active');

    this.advanceDialog();
  }

  advanceDialog() {
    if (this.dialogIndex >= this.dialogSequence.length) {
      this.closeDialog();
      return;
    }

    const current = this.dialogSequence[this.dialogIndex];
    document.getElementById('dialog-speaker').textContent = current.speaker;
    document.getElementById('dialog-text').textContent = current.text;
    this.dialogIndex++;

    AudioSystem.playClick();
  }

  closeDialog() {
    this.dialogActive = false;
    const dialogBox = document.getElementById('dialog-box');
    if (dialogBox) dialogBox.classList.remove('active');

    if (this.dialogCallback) {
      const cb = this.dialogCallback;
      this.dialogCallback = null;
      cb();
    }
  }

  // --- TRANSITIONS & TOASTS ---
  playSceneTransition(action) {
    const game = document.getElementById('game-container');
    game.style.filter = 'brightness(0) contrast(1.5)';
    game.style.transition = 'filter 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
    
    setTimeout(() => {
      action();
      game.style.filter = 'brightness(1) contrast(1)';
    }, 300);
  }

  showToast(text) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
  }

  // --- INVENTÁRIO TELA CHEIA (MOCHILA) ---
  toggleInventory() {
    const screen = document.getElementById('backpack-screen');
    if (!screen) return;

    if (screen.classList.contains('hidden')) {
      screen.classList.remove('hidden');
      this.renderBackpack();
      AudioSystem.playWoodCreak();
    } else {
      screen.classList.add('hidden');
      this.clearCraftingSlots();
    }
  }

  renderBackpack() {
    const list = document.getElementById('inventory-items');
    if (!list) return;
    list.innerHTML = '';

    if (state.inventory.length === 0) {
      list.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-dim);font-style:italic;">Mochila vazia. Colete objetos na mansão.</div>';
      return;
    }

    state.inventory.forEach(itemId => {
      const item = ITEMS[itemId];
      if (!item) return;

      const div = document.createElement('div');
      div.className = 'backpack-item';
      div.draggable = true;
      div.id = `inv-${itemId}`;
      div.innerHTML = `
        <div class="backpack-item-emoji">${item.emoji}</div>
        <div class="backpack-item-name">${item.name}</div>
      `;

      div.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', itemId);
      });

      list.appendChild(div);
    });
  }

  dropToSlot(e, slotNum) {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    this.craftSlots[slotNum - 1] = itemId;

    const slotEl = document.getElementById(`slot${slotNum}`);
    if (slotEl) {
      const item = ITEMS[itemId];
      slotEl.innerHTML = `
        <div style="font-size:1.8rem;">${item.emoji}</div>
        <div style="font-size:0.65rem;color:#ffe8cc;">${item.name}</div>
      `;
      slotEl.style.borderColor = '#dfc879';
    }
    AudioSystem.playClick();
  }

  combineSlots() {
    const item1 = this.craftSlots[0];
    const item2 = this.craftSlots[1];

    if (!item1 || !item2) {
      AudioSystem.playError();
      this.showToast('Insira dois itens na mesa ❌');
      return;
    }

    const match = COMBINATIONS.find(c => 
      (c.item1 === item1 && c.item2 === item2) || 
      (c.item1 === item2 && c.item2 === item1)
    );

    if (match) {
      // Remover os materiais
      state.inventory = state.inventory.filter(i => i !== item1 && i !== item2);
      
      // Adicionar resultado
      state.inventory.push(match.result);
      AudioSystem.playPuzzleSolve();

      this.showToast(`Item Criado: ${match.resultName}! ✨`);
      state.addJournal(`Combinou ${ITEMS[item1].name} + ${ITEMS[item2].name} = ${match.resultName}`);

      this.clearCraftingSlots();
      this.renderBackpack();
    } else {
      AudioSystem.playError();
      this.showToast('Combinação falhou ❌');
    }
  }

  clearCraftingSlots() {
    this.craftSlots = [null, null];
    const s1 = document.getElementById('slot1');
    const s2 = document.getElementById('slot2');
    if (s1) { s1.innerHTML = ''; s1.style.borderColor = 'rgba(223, 200, 121, 0.15)'; }
    if (s2) { s2.innerHTML = ''; s2.style.borderColor = 'rgba(223, 200, 121, 0.15)'; }
  }

  // --- STATS & DIÁRIO ---
  updateStats() {
    const totalItems = ROOMS.reduce((sum, r) => sum + (r.hiddenObjects ? r.hiddenObjects.length : 0), 0) +
                       ROOMS.flatMap(r => r.closeups || []).reduce((sum, c) => sum + (c.objects ? c.objects.length : 0), 0);

    const solvedPuzzles = state.completedHotspots.length + state.unlockedPortals.length;
    const totalPuzzles = ROOMS.flatMap(r => r.closeups || []).reduce((sum, c) => sum + (c.hotspots ? c.hotspots.length : 0), 0) +
                         ROOMS.reduce((sum, r) => sum + (r.portals ? r.portals.filter(p => p.locked).length : 0), 0);

    document.getElementById('stat-objects').textContent = `${state.foundObjects.length}/${totalItems}`;
    document.getElementById('stat-puzzles').textContent = `${solvedPuzzles}/${totalPuzzles}`;
    document.getElementById('stat-clues').textContent = state.journal.length;
    document.getElementById('stat-hints').textContent = state.hintsRemaining;

    // Condição de vitória instantânea ao obter a chave dourada!
    if (state.inventory.includes('golden_key') && !state.isVictory) {
      this.triggerVictory();
    }
  }

  updateHUDObjectList() {
    const list = document.getElementById('object-list');
    if (!list) return;
    list.innerHTML = '';

    const room = ROOMS.find(r => r.id === state.currentRoom);
    if (!room) return;

    // Coleta objetos da sala e subcloseups
    const localObjects = [...(room.hiddenObjects || [])];
    if (room.closeups) {
      room.closeups.forEach(c => {
        if (c.objects) localObjects.push(...c.objects);
      });
    }

    localObjects.forEach(obj => {
      const found = state.foundObjects.includes(obj.id);
      const span = document.createElement('span');
      span.className = `object-list-item ${found ? 'found' : ''}`;
      span.innerHTML = `${obj.emoji} ${obj.name}`;
      list.appendChild(span);
    });
  }

  toggleJournal() {
    const panel = document.getElementById('journal-panel');
    if (!panel) return;

    if (panel.classList.contains('active')) {
      panel.classList.remove('active');
    } else {
      panel.classList.add('active');
      this.renderJournal();
      AudioSystem.playWoodCreak();
    }
  }

  renderJournal() {
    const list = document.getElementById('journal-entries');
    if (!list) return;
    list.innerHTML = '';

    if (state.journal.length === 0) {
      list.innerHTML = '<div style="color:var(--text-dim);font-style:italic;">Nenhum registro.</div>';
      return;
    }

    state.journal.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'journal-entry';
      div.innerHTML = `
        <span class="journal-entry-time">[${entry.time}]</span>
        <p class="journal-entry-text">${entry.text}</p>
      `;
      list.appendChild(div);
    });
  }

  useHint() {
    if (state.hintsRemaining <= 0) {
      AudioSystem.playError();
      this.showToast('Sem dicas restantes! ❌');
      return;
    }

    const room = ROOMS.find(r => r.id === state.currentRoom);
    if (!room) return;

    // Procura por um item pendente na cena atual
    const pendingObjects = (room.hiddenObjects || []).filter(o => !state.foundObjects.includes(o.id));
    if (state.currentCloseup && state.currentCloseup.objects) {
      pendingObjects.push(...state.currentCloseup.objects.filter(o => !state.foundObjects.includes(o.id)));
    }

    if (pendingObjects.length > 0) {
      const target = pendingObjects[Math.random() * pendingObjects.length | 0];
      state.hintsRemaining--;
      this.updateStats();
      this.showToast(`Dica: Procure por ${target.name}! ✨`);
      AudioSystem.playUnlock();
    } else {
      AudioSystem.playError();
      this.showToast('Todos os itens desta sala já foram coletados!');
    }
  }

  triggerVictory() {
    state.isVictory = true;
    state.saveToStorage();
    AudioSystem.stopMusic();
    AudioSystem.playPuzzleSolve();

    // Fade-in vitória gótica
    this.loopActive = true;
    this.startGameLoop();
  }

  renderMap() {
    const grid = document.getElementById('map-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Mostrar o nome do investigador no mapa
    const mapTitle = document.querySelector('.map-title');
    if (mapTitle && state.investigatorName) {
      mapTitle.innerHTML = `MANSÃO MISTÉRIO<br><span style="font-size: 0.8rem; letter-spacing: 2px; color: var(--text-dim);">INVESTIGADOR: ${state.investigatorName.toUpperCase()}</span>`;
    }

    ROOMS.forEach(room => {
      // Calcule progresso de itens coletados na sala e seus closeups
      const localObjects = [...(room.hiddenObjects || [])];
      if (room.closeups) {
        room.closeups.forEach(c => {
          if (c.objects) localObjects.push(...c.objects);
        });
      }
      const totalObjects = localObjects.length;
      const foundObjects = localObjects.filter(o => state.foundObjects.includes(o.id)).length;
      const pct = totalObjects > 0 ? Math.round((foundObjects / totalObjects) * 100) : 100;

      // Determina se a sala está trancada na navegação (se requer item de portal no Hall)
      let locked = false;
      let requiredItemName = '';

      if (room.id === 'biblioteca') {
        const portal = ROOMS.find(r => r.id === 'hall').portals.find(p => p.room === 'biblioteca');
        if (portal && portal.locked && !state.unlockedPortals.includes(portal.id)) {
          locked = true;
          requiredItemName = portal.itemName;
        }
      } else if (room.id === 'jardim_abandonado') {
        const portal = ROOMS.find(r => r.id === 'hall').portals.find(p => p.room === 'jardim_abandonado');
        if (portal && portal.locked && !state.unlockedPortals.includes(portal.id)) {
          locked = true;
          requiredItemName = portal.itemName;
        }
      }

      const card = document.createElement('div');
      card.className = `room-card ${locked ? 'locked' : ''}`;
      
      let overlayContent = `
        <div class="room-card-overlay">
          <div class="room-card-name">${room.name}</div>
          <div class="room-card-desc">${room.desc}</div>
          <div class="room-card-progress">
            <div class="room-card-progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;

      if (locked) {
        overlayContent += `<div class="lock-icon">🔒</div>`;
      }

      card.innerHTML = `
        <img class="room-card-img" src="${room.image}" alt="${room.name}">
        ${overlayContent}
      `;

      if (!locked) {
        card.addEventListener('click', () => {
          AudioSystem.playClick();
          this.navigateToRoom(room.id);
        });
      } else {
        card.addEventListener('click', () => {
          AudioSystem.playError();
          this.showToast(`Sala Trancada! Requer: ${requiredItemName} 🔒`);
        });
      }

      grid.appendChild(card);
    });
  }

  backToMap() {
    AudioSystem.playClick();
    this.loopActive = false;
    window.location.href = 'map.html';
  }
}

export const Game = new GameEngine();
