/* ============================================
   MISTERIO - Rooms & Locations Database
   ============================================ */

export const ROOMS = [
  {
    id: 'hall',
    name: 'Hall Principal',
    desc: 'A grande entrada da mansão gótica.',
    image: 'assets/images/hall_principal.png',
    locked: false,
    requiredItems: [],
    narrative: {
      enter: [
        { speaker: 'Investigador', text: 'O ar aqui é gélido... Sinto que estou sendo observado por estes quadros.' },
        { speaker: 'Narrador', text: '*BAM!* A porta de entrada bateu violentamente atrás de você. Está trancada.' }
      ]
    },
    hiddenObjects: [
      { id: 'torn_letter', name: 'Carta Sangrenta', emoji: '✉️', x: 58, y: 76, w: 5, h: 5, found: false },
      { id: 'metal_handle', name: 'Haste de Metal', emoji: '🦯', x: 20, y: 80, w: 5, h: 5, found: false }
    ],
    closeups: [
      {
        id: 'relogio_pendulo',
        name: 'Relógio de Pêndulo',
        desc: 'Um relógio macabro de madeira parada no tempo.',
        x: 35, y: 28, w: 11, h: 46,
        image: 'assets/images/hall_principal.png',
        closeupImage: 'assets/images/relogio_closeup.png',
        zoomScale: 2.8,
        zoomX: 40.5, zoomY: 51,
        objects: [
          { id: 'gear_piece', name: 'Engrenagem Enferrujada', emoji: '⚙️', x: 40.5, y: 55, w: 8, h: 8, found: false }
        ],
        hotspots: [
          {
            id: 'clock_mechanism',
            name: 'Mecanismo de Engrenagens',
            x: 39.5, y: 46.5, w: 2, h: 3,
            locked: true,
            requiredItem: 'crank',
            itemName: 'Manivela Montada',
            unlockMessage: 'Você girou a manivela! Uma gaveta secreta se abre revelando a Chave da Biblioteca 🔑!',
            giveItem: 'library_key'
          }
        ]
      },
      {
        id: 'quadro_hall',
        name: 'O Retrato Sombrio',
        desc: 'Um retrato de família carcomido pelo tempo.',
        x: 8, y: 28, w: 12, h: 18,
        image: 'assets/images/hall_principal.png',
        closeupImage: 'assets/images/quadro_closeup.png',
        zoomScale: 3.2,
        zoomX: 14, zoomY: 37,
        objects: [],
        hotspots: [
          {
            id: 'frame_lock',
            name: 'Fechadura Escondida no Quadro',
            x: 13.5, y: 36, w: 2, h: 3,
            locked: true,
            requiredItem: 'hairpin',
            itemName: 'Grampo de Cabelo',
            unlockMessage: 'Você usou o grampo para destravar a fechadura! Um painel secreto se abre revelando o Pé de Cabra 🔨!',
            giveItem: 'crowbar'
          }
        ]
      },
      {
        id: 'lareira_hall',
        name: 'Lareira Ancestral',
        desc: 'Uma lareira esculpida em pedra com brasas quentes.',
        x: 76, y: 48, w: 14, h: 28,
        image: 'assets/images/hall_principal.png',
        closeupImage: 'assets/images/lareira_closeup.png',
        zoomScale: 2.6,
        zoomX: 83, zoomY: 62,
        objects: [],
        hotspots: [
          {
            id: 'fireplace_coals',
            name: 'Chama Escaldante',
            x: 81, y: 58, w: 4, h: 6,
            locked: true,
            requiredItem: 'water_pitcher',
            itemName: 'Jarro de Água',
            unlockMessage: 'Você joga a água nas chamas! A fumaça dissipa e revela um Medalhão Antigo 🏅!',
            giveItem: 'old_medallion'
          }
        ]
      }
    ],
    portals: [
      { id: 'port_sala_retratos', name: 'Seguir para a Sala de Retratos', x: 21, y: 55, w: 10, h: 30, room: 'sala_retratos', locked: false },
      { id: 'port_biblioteca', name: 'Subir para a Biblioteca', x: 48, y: 45, w: 8, h: 22, room: 'biblioteca', locked: true, requiredItem: 'library_key', itemName: 'Chave da Biblioteca', unlockMessage: 'Você destrancou as portas duplas da Biblioteca! 🚪' },
      { id: 'port_jardim', name: 'Escapar pela Janela Sombria', x: 64, y: 28, w: 10, h: 16, room: 'jardim_abandonado', locked: true, requiredItem: 'crowbar', itemName: 'Pé de Cabra', unlockMessage: 'Você usou o Pé de Cabra para forçar a janela e abri-la! 🍃' }
    ],
    // Sistema Modular de Efeitos de Movimento e Sprites compostos nas cenas!
    layers: [
      {
        id: 'velas_hall_glow',
        type: 'glow',
        condition: () => true,
        render: (ctx, scene, toScreen) => {
          const time = performance.now();
          const flicker1 = 0.92 + Math.sin(time * 0.012) * 0.08;
          const flicker2 = 0.94 + Math.sin(time * 0.017) * 0.06;

          // Desenha brilho de vela na esquerda
          const p1 = toScreen(77.3, 43.2);
          const g1 = ctx.createRadialGradient(p1.x, p1.y, 1, p1.x, p1.y, 22 * flicker1);
          g1.addColorStop(0, 'rgba(255, 175, 50, 0.7)');
          g1.addColorStop(0.3, 'rgba(255, 120, 30, 0.35)');
          g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = g1;
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, 22 * flicker1, 0, Math.PI * 2);
          ctx.fill();

          // Brilho de vela na direita
          const p2 = toScreen(86.8, 43.2);
          const g2 = ctx.createRadialGradient(p2.x, p2.y, 1, p2.x, p2.y, 22 * flicker2);
          g2.addColorStop(0, 'rgba(255, 175, 50, 0.7)');
          g2.addColorStop(0.3, 'rgba(255, 120, 30, 0.35)');
          g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = g2;
          ctx.beginPath();
          ctx.arc(p2.x, p2.y, 22 * flicker2, 0, Math.PI * 2);
          ctx.fill();
        }
      },
      {
        id: 'pendulo_hall',
        type: 'custom',
        condition: () => true,
        render: (ctx, scene, toScreen) => {
          const pivot = toScreen(40.5, 51.5);
          const time = performance.now();
          const angle = Math.sin(time * 0.0028) * 0.14; // Oscilação suave
          const length = 4.8 * (scene.h / 100);
          const bobX = pivot.x + Math.sin(angle) * length;
          const bobY = pivot.y + Math.cos(angle) * length;

          ctx.save();
          ctx.strokeStyle = '#8c7023';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(pivot.x, pivot.y);
          ctx.lineTo(bobX, bobY);
          ctx.stroke();

          ctx.fillStyle = '#bda043';
          ctx.strokeStyle = '#ffe8cc';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(bobX, bobY, 0.7 * (scene.h / 100), 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
      },
      {
        id: 'ponteiros_hall',
        type: 'custom',
        condition: () => true,
        render: (ctx, scene, toScreen) => {
          const center = toScreen(40.5, 50.0);
          const time = performance.now();
          const hourAngle = (time * 0.000008) % (Math.PI * 2);
          const minAngle = (time * 0.00009) % (Math.PI * 2);
          const hrLen = 0.5 * (scene.h / 100);
          const minLen = 0.9 * (scene.h / 100);

          ctx.save();
          ctx.strokeStyle = '#ffe8cc';
          ctx.lineCap = 'round';

          // Ponteiro das Horas
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(center.x, center.y);
          ctx.lineTo(center.x + Math.sin(hourAngle) * hrLen, center.y - Math.cos(hourAngle) * hrLen);
          ctx.stroke();

          // Ponteiro dos Minutos
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(center.x, center.y);
          ctx.lineTo(center.x + Math.sin(minAngle) * minLen, center.y - Math.cos(minAngle) * minLen);
          ctx.stroke();
          ctx.restore();
        }
      },
      {
        id: 'fogo_lareira_flicker',
        type: 'fire',
        condition: (state) => !state.completedHotspots.includes('fireplace_coals'),
        render: (ctx, scene, toScreen) => {
          const time = performance.now();
          const p = toScreen(83.0, 61.5);
          const flicker = 0.88 + Math.sin(time * 0.015) * 0.12;

          ctx.save();
          ctx.globalCompositeOperation = 'screen';

          // Brilho de fogo aquecido radial
          const g = ctx.createRadialGradient(p.x, p.y + 10, 2, p.x, p.y + 10, 48 * flicker);
          g.addColorStop(0, 'rgba(255, 140, 30, 0.72)');
          g.addColorStop(0.4, 'rgba(255, 60, 0, 0.35)');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y + 10, 48 * flicker, 0, Math.PI * 2);
          ctx.fill();

          // Desenhar partículas de faísca subindo do fogo
          for (let i = 0; i < 4; i++) {
            const seed = i * 200;
            const sx = p.x - 15 + ((time * 0.02 + seed) % 30);
            const sy = p.y + 10 - ((time * 0.04 + seed * 2) % 35);
            const size = 1.0 + Math.random() * 1.5;
            ctx.fillStyle = '#ffb347';
            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }
    ]
  },
  {
    id: 'sala_retratos',
    name: 'Sala de Retratos',
    desc: 'Uma galeria gótica coberta de névoa e segredos de família.',
    image: 'assets/images/sala_retratos.png',
    locked: false,
    requiredItems: [],
    hiddenObjects: [
      { id: 'hairpin', name: 'Grampo de Cabelo', emoji: '📌', x: 75, y: 82, w: 5, h: 5, found: false }
    ],
    closeups: [
      {
        id: 'retrato_condessa',
        name: 'O Retrato da Condessa',
        desc: 'O olhar firme e antigo da Condessa parece julgar seus atos.',
        x: 44, y: 26, w: 14, h: 22,
        image: 'assets/images/sala_retratos.png',
        closeupImage: 'assets/images/retrato_condessa_closeup.png',
        zoomScale: 2.8,
        zoomX: 51, zoomY: 37,
        objects: [],
        hotspots: [
          {
            id: 'portrait_socket',
            name: 'Orifício do Medalhão',
            x: 50.5, y: 36, w: 2, h: 3,
            locked: true,
            requiredItem: 'old_medallion',
            itemName: 'Medalhão Antigo',
            unlockMessage: 'O medalhão encaixa perfeitamente! Um painel interno se abre revelando o Alicate Metálico ✂️!',
            giveItem: 'pliers'
          }
        ]
      }
    ],
    portals: [
      { id: 'port_retratos_to_hall', name: 'Voltar ao Hall Principal', x: 5, y: 50, w: 8, h: 40, room: 'hall', locked: false }
    ],
    layers: []
  },
  {
    id: 'biblioteca',
    name: 'Biblioteca Sombria',
    desc: 'Um milhão de tomos de capa de couro mofando nas prateleiras.',
    image: 'assets/images/biblioteca.png',
    locked: false,
    requiredItems: [],
    hiddenObjects: [
      { id: 'water_pitcher', name: 'Jarro de Água', emoji: '🏺', x: 15, y: 74, w: 5, h: 5, found: false }
    ],
    closeups: [
      {
        id: 'cofre_biblioteca',
        name: 'Cofre Embutido',
        desc: 'Um cofre de segredo metálico embutido atrás de uma estante falsa.',
        x: 35, y: 58, w: 12, h: 18,
        image: 'assets/images/biblioteca.png',
        closeupImage: 'assets/images/cofre_closeup.png',
        zoomScale: 3.0,
        zoomX: 41, zoomY: 67,
        objects: [],
        hotspots: [
          {
            id: 'library_safe',
            name: 'Segredo do Cofre',
            x: 40, y: 66, w: 3, h: 4,
            locked: true,
            requiredItem: 'safe_dial',
            itemName: 'Botão de Cofre',
            unlockMessage: 'Você colocou o botão e desvendou o cofre! Dentro há a valiosa Chave de Ouro 🔑!',
            giveItem: 'golden_key'
          }
        ]
      }
    ],
    portals: [
      { id: 'port_bib_to_hall', name: 'Voltar ao Hall Principal', x: 5, y: 55, w: 8, h: 35, room: 'hall', locked: false }
    ],
    layers: []
  },
  {
    id: 'jardim_abandonado',
    name: 'Jardim Abandonado',
    desc: 'Um pátio sombrio cercado de estátuas sob a luz fria do luar.',
    image: 'assets/images/jardim_abandonado.png',
    locked: false,
    requiredItems: [],
    hiddenObjects: [],
    closeups: [
      {
        id: 'estatua_jardim',
        name: 'Fonte da Estátua',
        desc: 'A estátua de um anjo choroso vertendo água na bacia de pedra.',
        x: 44, y: 35, w: 14, h: 45,
        image: 'assets/images/jardim_abandonado.png',
        closeupImage: 'assets/images/estatua_closeup.png',
        zoomScale: 2.4,
        zoomX: 51, zoomY: 58,
        objects: [],
        hotspots: [
          {
            id: 'statue_wires',
            name: 'Fios Enferrujados na Fonte',
            x: 50, y: 56, w: 4, h: 5,
            locked: true,
            requiredItem: 'pliers',
            itemName: 'Alicate Metálico',
            unlockMessage: 'Você corta o arame que travava o dreno da fonte! A água escoa e você resgata o Botão de Cofre ⚙️!',
            giveItem: 'safe_dial'
          }
        ]
      }
    ],
    portals: [
      { id: 'port_jardim_to_hall', name: 'Retornar pela Janela ao Hall', x: 88, y: 50, w: 8, h: 35, room: 'hall', locked: false }
    ],
    layers: [
      {
        id: 'nevoa_jardim',
        type: 'custom',
        condition: () => true,
        render: (ctx, scene) => {
          // Névoa rastejante animada nas camadas inferiores
          const time = performance.now();
          ctx.save();
          ctx.globalAlpha = 0.18;
          ctx.fillStyle = 'rgba(200, 220, 240, 0.4)';
          
          for (let i = 0; i < 3; i++) {
            const shiftX = (time * 0.015 + i * 200) % scene.w;
            ctx.beginPath();
            ctx.arc(scene.x + shiftX, scene.y + scene.h - 50, 80, 0, Math.PI * 2);
            ctx.arc(scene.x + ((shiftX + 300) % scene.w), scene.y + scene.h - 70, 110, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }
    ]
  }
];
