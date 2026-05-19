/* ============================================
   MISTERIO - Game Renderer Engine (ES6 Module)
   ============================================ */

import { state } from './state.js';
import { ITEMS } from '../content/items.js';

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mouse = { x: 0, y: 0 };
    this.lightningAlpha = 0.0;
    this.particles = [];
    
    // Configurações de partícula de poeira dourada flutuante
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        speedY: 0.05 + Math.random() * 0.1,
        speedX: -0.05 + Math.random() * 0.1,
        size: 0.5 + Math.random() * 1.5,
        alpha: 0.1 + Math.random() * 0.6,
        phase: Math.random() * Math.PI
      });
    }
  }

  updateMouse(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  getSceneRect() {
    const w = this.canvas.width || 1;
    const h = this.canvas.height || 1;
    const canvasRatio = w / h;
    const targetRatio = 16 / 9;
    let sw, sh, sx, sy;

    if (canvasRatio > targetRatio) {
      sh = h;
      sw = sh * targetRatio;
      sx = (w - sw) / 2;
      sy = 0;
    } else {
      sw = w;
      sh = sw / targetRatio;
      sx = 0;
      sy = (h - sh) / 2;
    }
    return { x: sx, y: sy, w: sw, h: sh };
  }

  toScreenPoint(rx, ry) {
    const scene = this.getSceneRect();
    return {
      x: scene.x + (rx / 100) * scene.w,
      y: scene.y + (ry / 100) * scene.h
    };
  }

  toScenePoint(sx, sy) {
    const scene = this.getSceneRect();
    return {
      x: ((sx - scene.x) / scene.w) * 100,
      y: ((sy - scene.y) / scene.h) * 100
    };
  }

  drawRoom(room, bgImage, closeupImages) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (w <= 0 || h <= 0) return;
    const scene = this.getSceneRect();

    // 1. Limpa tela geral
    this.ctx.fillStyle = '#050508';
    this.ctx.fillRect(0, 0, w, h);

    if (!bgImage || !bgImage.complete) {
      this.ctx.fillStyle = '#101018';
      this.ctx.fillRect(scene.x, scene.y, scene.w, scene.h);
      return;
    }

    // 2. Desenha a Imagem de Fundo (Background Layer)
    this.ctx.drawImage(bgImage, scene.x, scene.y, scene.w, scene.h);

    // 3. Renderiza camadas de movimento/efeito da cena
    if (room.layers) {
      room.layers.forEach(layer => {
        if (!layer.condition || layer.condition(state)) {
          layer.render(this.ctx, scene, (rx, ry) => this.toScreenPoint(rx, ry));
        }
      });
    }

    // 4. Desenha portais e verifica hover
    let hoveredPortal = null;
    if (room.portals) {
      room.portals.forEach(port => {
        const p1 = this.toScreenPoint(port.x, port.y);
        const p2 = this.toScreenPoint(port.x + port.w, port.y + port.h);
        const px = p1.x;
        const py = p1.y;
        const pw = p2.x - p1.x;
        const ph = p2.y - p1.y;

        const hovered = this.mouse.x >= px && this.mouse.x <= px + pw && this.mouse.y >= py && this.mouse.y <= py + ph;
        if (hovered) {
          hoveredPortal = port;

          // Indicador visual no portal
          this.ctx.save();
          this.ctx.strokeStyle = port.locked && !state.unlockedPortals.includes(port.id) ? 'rgba(235, 94, 85, 0.45)' : 'rgba(100, 223, 121, 0.45)';
          this.ctx.lineWidth = 2.5;
          this.ctx.beginPath();
          this.ctx.roundRect(px, py, pw, ph, 4);
          this.ctx.stroke();

          this.ctx.fillStyle = port.locked && !state.unlockedPortals.includes(port.id) ? 'rgba(235, 94, 85, 0.05)' : 'rgba(100, 223, 121, 0.05)';
          this.ctx.fill();
          this.ctx.restore();
        }
      });
    }

    // 5. Desenha closeups e aplica efeito visual gótico
    let hoveredCloseup = null;
    if (room.closeups) {
      room.closeups.forEach(cu => {
        const p1 = this.toScreenPoint(cu.x, cu.y);
        const p2 = this.toScreenPoint(cu.x + cu.w, cu.y + cu.h);
        const cx = p1.x;
        const cy = p1.y;
        const cw = p2.x - p1.x;
        const ch = p2.y - p1.y;

        const hovered = this.mouse.x >= cx && this.mouse.x <= cx + cw && this.mouse.y >= cy && this.mouse.y <= cy + ch;
        if (hovered) {
          hoveredCloseup = cu;

          this.ctx.save();
          this.ctx.globalCompositeOperation = 'screen';
          
          const centerX = cx + cw / 2;
          const centerY = cy + ch / 2;
          const maxRadius = Math.max(cw, ch) * 0.7;
          
          // Efeito pulsar orgânico
          const pulse = 0.85 + Math.sin(performance.now() * 0.004) * 0.15;
          const radGrad = this.ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, maxRadius * pulse);
          
          radGrad.addColorStop(0, 'rgba(223, 200, 121, 0.22)');
          radGrad.addColorStop(0.4, 'rgba(223, 200, 121, 0.08)');
          radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          this.ctx.fillStyle = radGrad;
          this.ctx.beginPath();
          this.ctx.arc(centerX, centerY, maxRadius * pulse, 0, Math.PI * 2);
          this.ctx.fill();
          
          // Partículas douradas de poeira
          const time = performance.now();
          for (let i = 0; i < 4; i++) {
            const angle = (time * 0.0012 + i * Math.PI / 2) % (Math.PI * 2);
            const sparkDist = (maxRadius * 0.65) * ((time * 0.0005 + i * 0.25) % 1.0);
            const sx = centerX + Math.cos(angle) * sparkDist;
            const sy = centerY + Math.sin(angle) * sparkDist - (time * 0.02 % 15);
            const sparkSize = 1.2 * (1 - sparkDist / (maxRadius * 0.65));
            
            this.ctx.fillStyle = `rgba(255, 235, 170, ${0.45 * (1 - sparkDist / (maxRadius * 0.65))})`;
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, sparkSize, 0, Math.PI * 2);
            this.ctx.fill();
          }
          this.ctx.restore();
        }
      });
    }

    // 6. Desenha objetos ocultos revelados
    let hoveredItem = null;
    if (room.hiddenObjects) {
      room.hiddenObjects.forEach(obj => {
        if (state.foundObjects.includes(obj.id)) return;

        const p = this.toScreenPoint(obj.x + obj.w / 2, obj.y + obj.h / 2);
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Hover se estiver bem próximo
        if (dist < 32) {
          hoveredItem = obj;
        }

        this.drawObjectMarker(obj, false);
      });
    }

    // 7. Iluminação de Lanterna (Volumetric Shadow Mask)
    this.drawFlashlightOverlay(scene);

    // 8. Efeitos Atmosféricos Ambientais Gerais
    this.drawRainEffect(scene);
    this.drawFloatingDustParticles(scene);
    this.drawLightningOverlay(scene);

    // 9. Caixa de diálogo / vitória gótica
    if (state.isVictory) {
      this.drawVictoryScreen();
      return;
    }

    // 10. Renderiza Tooltips na UI
    if (hoveredPortal) {
      const isLocked = port => port.locked && !state.unlockedPortals.includes(port.id);
      this.drawTooltip(`${hoveredPortal.name}${isLocked(hoveredPortal) ? ' 🔒 (Requer ' + hoveredPortal.itemName + ')' : ' 🚪'}`);
      this.canvas.style.cursor = 'pointer';
    } else if (hoveredItem) {
      this.drawTooltip(`Coletar ${hoveredItem.name} ✨`);
      this.canvas.style.cursor = 'pointer';
    } else if (hoveredCloseup) {
      this.drawTooltip(`Examinar ${hoveredCloseup.name} 🔍`);
      this.canvas.style.cursor = 'zoom-in';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  getCloseupView(cu) {
    const scene = this.getSceneRect();
    const border = 60; // Moldura premium margem
    const aspect = 16 / 9;

    let fw = scene.w - border * 2;
    let fh = fw / aspect;
    if (fh > scene.h - border * 2) {
      fh = scene.h - border * 2;
      fw = fh * aspect;
    }

    const fx = scene.x + (scene.w - fw) / 2;
    const fy = scene.y + (scene.h - fh) / 2;

    const scale = cu.zoomScale || 2.5;
    const cw = 100 / scale;
    const ch = 100 / scale;
    const cx = Math.max(0, Math.min(100 - cw, (cu.zoomX || cu.x) - cw / 2));
    const cy = Math.max(0, Math.min(100 - ch, (cu.zoomY || cu.y) - ch / 2));

    return {
      focus: { x: fx, y: fy, w: fw, h: fh },
      crop: { x: cx, y: cy, w: cw, h: ch }
    };
  }

  drawCloseup(cu, bgImage, closeupImages) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (w <= 0 || h <= 0) return;
    const view = this.getCloseupView(cu);

    // Overlay escuro de fundo
    this.ctx.fillStyle = 'rgba(5, 7, 12, 0.90)';
    this.ctx.fillRect(0, 0, w, h);

    // Renderizar imagem de closeup dedicada de alta definição, ou fall back no crop dinâmico!
    const imagePath = cu.closeupImage;
    const customImg = closeupImages && closeupImages[imagePath];

    if (customImg && customImg.complete) {
      this.ctx.drawImage(customImg, view.focus.x, view.focus.y, view.focus.w, view.focus.h);
    } else if (bgImage && bgImage.complete) {
      const scene = this.getSceneRect();
      const sx = scene.x + (view.crop.x / 100) * scene.w;
      const sy = scene.y + (view.crop.y / 100) * scene.h;
      const sw = (view.crop.w / 100) * scene.w;
      const sh = (view.crop.h / 100) * scene.h;

      this.ctx.drawImage(bgImage, sx, sy, sw, sh, view.focus.x, view.focus.y, view.focus.w, view.focus.h);
    }

    // Moldura Vintage com rebites e acabamento entalhado gótico
    this.ctx.save();
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    this.ctx.shadowBlur = 20;

    // Madeira escura externa
    this.ctx.strokeStyle = '#2b1b11';
    this.ctx.lineWidth = 14;
    this.ctx.strokeRect(view.focus.x - 7, view.focus.y - 7, view.focus.w + 14, view.focus.h + 14);

    // Linha de bronze interna
    this.ctx.shadowBlur = 0;
    this.ctx.strokeStyle = '#8a6f2b';
    this.ctx.lineWidth = 2.5;
    this.ctx.strokeRect(view.focus.x - 1, view.focus.y - 1, view.focus.w + 2, view.focus.h + 2);
    this.ctx.restore();

    // Desenha objetos ocultos no closeup
    let hoveredCloseupItem = null;
    if (cu.objects) {
      cu.objects.forEach(obj => {
        if (state.foundObjects.includes(obj.id)) return;

        const rx = (obj.x - view.crop.x) / view.crop.w;
        const ry = (obj.y - view.crop.y) / view.crop.h;

        if (rx < 0 || rx > 1 || ry < 0 || ry > 1) return;

        const ox = view.focus.x + rx * view.focus.w;
        const oy = view.focus.y + ry * view.focus.h;

        const dx = this.mouse.x - ox;
        const dy = this.mouse.y - oy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 30) {
          hoveredCloseupItem = obj;
        }

        this.drawObjectMarker(obj, true, view);
      });
    }

    // Gerencia e desenha hotspots
    let hoveredHotspot = null;
    if (cu.hotspots) {
      cu.hotspots.forEach(hs => {
        const rx = (hs.x - view.crop.x) / view.crop.w;
        const ry = (hs.y - view.crop.y) / view.crop.h;
        const rw = hs.w / view.crop.w;
        const rh = hs.h / view.crop.h;

        if (rx + rw < 0 || rx > 1 || ry + rh < 0 || ry > 1) return;

        const hx = view.focus.x + rx * view.focus.w;
        const hy = view.focus.y + ry * view.focus.h;
        const hw = rw * view.focus.w;
        const hh = rh * view.focus.h;

        const hovered = this.mouse.x >= hx && this.mouse.x <= hx + hw && this.mouse.y >= hy && this.mouse.y <= hy + hh;
        if (hovered && !state.completedHotspots.includes(hs.id)) {
          hoveredHotspot = hs;

          // Borda do hotspot ativado
          this.ctx.save();
          this.ctx.strokeStyle = hs.locked ? 'rgba(235, 94, 85, 0.55)' : 'rgba(100, 223, 121, 0.55)';
          this.ctx.lineWidth = 2.0;
          this.ctx.strokeRect(hx, hy, hw, hh);
          this.ctx.restore();
        }
      });
    }

    // Desenha o botão de voltar piscante gótico
    this.drawBackButton();

    // Tooltips de Closeup
    if (hoveredCloseupItem) {
      this.drawTooltip(`Coletar ${hoveredCloseupItem.name} ✨`);
      this.canvas.style.cursor = 'pointer';
    } else if (hoveredHotspot) {
      this.drawTooltip(`${hoveredHotspot.name}${hoveredHotspot.locked ? ' 🔒 (Requer ' + hoveredHotspot.itemName + ')' : ' ✓'}`);
      this.canvas.style.cursor = 'pointer';
    } else if (this.isMouseOverBackButton()) {
      this.drawTooltip(`Retornar ao Cenário 🚪`);
      this.canvas.style.cursor = 'pointer';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  drawBackButton() {
    const time = performance.now();
    const bx = 65;
    const by = 65;
    const rad = 24;

    const dx = this.mouse.x - bx;
    const dy = this.mouse.y - by;
    const isHovered = Math.sqrt(dx * dx + dy * dy) < rad;

    this.ctx.save();
    const pulse = 0.75 + Math.sin(time * 0.0035) * 0.25;

    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 3;

    // Selo gótico de vidro
    this.ctx.fillStyle = isHovered ? 'rgba(25, 20, 35, 0.95)' : 'rgba(12, 10, 18, 0.85)';
    this.ctx.strokeStyle = isHovered ? '#ffe8cc' : `rgba(223, 200, 121, ${pulse})`;
    this.ctx.lineWidth = isHovered ? 2.5 : 1.5;

    this.ctx.beginPath();
    this.ctx.arc(bx, by, rad, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Desenha setas góticas em cruz/chevron apontando para a esquerda
    this.ctx.shadowBlur = isHovered ? 8 : 2;
    this.ctx.shadowColor = '#ffe8cc';
    this.ctx.strokeStyle = isHovered ? '#ffffff' : `rgba(255, 232, 204, ${pulse})`;
    this.ctx.lineWidth = 3.0;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(bx + 6, by - 8);
    this.ctx.lineTo(bx - 6, by);
    this.ctx.lineTo(bx + 6, by + 8);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(bx - 6, by);
    this.ctx.lineTo(bx + 9, by);
    this.ctx.stroke();

    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = isHovered ? '#ffffff' : `rgba(189, 160, 67, ${pulse})`;
    this.ctx.font = '10px "Inter", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText('VOLTAR', bx, by + rad + 6);

    this.ctx.restore();
  }

  isMouseOverBackButton() {
    if (!state.currentCloseup) return false;
    const bx = 65;
    const by = 65;
    const rad = 24;
    const dx = this.mouse.x - bx;
    const dy = this.mouse.y - by;
    return Math.sqrt(dx * dx + dy * dy) < rad;
  }

  drawFlashlightOverlay(scene) {
    if (this.canvas.width <= 0 || this.canvas.height <= 0) return;
    this.ctx.save();
    
    // Máscara de escuridão total do cenário
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = this.canvas.width;
    shadowCanvas.height = this.canvas.height;
    const sCtx = shadowCanvas.getContext('2d');

    sCtx.fillStyle = 'rgba(5, 6, 12, 0.94)';
    sCtx.fillRect(scene.x, scene.y, scene.w, scene.h);

    // Corta fenda de luz da lanterna (Radial Light Spotlight)
    sCtx.globalCompositeOperation = 'destination-out';
    const rad = 175;
    const grad = sCtx.createRadialGradient(this.mouse.x, this.mouse.y, 10, this.mouse.x, this.mouse.y, rad);
    grad.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.65)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    sCtx.fillStyle = grad;
    sCtx.beginPath();
    sCtx.arc(this.mouse.x, this.mouse.y, rad, 0, Math.PI * 2);
    sCtx.fill();

    // Desenha máscara
    this.ctx.drawImage(shadowCanvas, 0, 0);

    // Desenha borda/halo amarelado sutil da lâmpada
    this.ctx.globalCompositeOperation = 'screen';
    const borderGrad = this.ctx.createRadialGradient(this.mouse.x, this.mouse.y, rad - 30, this.mouse.x, this.mouse.y, rad + 10);
    borderGrad.addColorStop(0, 'rgba(235, 215, 155, 0.0)');
    borderGrad.addColorStop(0.6, 'rgba(235, 215, 155, 0.12)');
    borderGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    this.ctx.fillStyle = borderGrad;
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y, rad + 10, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  drawRainEffect(scene) {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(156, 180, 210, 0.14)';
    this.ctx.lineWidth = 1.0;
    
    const time = performance.now();
    for (let i = 0; i < 8; i++) {
      const rx = scene.x + ((time * 0.35 + i * 200) % scene.w);
      const ry = scene.y + ((time * 0.85 + i * 150) % scene.h);
      
      this.ctx.beginPath();
      this.ctx.moveTo(rx, ry);
      this.ctx.lineTo(rx - 8, ry + 18);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawFloatingDustParticles(scene) {
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';
    
    const time = performance.now();
    this.particles.forEach(p => {
      // Movimento oscilatório de poeira
      p.y -= p.speedY * 0.25;
      p.x += Math.sin(time * 0.001 + p.phase) * p.speedX * 0.1;

      if (p.y < 0) p.y = 100;
      if (p.x < 0) p.x = 100;
      if (p.x > 100) p.x = 0;

      const px = scene.x + (p.x / 100) * scene.w;
      const py = scene.y + (p.y / 100) * scene.h;

      // Só brilha se estiver próximo da lanterna
      const dx = this.mouse.x - px;
      const dy = this.mouse.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 185) {
        const factor = 1.0 - (dist / 185);
        this.ctx.fillStyle = `rgba(255, 235, 175, ${p.alpha * factor})`;
        this.ctx.beginPath();
        this.ctx.arc(px, py, p.size * (1.0 + factor * 0.5), 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    this.ctx.restore();
  }

  triggerLightning() {
    this.lightningAlpha = 0.88;
  }

  updateLightning() {
    if (this.lightningAlpha > 0.0) {
      this.lightningAlpha -= 0.05 + Math.random() * 0.06;
      if (this.lightningAlpha < 0) this.lightningAlpha = 0.0;
    }
  }

  drawLightningOverlay(scene) {
    if (this.lightningAlpha <= 0.0) return;
    
    this.ctx.save();
    this.ctx.fillStyle = `rgba(235, 245, 255, ${this.lightningAlpha * 0.58})`;
    this.ctx.fillRect(scene.x, scene.y, scene.w, scene.h);
    this.ctx.restore();
  }

  drawObjectMarker(obj, isZoom, view) {
    let x, y;
    if (!isZoom) {
      const p = this.toScreenPoint(obj.x + obj.w / 2, obj.y + obj.h / 2);
      x = p.x;
      y = p.y;
    } else {
      const rx = (obj.x - view.crop.x) / view.crop.w;
      const ry = (obj.y - view.crop.y) / view.crop.h;
      x = view.focus.x + rx * view.focus.w;
      y = view.focus.y + ry * view.focus.h;
    }

    this.ctx.save();
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = '#8a6f2b';

    // Brilho dourado pulsante na base
    const pulse = 0.9 + Math.sin(performance.now() * 0.005) * 0.1;
    const grad = this.ctx.createRadialGradient(x, y, 1, x, y, 12 * pulse);
    grad.addColorStop(0, 'rgba(255, 235, 170, 0.4)');
    grad.addColorStop(0.5, 'rgba(138, 111, 43, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 12 * pulse, 0, Math.PI * 2);
    this.ctx.fill();

    // Pequeno marcador de interrogação piscando muito pequeno
    this.ctx.font = '10px "Courier New"';
    this.ctx.fillStyle = `rgba(255, 232, 170, ${0.4 + Math.sin(performance.now() * 0.007) * 0.3})`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('?', x, y);
    
    this.ctx.restore();
  }

  drawTooltip(text) {
    this.ctx.save();
    this.ctx.font = '14px "Inter", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const tx = this.canvas.width / 2;
    const ty = this.canvas.height - 40;
    const tw = this.ctx.measureText(text).width + 30;
    const th = 30;

    // Fundo pill de vidro fosco escuro
    this.ctx.fillStyle = 'rgba(10, 12, 22, 0.88)';
    this.ctx.strokeStyle = 'rgba(223, 200, 121, 0.38)';
    this.ctx.lineWidth = 1;
    
    this.ctx.beginPath();
    this.ctx.roundRect(tx - tw / 2, ty - th / 2, tw, th, 6);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#ffe8cc';
    this.ctx.fillText(text, tx, ty);
    this.ctx.restore();
  }

  drawVictoryScreen() {
    const scene = this.getSceneRect();
    this.ctx.save();
    
    // Gradiente de fade-out
    const grad = this.ctx.createLinearGradient(scene.x, scene.y, scene.x, scene.y + scene.h);
    grad.addColorStop(0, 'rgba(8, 6, 12, 0.96)');
    grad.addColorStop(1, 'rgba(18, 12, 5, 0.98)');
    
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(scene.x, scene.y, scene.w, scene.h);

    // Texto de Vitória Gótico Centrado
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = '#000000';
    this.ctx.shadowBlur = 12;

    this.ctx.fillStyle = '#dfc879';
    this.ctx.font = '36px "Cinzel", "Times New Roman", serif';
    this.ctx.fillText('ESCAPE CONCLUÍDO', scene.x + scene.w / 2, scene.y + scene.h / 2 - 40);

    this.ctx.fillStyle = '#ffe8cc';
    this.ctx.font = '16px "Inter", sans-serif';
    this.ctx.fillText('Você desvendou os enigmas da Mansão Mistério e encontrou a Chave de Ouro.', scene.x + scene.w / 2, scene.y + scene.h / 2 + 10);
    this.ctx.fillText('A liberdade aguarda você do outro lado dos portões...', scene.x + scene.w / 2, scene.y + scene.h / 2 + 35);

    this.ctx.fillStyle = '#8a6f2b';
    this.ctx.font = '10px "Courier New"';
    this.ctx.fillText('CRÉDITOS: MISTERIO HORROR ENGINE © 2026', scene.x + scene.w / 2, scene.y + scene.h - 40);
    this.ctx.restore();
  }
}
