(function () {
  const STORY_ID = 'chave_faroleiro_cap01';
  const ADMIN_KEY = `${STORY_ID}.isAdmin`;
  const ADMIN_PIN = '4412';
  const DRAFT_KEY = `${STORY_ID}.modulacaoDraft`;

  function byId(id) {
    return document.getElementById(id);
  }

  function setAdmin(value) {
    localStorage.setItem(ADMIN_KEY, value ? '1' : '0');
  }

  function isAdmin() {
    return localStorage.getItem(ADMIN_KEY) === '1';
  }

  function ensureAdminPage() {
    const isModulationPage = !!byId('generate-json');
    if (isModulationPage && !isAdmin()) {
      window.location.href = 'admin-login.html';
      return false;
    }
    return true;
  }

  function parseJsonInput(value) {
    const txt = (value || '').trim();
    if (!txt) return undefined;
    try {
      return JSON.parse(txt);
    } catch (e) {
      return undefined;
    }
  }

  function toNum(v, fallback) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function setupAdminLogin() {
    const form = byId('admin-login-form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = byId('admin-pin');
      const error = byId('admin-login-error');
      const value = (input.value || '').trim();

      if (value !== ADMIN_PIN) {
        error.classList.remove('hidden');
        return;
      }

      setAdmin(true);
      window.location.href = 'modulacao.html';
    });
  }

  function setupModulacao() {
    if (!ensureAdminPage()) return;

    const overlays = [];
    const itemHotspots = [];
    const puzzleHotspots = [];
    const puzzleDefs = [];

    const selected = {
      overlay: -1,
      item: -1,
      puzzleHotspot: -1,
      puzzleDef: -1
    };

    const overlayList = byId('overlay-list');
    const itemList = byId('item-list');
    const puzzleList = byId('puzzle-list');
    const pdefList = byId('pdef-list');
    const output = byId('json-output');
    const roomPreset = byId('room-preset');
    const previewStage = byId('mod-preview-stage');
    const previewImage = byId('mod-preview-image');
    const previewLayer = byId('mod-preview-layer');

    let dragState = null;

    function getOverlayForm() {
      return {
        flag: (byId('overlay-flag').value || '').trim(),
        image: (byId('overlay-image').value || '').trim(),
        x: toNum(byId('overlay-x').value, 0),
        y: toNum(byId('overlay-y').value, 0),
        w: toNum(byId('overlay-w').value, 10),
        h: toNum(byId('overlay-h').value, 10)
      };
    }

    function setOverlayForm(item) {
      byId('overlay-flag').value = item.flag || '';
      byId('overlay-image').value = item.image || '';
      byId('overlay-x').value = item.x;
      byId('overlay-y').value = item.y;
      byId('overlay-w').value = item.w;
      byId('overlay-h').value = item.h;
    }

    function getItemForm() {
      const itemId = (byId('item-id').value || '').trim();
      const label = (byId('item-label').value || '').trim() || itemId;
      return {
        id: `${itemId}_pickup`,
        label: label,
        x: toNum(byId('item-x').value, 0),
        y: toNum(byId('item-y').value, 0),
        w: toNum(byId('item-w').value, 8),
        h: toNum(byId('item-h').value, 8),
        action: {
          type: 'pickup',
          itemId: itemId,
          flag: `picked_${itemId}`
        },
        inactiveIfFlag: `picked_${itemId}`
      };
    }

    function setItemForm(h) {
      byId('item-id').value = h.action && h.action.itemId ? h.action.itemId : '';
      byId('item-label').value = h.label || '';
      byId('item-x').value = h.x;
      byId('item-y').value = h.y;
      byId('item-w').value = h.w;
      byId('item-h').value = h.h;
    }

    function getPuzzleHotspotForm() {
      const puzzleId = (byId('puzzle-id').value || '').trim();
      const label = (byId('puzzle-label').value || '').trim();
      const successFlag = (byId('puzzle-flag').value || '').trim();
      const successMsg = (byId('puzzle-msg').value || '').trim();
      return {
        id: `${puzzleId}_hotspot`,
        label: label,
        x: toNum(byId('puzzle-x').value, 0),
        y: toNum(byId('puzzle-y').value, 0),
        w: toNum(byId('puzzle-w').value, 12),
        h: toNum(byId('puzzle-h').value, 12),
        action: {
          type: 'puzzle',
          puzzleId: puzzleId,
          onSuccess: {
            flag: successFlag,
            message: successMsg || 'Enigma resolvido!'
          }
        },
        inactiveIfFlag: successFlag
      };
    }

    function setPuzzleHotspotForm(h) {
      byId('puzzle-id').value = h.action && h.action.puzzleId ? h.action.puzzleId : '';
      byId('puzzle-label').value = h.label || '';
      byId('puzzle-flag').value = h.action && h.action.onSuccess ? h.action.onSuccess.flag || '' : '';
      byId('puzzle-msg').value = h.action && h.action.onSuccess ? h.action.onSuccess.message || '' : '';
      byId('puzzle-x').value = h.x;
      byId('puzzle-y').value = h.y;
      byId('puzzle-w').value = h.w;
      byId('puzzle-h').value = h.h;
    }

    function getPuzzleDefForm() {
      const item = {
        id: (byId('pdef-id').value || '').trim(),
        title: (byId('pdef-title').value || '').trim(),
        image: (byId('pdef-image').value || '').trim(),
        story: (byId('pdef-story').value || '').trim(),
        clue: (byId('pdef-clue').value || '').trim(),
        kind: (byId('pdef-kind').value || '').trim()
      };

      const options = parseJsonInput(byId('pdef-options').value);
      const answer = parseJsonInput(byId('pdef-answer').value);
      if (typeof options !== 'undefined') item.options = options;
      if (typeof answer !== 'undefined') item.answer = answer;
      return item;
    }

    function setPuzzleDefForm(pdef) {
      byId('pdef-id').value = pdef.id || '';
      byId('pdef-title').value = pdef.title || '';
      byId('pdef-image').value = pdef.image || '';
      byId('pdef-story').value = pdef.story || '';
      byId('pdef-clue').value = pdef.clue || '';
      byId('pdef-kind').value = pdef.kind || '';
      byId('pdef-options').value = typeof pdef.options === 'undefined' ? '' : JSON.stringify(pdef.options);
      byId('pdef-answer').value = typeof pdef.answer === 'undefined' ? '' : JSON.stringify(pdef.answer);
    }

    function getActiveRoomImage() {
      return (byId('room-image').value || '').trim();
    }

    function getCollection(kind) {
      if (kind === 'overlay') return overlays;
      if (kind === 'item') return itemHotspots;
      if (kind === 'puzzleHotspot') return puzzleHotspots;
      return [];
    }

    function getTokenLabel(kind, entry) {
      if (kind === 'overlay') return entry.flag || 'overlay';
      if (kind === 'item') return entry.label || (entry.action && entry.action.itemId) || 'item';
      if (kind === 'puzzleHotspot') return entry.label || (entry.action && entry.action.puzzleId) || 'puzzle';
      return 'item';
    }

    function resolveTokenImage(kind, entry) {
      if (kind === 'overlay') return entry.image || '';
      if (kind === 'item' && entry.action && entry.action.itemId && typeof STORY_DATA !== 'undefined') {
        const data = STORY_DATA.items && STORY_DATA.items[entry.action.itemId];
        return data && data.sprite ? `assets/images/itens/${data.sprite}` : '';
      }
      if (kind === 'puzzleHotspot' && entry.action && entry.action.puzzleId && typeof STORY_DATA !== 'undefined') {
        const data = STORY_DATA.puzzles && STORY_DATA.puzzles[entry.action.puzzleId];
        return data && data.image ? data.image : '';
      }
      return '';
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function updateEntryPosition(kind, index, x, y) {
      const collection = getCollection(kind);
      const entry = collection[index];
      if (!entry) return;
      entry.x = clamp(x, 0, 100);
      entry.y = clamp(y, 0, 100);
      if (kind === 'overlay') setOverlayForm(entry);
      if (kind === 'item') setItemForm(entry);
      if (kind === 'puzzleHotspot') setPuzzleHotspotForm(entry);
      renderLists();
      renderPreview();
      saveDraft();
    }

    function startDrag(kind, index, event) {
      const collection = getCollection(kind);
      if (!collection[index] || !previewStage) return;
      dragState = {
        kind,
        index,
        pointerId: event.pointerId
      };
      selected[kind === 'puzzleHotspot' ? 'puzzleHotspot' : kind] = index;
      renderLists();
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    }

    function stopDrag() {
      dragState = null;
    }

    function pointerToPercent(event) {
      const rect = previewStage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      return {
        x: clamp(x, 0, 100),
        y: clamp(y, 0, 100)
      };
    }

    function renderPreview() {
      if (!previewLayer || !previewImage) return;
      previewImage.src = getActiveRoomImage();
      previewLayer.innerHTML = '';

      const appendToken = function (kind, entry, index) {
        const token = document.createElement('button');
        token.type = 'button';
        token.className = `preview-token ${kind}${selected[kind] === index ? ' selected' : ''}`;
        token.style.left = `${entry.x}%`;
        token.style.top = `${entry.y}%`;
        token.style.width = `${Math.max(4, entry.w || 6)}%`;
        token.style.height = `${Math.max(3, entry.h || 4)}%`;
        const imagePath = resolveTokenImage(kind, entry);
        const label = getTokenLabel(kind, entry);
        token.innerHTML = imagePath
          ? `<img class="preview-token-image" src="${imagePath}" alt="${label}"><span class="preview-token-label">${label}</span>`
          : `<span class="preview-token-label">${label}</span>`;
        token.addEventListener('click', function () {
          selected[kind] = index;
          if (kind === 'overlay') setOverlayForm(entry);
          if (kind === 'item') setItemForm(entry);
          if (kind === 'puzzleHotspot') setPuzzleHotspotForm(entry);
          if (kind === 'puzzleDef') setPuzzleDefForm(entry);
          renderLists();
          renderPreview();
        });
        token.addEventListener('pointerdown', function (event) {
          startDrag(kind, index, event);
        });
        previewLayer.appendChild(token);
      };

      overlays.forEach(function (entry, index) { appendToken('overlay', entry, index); });
      itemHotspots.forEach(function (entry, index) { appendToken('item', entry, index); });
      puzzleHotspots.forEach(function (entry, index) { appendToken('puzzleHotspot', entry, index); });
    }

    function actionButtons(type, idx) {
      return `<button type="button" data-edit="${type}:${idx}">Editar</button> <button type="button" data-remove="${type}:${idx}">Remover</button>`;
    }

    function renderLists() {
      overlayList.innerHTML = overlays
        .map(function (o, idx) {
          const mark = selected.overlay === idx ? ' [selecionado]' : '';
          return `<li>${idx + 1}. ${o.flag} | ${o.image} [${o.x}, ${o.y}, ${o.w}, ${o.h}]${mark} ${actionButtons('overlay', idx)}</li>`;
        })
        .join('');

      itemList.innerHTML = itemHotspots
        .map(function (h, idx) {
          const mark = selected.item === idx ? ' [selecionado]' : '';
          return `<li>${idx + 1}. ${h.id} (${h.action.itemId}) [${h.x}, ${h.y}, ${h.w}, ${h.h}]${mark} ${actionButtons('item', idx)}</li>`;
        })
        .join('');

      puzzleList.innerHTML = puzzleHotspots
        .map(function (h, idx) {
          const mark = selected.puzzleHotspot === idx ? ' [selecionado]' : '';
          return `<li>${idx + 1}. ${h.id} (${h.action.puzzleId}) [${h.x}, ${h.y}, ${h.w}, ${h.h}]${mark} ${actionButtons('puzzleHotspot', idx)}</li>`;
        })
        .join('');

      pdefList.innerHTML = puzzleDefs
        .map(function (p, idx) {
          const mark = selected.puzzleDef === idx ? ' [selecionado]' : '';
          return `<li>${idx + 1}. ${p.id} (${p.kind})${mark} ${actionButtons('puzzleDef', idx)}</li>`;
        })
        .join('');

      if (previewImage) {
        previewImage.src = getActiveRoomImage();
      }

      renderPreview();
    }

    function saveDraft() {
      const draft = {
        roomId: byId('room-id').value,
        roomTitle: byId('room-title').value,
        roomImage: byId('room-image').value,
        roomGoal: byId('room-goal').value,
        overlays: overlays,
        itemHotspots: itemHotspots,
        puzzleHotspots: puzzleHotspots,
        puzzleDefs: puzzleDefs
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }

    function clearMutableArrays() {
      overlays.splice(0, overlays.length);
      itemHotspots.splice(0, itemHotspots.length);
      puzzleHotspots.splice(0, puzzleHotspots.length);
      puzzleDefs.splice(0, puzzleDefs.length);
      selected.overlay = -1;
      selected.item = -1;
      selected.puzzleHotspot = -1;
      selected.puzzleDef = -1;
    }

    function hydrateFromRoom(roomId, room) {
      byId('room-id').value = roomId;
      byId('room-title').value = room.title || '';
      byId('room-image').value = room.image || '';
      byId('room-goal').value = room.goal || '';

      clearMutableArrays();

      (room.overlays || []).forEach(function (o) {
        if (o.flag && o.image) {
          overlays.push({ flag: o.flag, image: o.image, x: o.x, y: o.y, w: o.w, h: o.h });
        }
      });

      (room.hotspots || []).forEach(function (h) {
        if (!h.action) return;
        if (h.action.type === 'pickup') itemHotspots.push(JSON.parse(JSON.stringify(h)));
        if (h.action.type === 'puzzle') puzzleHotspots.push(JSON.parse(JSON.stringify(h)));
      });

      puzzleDefs.splice(0, puzzleDefs.length);
      const storyPuzzles = (typeof STORY_DATA !== 'undefined' && STORY_DATA.puzzles) ? STORY_DATA.puzzles : {};
      Object.keys(storyPuzzles).forEach(function (pid) {
        const pz = storyPuzzles[pid];
        puzzleDefs.push(Object.assign({ id: pid }, JSON.parse(JSON.stringify(pz))));
      });

      renderLists();
      saveDraft();
    }

    function loadDraft() {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      try {
        const draft = JSON.parse(raw);
        byId('room-id').value = draft.roomId || byId('room-id').value;
        byId('room-title').value = draft.roomTitle || byId('room-title').value;
        byId('room-image').value = draft.roomImage || byId('room-image').value;
        byId('room-goal').value = draft.roomGoal || byId('room-goal').value;

        clearMutableArrays();
        (draft.overlays || []).forEach(function (o) { overlays.push(o); });
        (draft.itemHotspots || []).forEach(function (h) { itemHotspots.push(h); });
        (draft.puzzleHotspots || []).forEach(function (h) { puzzleHotspots.push(h); });
        (draft.puzzleDefs || []).forEach(function (p) { puzzleDefs.push(p); });

        renderLists();
      } catch (e) {
        console.warn('Draft inválido de modulação.');
      }
    }

    function populateRoomPreset() {
      if (!roomPreset) return;
      roomPreset.innerHTML = '';
      const rooms = (typeof STORY_DATA !== 'undefined' && STORY_DATA.rooms) ? STORY_DATA.rooms : {};
      Object.keys(rooms).forEach(function (roomId) {
        const opt = document.createElement('option');
        opt.value = roomId;
        opt.textContent = roomId;
        roomPreset.appendChild(opt);
      });
    }

    function removeByType(type, idx) {
      if (type === 'overlay') overlays.splice(idx, 1);
      if (type === 'item') itemHotspots.splice(idx, 1);
      if (type === 'puzzleHotspot') puzzleHotspots.splice(idx, 1);
      if (type === 'puzzleDef') puzzleDefs.splice(idx, 1);
      renderLists();
      saveDraft();
    }

    function editByType(type, idx) {
      if (type === 'overlay' && overlays[idx]) {
        selected.overlay = idx;
        setOverlayForm(overlays[idx]);
      }
      if (type === 'item' && itemHotspots[idx]) {
        selected.item = idx;
        setItemForm(itemHotspots[idx]);
      }
      if (type === 'puzzleHotspot' && puzzleHotspots[idx]) {
        selected.puzzleHotspot = idx;
        setPuzzleHotspotForm(puzzleHotspots[idx]);
      }
      if (type === 'puzzleDef' && puzzleDefs[idx]) {
        selected.puzzleDef = idx;
        setPuzzleDefForm(puzzleDefs[idx]);
      }
      renderLists();
    }

    [overlayList, itemList, puzzleList, pdefList].forEach(function (listNode) {
      listNode.addEventListener('click', function (event) {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) return;
        if (target.dataset.remove) {
          const parts = target.dataset.remove.split(':');
          removeByType(parts[0], Number(parts[1]));
          return;
        }
        if (target.dataset.edit) {
          const parts = target.dataset.edit.split(':');
          editByType(parts[0], Number(parts[1]));
        }
      });
    });

    byId('add-overlay').addEventListener('click', function () {
      const item = getOverlayForm();
      if (!item.flag || !item.image) return;
      overlays.push(item);
      selected.overlay = overlays.length - 1;
      renderLists();
      saveDraft();
    });

    byId('update-overlay').addEventListener('click', function () {
      if (selected.overlay < 0 || !overlays[selected.overlay]) return;
      const item = getOverlayForm();
      if (!item.flag || !item.image) return;
      overlays[selected.overlay] = item;
      renderLists();
      saveDraft();
    });

    byId('add-item-hotspot').addEventListener('click', function () {
      const item = getItemForm();
      if (!item.action.itemId) return;
      itemHotspots.push(item);
      selected.item = itemHotspots.length - 1;
      renderLists();
      saveDraft();
    });

    byId('update-item-hotspot').addEventListener('click', function () {
      if (selected.item < 0 || !itemHotspots[selected.item]) return;
      const item = getItemForm();
      if (!item.action.itemId) return;
      itemHotspots[selected.item] = item;
      renderLists();
      saveDraft();
    });

    byId('add-puzzle-hotspot').addEventListener('click', function () {
      const item = getPuzzleHotspotForm();
      if (!item.action.puzzleId || !item.label || !item.action.onSuccess.flag) return;
      puzzleHotspots.push(item);
      selected.puzzleHotspot = puzzleHotspots.length - 1;
      renderLists();
      saveDraft();
    });

    byId('update-puzzle-hotspot').addEventListener('click', function () {
      if (selected.puzzleHotspot < 0 || !puzzleHotspots[selected.puzzleHotspot]) return;
      const item = getPuzzleHotspotForm();
      if (!item.action.puzzleId || !item.label || !item.action.onSuccess.flag) return;
      puzzleHotspots[selected.puzzleHotspot] = item;
      renderLists();
      saveDraft();
    });

    byId('add-puzzle-def').addEventListener('click', function () {
      const item = getPuzzleDefForm();
      if (!item.id || !item.title || !item.kind) return;
      puzzleDefs.push(item);
      selected.puzzleDef = puzzleDefs.length - 1;
      renderLists();
      saveDraft();
    });

    byId('update-puzzle-def').addEventListener('click', function () {
      if (selected.puzzleDef < 0 || !puzzleDefs[selected.puzzleDef]) return;
      const item = getPuzzleDefForm();
      if (!item.id || !item.title || !item.kind) return;
      puzzleDefs[selected.puzzleDef] = item;
      renderLists();
      saveDraft();
    });

    byId('load-room-preset').addEventListener('click', function () {
      const rid = roomPreset.value;
      const rooms = (typeof STORY_DATA !== 'undefined' && STORY_DATA.rooms) ? STORY_DATA.rooms : {};
      if (!rid || !rooms[rid]) return;
      hydrateFromRoom(rid, rooms[rid]);
    });

    const previewSync = byId('preview-sync');
    if (previewSync) {
      previewSync.addEventListener('click', function () {
        renderPreview();
      });
    }

    const previewReset = byId('preview-reset');
    if (previewReset) {
      previewReset.addEventListener('click', function () {
        selected.overlay = -1;
        selected.item = -1;
        selected.puzzleHotspot = -1;
        selected.puzzleDef = -1;
        renderLists();
      });
    }

    if (previewStage) {
      previewStage.addEventListener('pointermove', function (event) {
        if (!dragState) return;
        const pos = pointerToPercent(event);
        const collection = getCollection(dragState.kind);
        const entry = collection[dragState.index];
        if (!entry) return;
        entry.x = pos.x;
        entry.y = pos.y;
        if (dragState.kind === 'overlay') setOverlayForm(entry);
        if (dragState.kind === 'item') setItemForm(entry);
        if (dragState.kind === 'puzzleHotspot') setPuzzleHotspotForm(entry);
        renderLists();
        renderPreview();
      });

      previewStage.addEventListener('pointerup', function () {
        stopDrag();
        saveDraft();
      });

      previewStage.addEventListener('pointerleave', function () {
        if (dragState) {
          stopDrag();
          saveDraft();
        }
      });
    }

    byId('generate-json').addEventListener('click', function () {
      const roomId = (byId('room-id').value || 'nova_sala').trim();
      const room = {
        title: (byId('room-title').value || '').trim(),
        image: (byId('room-image').value || '').trim(),
        goal: (byId('room-goal').value || '').trim(),
        overlays: overlays,
        hotspots: itemHotspots.concat(puzzleHotspots)
      };

      const puzzlesMap = {};
      puzzleDefs.forEach(function (p) {
        const id = p.id;
        const cloned = JSON.parse(JSON.stringify(p));
        delete cloned.id;
        puzzlesMap[id] = cloned;
      });

      const generated = [
        '// rooms',
        `"${roomId}": ${JSON.stringify(room, null, 2)}`,
        '',
        '// puzzles',
        JSON.stringify(puzzlesMap, null, 2)
      ].join('\n');

      output.value = generated;
      saveDraft();
    });

    byId('copy-json').addEventListener('click', function () {
      if (!output.value) return;
      navigator.clipboard.writeText(output.value).catch(function () {});
    });

    const adminLogout = byId('admin-logout');
    if (adminLogout) {
      adminLogout.addEventListener('click', function () {
        setAdmin(false);
        window.location.href = 'mapa.html';
      });
    }

    ['room-id', 'room-title', 'room-image', 'room-goal'].forEach(function (id) {
      const node = byId(id);
      node.addEventListener('input', saveDraft);
    });

    populateRoomPreset();
    loadDraft();
    renderPreview();
  }

  setupAdminLogin();
  setupModulacao();
})();