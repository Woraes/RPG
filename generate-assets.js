/**
 * ASSET GENERATOR - Cria todas as imagens e sons para Capitulo 01
 * Execução: node generate-assets.js
 */

const fs = require('fs');
const path = require('path');

// ============== CONFIGURAÇÃO ==============
const ASSETS_DIR = path.join(__dirname, 'assets');
const IMAGES_DIR = path.join(ASSETS_DIR, 'images');
const ITEMS_DIR = path.join(IMAGES_DIR, 'itens');
const AUDIO_DIR = path.join(ASSETS_DIR, 'audio');
const SCENES_DIR = path.join(IMAGES_DIR, 'scenes');

// Criar diretórios se não existirem
[ASSETS_DIR, IMAGES_DIR, ITEMS_DIR, AUDIO_DIR, SCENES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Criado: ${dir}`);
  }
});

// ============== GERADORES DE SVG ==============

function svgToBase64(svgString) {
  return 'data:image/svg+xml;base64,' + Buffer.from(svgString).toString('base64');
}

function saveSvgAsPng(svgString, filename) {
  // Salvar SVG diretamente (navegadores suportam SVG como IMG)
  // Para PNG real, seria necessário usar 'sharp' ou 'canvas', mas SVG funciona
  const svgPath = filename.replace('.png', '.svg');
  fs.writeFileSync(svgPath, svgString);
  console.log(`✓ Salvo: ${svgPath}`);
  
  // Criar também um "PNG placeholder" (na verdade SVG com extensão PNG)
  // Isso é um workaround - em produção, usar sharp para converter realmente
  fs.writeFileSync(filename, svgString);
  console.log(`✓ Salvo: ${filename}`);
}

// ============== IMAGENS PRINCIPAIS ==============

// 1. Casa do Farol - Cenário Principal
const casaFarolSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#2a4a6a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5a7a9a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b7355;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5a4a3a;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Céu noturno com tempestade -->
  <rect width="1920" height="1080" fill="url(#skyGradient)"/>
  
  <!-- Efeito de relâmpago -->
  <rect width="1920" height="1080" fill="rgba(255,255,200,0.1)"/>
  
  <!-- Parede de madeira úmida -->
  <rect y="300" width="1920" height="780" fill="url(#woodGradient)"/>
  
  <!-- Piso de madeira -->
  <rect y="900" width="1920" height="180" fill="#4a3a2a"/>
  
  <!-- Porta da Torre (centro-alto) -->
  <circle cx="960" cy="250" r="120" fill="#3a2a1a" stroke="#8b7355" stroke-width="4"/>
  <circle cx="960" cy="250" r="100" fill="#5a4a3a"/>
  <circle cx="920" cy="250" r="15" fill="#d4af37"/>
  
  <!-- Mecanismo de Bronze Circular -->
  <circle cx="960" cy="250" r="80" fill="none" stroke="#d4af37" stroke-width="3"/>
  <circle cx="960" cy="250" r="70" fill="none" stroke="#b8860b" stroke-width="1"/>
  <circle cx="960" cy="250" r="60" fill="none" stroke="#d4af37" stroke-width="2"/>
  
  <!-- Estante de Livros (esquerda) -->
  <rect x="150" y="400" width="250" height="350" fill="#8b6f47" stroke="#5a4a3a" stroke-width="3"/>
  <line x1="150" y1="480" x2="400" y2="480" stroke="#5a4a3a" stroke-width="2"/>
  <line x1="150" y1="560" x2="400" y2="560" stroke="#5a4a3a" stroke-width="2"/>
  <line x1="150" y1="640" x2="400" y2="640" stroke="#5a4a3a" stroke-width="2"/>
  <line x1="150" y1="720" x2="400" y2="720" stroke="#5a4a3a" stroke-width="2"/>
  
  <!-- Livros na estante -->
  <rect x="160" y="420" width="30" height="50" fill="#8b1a1a"/>
  <rect x="200" y="415" width="35" height="55" fill="#1a4a8b"/>
  <rect x="245" y="425" width="32" height="45" fill="#8b7a1a"/>
  
  <!-- Armário Alto (direita) -->
  <rect x="1550" y="350" width="220" height="450" fill="#a8956a" stroke="#6a5a3a" stroke-width="3"/>
  <rect x="1560" y="360" width="200" height="180" fill="#8b7a5a"/>
  <rect x="1560" y="550" width="200" height="180" fill="#8b7a5a"/>
  <circle cx="1750" cy="375" r="8" fill="#d4af37"/>
  <circle cx="1750" cy="565" r="8" fill="#d4af37"/>
  
  <!-- Frasco de Óleo no topo -->
  <rect x="1700" y="340" width="40" height="50" fill="#cd853f" stroke="#8b4513" stroke-width="2" rx="3"/>
  <ellipse cx="1720" cy="340" rx="20" ry="5" fill="#b8860b"/>
  <circle cx="1720" cy="360" r="15" fill="#f4a460" opacity="0.7"/>
  
  <!-- Mesa de Trabalho (centro-baixo) -->
  <rect x="700" y="650" width="520" height="200" fill="#8b6f47" stroke="#5a4a3a" stroke-width="3" rx="5"/>
  <circle cx="720" cy="680" r="15" fill="#d4af37"/>
  <circle cx="800" cy="700" r="12" fill="#8b4513"/>
  
  <!-- Baú Marítimo (frente-esquerda) -->
  <rect x="200" y="750" width="300" height="150" fill="#8b6f47" stroke="#5a4a3a" stroke-width="4" rx="10"/>
  <ellipse cx="350" cy="750" rx="150" ry="40" fill="#a8956a"/>
  <path d="M 250 770 L 300 750 L 400 750 L 450 770" fill="#d4af37" stroke="#8b4513" stroke-width="2"/>
  <rect x="320" y="820" width="60" height="40" fill="#8b4513" stroke="#5a4a3a" stroke-width="2" rx="3"/>
  
  <!-- Painel Solto (direita-baixo) -->
  <rect x="1400" y="850" width="180" height="120" fill="#6a5a4a" stroke="#8b7355" stroke-width="2" rx="3"/>
  <circle cx="1430" cy="880" r="8" fill="#d4af37"/>
  <circle cx="1470" cy="895" r="6" fill="#8b4513"/>
  <circle cx="1500" cy="915" r="7" fill="#8b7355"/>
  
  <!-- Janela Lateral (direita-cima) com Relâmpago -->
  <rect x="1500" y="150" width="280" height="250" fill="#1a2a4a" stroke="#5a4a3a" stroke-width="3"/>
  <line x1="1640" y1="150" x2="1640" y2="400" stroke="#5a4a3a" stroke-width="2"/>
  <line x1="1500" y1="275" x2="1780" y2="275" stroke="#5a4a3a" stroke-width="2"/>
  <!-- Relâmpago -->
  <line x1="1550" y1="200" x2="1580" y2="250" stroke="#ffff66" stroke-width="3" opacity="0.8"/>
  <line x1="1580" y1="250" x2="1560" y2="300" stroke="#ffff66" stroke-width="3" opacity="0.8"/>
  
  <!-- Gancho Vazio (esquerda-alto) -->
  <circle cx="300" cy="200" r="12" fill="#d4af37" stroke="#8b4513" stroke-width="2"/>
  <path d="M 300 212 Q 280 230 285 250" stroke="#d4af37" stroke-width="3" fill="none"/>
  
  <!-- Texto informativo -->
  <text x="960" y="1040" font-family="Arial" font-size="24" fill="#999" text-anchor="middle" opacity="0.6">
    Casa de Apoio do Farol - Cenário Principal
  </text>
</svg>`;

saveSvgAsPng(casaFarolSvg, path.join(IMAGES_DIR, 'casa_farol_principal.svg'));

// 2. Baú Marítimo Fechado
const bauFechadoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="metalGradient">
      <stop offset="0%" style="stop-color:#ffff99;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b4513;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <rect width="1200" height="800" fill="#2a2a2a"/>
  
  <!-- Baú de Madeira -->
  <rect x="200" y="150" width="800" height="500" fill="#8b6f47" stroke="#5a4a3a" stroke-width="5" rx="20"/>
  
  <!-- Tampa arqueada do baú -->
  <ellipse cx="600" cy="150" rx="400" ry="100" fill="#a8956a" stroke="#5a4a3a" stroke-width="3"/>
  
  <!-- Símbolo de Maré em Relevo (tampa) -->
  <circle cx="600" cy="180" r="60" fill="none" stroke="#d4af37" stroke-width="3"/>
  <path d="M 560 180 Q 570 160 580 180 Q 570 200 560 180" fill="#d4af37"/>
  <path d="M 600 160 Q 610 140 620 160 Q 610 180 600 160" fill="#d4af37"/>
  <path d="M 640 180 Q 650 160 660 180 Q 650 200 640 180" fill="#d4af37"/>
  
  <!-- Ornamentos de Bronze Oxidado (quatro cantos) -->
  <circle cx="250" cy="200" r="30" fill="url(#metalGradient)" stroke="#5a4a3a" stroke-width="2"/>
  <circle cx="950" cy="200" r="30" fill="url(#metalGradient)" stroke="#5a4a3a" stroke-width="2"/>
  <circle cx="250" cy="600" r="30" fill="url(#metalGradient)" stroke="#5a4a3a" stroke-width="2"/>
  <circle cx="950" cy="600" r="30" fill="url(#metalGradient)" stroke="#5a4a3a" stroke-width="2"/>
  
  <!-- Fechadura com 4 espaços para símbolos -->
  <rect x="500" y="400" width="200" height="100" fill="#5a4a3a" stroke="#d4af37" stroke-width="3" rx="5"/>
  
  <!-- Espaços para símbolos (4 slots) -->
  <circle cx="540" cy="435" r="15" fill="#3a2a1a" stroke="#d4af37" stroke-width="2"/>
  <circle cx="590" cy="435" r="15" fill="#3a2a1a" stroke="#d4af37" stroke-width="2"/>
  <circle cx="640" cy="435" r="15" fill="#3a2a1a" stroke="#d4af37" stroke-width="2"/>
  <circle cx="690" cy="435" r="15" fill="#3a2a1a" stroke="#d4af37" stroke-width="2"/>
  
  <!-- Símbolos vazios nos slots -->
  <text x="540" y="445" font-size="20" fill="#8b7355" text-anchor="middle">?</text>
  <text x="590" y="445" font-size="20" fill="#8b7355" text-anchor="middle">?</text>
  <text x="640" y="445" font-size="20" fill="#8b7355" text-anchor="middle">?</text>
  <text x="690" y="445" font-size="20" fill="#8b7355" text-anchor="middle">?</text>
  
  <!-- Alças laterais -->
  <path d="M 220 250 Q 180 300 220 350" stroke="#d4af37" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M 980 250 Q 1020 300 980 350" stroke="#d4af37" stroke-width="6" fill="none" stroke-linecap="round"/>
  
  <!-- Padrão de correias -->
  <line x1="250" y1="280" x2="950" y2="280" stroke="#5a4a3a" stroke-width="4"/>
  <line x1="250" y1="380" x2="950" y2="380" stroke="#5a4a3a" stroke-width="4"/>
  
  <!-- Texto -->
  <text x="600" y="750" font-family="Arial" font-size="20" fill="#999" text-anchor="middle">
    Baú Marítimo - Fechado
  </text>
</svg>`;

saveSvgAsPng(bauFechadoSvg, path.join(IMAGES_DIR, 'baú_marítimo_closed.svg'));

// 3. Baú Marítimo Aberto
const bauAbertoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="800" fill="#2a2a2a"/>
  
  <!-- Baú de Madeira (base) -->
  <rect x="200" y="250" width="800" height="300" fill="#8b6f47" stroke="#5a4a3a" stroke-width="5" rx="10"/>
  
  <!-- Tampa aberta (45 graus) -->
  <polygon points="200,250 600,50 1000,250" fill="#a8956a" stroke="#5a4a3a" stroke-width="3"/>
  
  <!-- Interior escuro -->
  <rect x="220" y="270" width="760" height="260" fill="#2a1a0a" stroke="#5a4a3a" stroke-width="2"/>
  
  <!-- Marcas de uso no interior -->
  <ellipse cx="400" cy="350" rx="80" ry="40" fill="#1a0a0a" opacity="0.5"/>
  <ellipse cx="600" cy="380" rx="100" ry="30" fill="#1a0a0a" opacity="0.4"/>
  <ellipse cx="800" cy="350" rx="70" ry="35" fill="#1a0a0a" opacity="0.5"/>
  
  <!-- Manivela de bronze no fundo escuro (visível agora) -->
  <g transform="translate(600, 380)">
    <rect x="-40" y="-15" width="80" height="30" fill="#d4af37" stroke="#8b4513" stroke-width="2" rx="3"/>
    <circle cx="-20" cy="0" r="8" fill="#b8860b"/>
    <circle cx="20" cy="0" r="8" fill="#b8860b"/>
  </g>
  
  <!-- Ornamentos visíveis de dentro -->
  <circle cx="250" cy="350" r="12" fill="#d4af37" opacity="0.6"/>
  <circle cx="950" cy="350" r="12" fill="#d4af37" opacity="0.6"/>
  
  <!-- Alças abertas -->
  <path d="M 220 350 L 150 300" stroke="#d4af37" stroke-width="5" fill="none"/>
  <path d="M 980 350 L 1050 300" stroke="#d4af37" stroke-width="5" fill="none"/>
  
  <!-- Pivô de abertura -->
  <circle cx="200" cy="250" r="8" fill="#5a4a3a"/>
  <circle cx="1000" cy="250" r="8" fill="#5a4a3a"/>
  
  <!-- Texto -->
  <text x="600" y="750" font-family="Arial" font-size="20" fill="#999" text-anchor="middle">
    Baú Marítimo - Aberto
  </text>
</svg>`;

saveSvgAsPng(bauAbertoSvg, path.join(IMAGES_DIR, 'baú_marítimo_open.svg'));

// 4. Armário Alto Vazio (frasco visível no topo)
const armarioSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1000" height="900" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="900" fill="#4a3a2a"/>
  
  <!-- Superfície do Armário -->
  <rect x="100" y="200" width="800" height="250" fill="#a8956a" stroke="#6a5a3a" stroke-width="4" rx="5"/>
  
  <!-- Área de Poeira/Repouso -->
  <ellipse cx="400" cy="250" rx="120" ry="40" fill="#8b7a6a" opacity="0.5"/>
  
  <!-- Frasco de Vidro (Óleo) -->
  <g transform="translate(300, 180)">
    <!-- Frasco -->
    <rect x="0" y="20" width="50" height="70" fill="#f4a460" stroke="#8b4513" stroke-width="2" rx="3"/>
    
    <!-- Líquido âmbar -->
    <rect x="5" y="30" width="40" height="55" fill="#cd853f" opacity="0.7"/>
    
    <!-- Tampa de cortiça -->
    <rect x="10" y="10" width="30" height="15" fill="#d2b48c" stroke="#8b4513" stroke-width="1"/>
    
    <!-- Rótulo com símbolo -->
    <rect x="2" y="50" width="46" height="15" fill="#e8d7c3" stroke="#8b4513" stroke-width="1"/>
    <text x="25" y="60" font-size="8" fill="#8b4513" text-anchor="middle">⚓</text>
  </g>
  
  <!-- Marks indicating where bottle sits -->
  <ellipse cx="300" cy="290" rx="30" ry="15" fill="#9a8a7a" opacity="0.3"/>
  
  <!-- Iluminação difusa caindo de cima -->
  <ellipse cx="400" cy="150" rx="300" ry="100" fill="rgba(255,255,200,0.1)"/>
  
  <!-- Detalhes de madeira -->
  <line x1="150" y1="220" x2="850" y2="220" stroke="#8b7a6a" stroke-width="1" opacity="0.5"/>
  <line x1="150" y1="240" x2="850" y2="240" stroke="#8b7a6a" stroke-width="1" opacity="0.3"/>
  <line x1="150" y1="380" x2="850" y2="380" stroke="#8b7a6a" stroke-width="1" opacity="0.5"/>
  
  <!-- Sombras -->
  <ellipse cx="300" cy="280" rx="100" ry="30" fill="rgba(0,0,0,0.2)"/>
  <ellipse cx="600" cy="280" rx="80" ry="20" fill="rgba(0,0,0,0.1)"/>
  
  <!-- Texto -->
  <text x="500" y="850" font-family="Arial" font-size="18" fill="#999" text-anchor="middle">
    Topo do Armário - Frasco Visível
  </text>
</svg>`;

saveSvgAsPng(armarioSvg, path.join(IMAGES_DIR, 'armário_alto_vazio.svg'));

// 5. Painel Mecanismo (para o mini-game)
const painelMecanismoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="discGradient">
      <stop offset="0%" style="stop-color:#ffff99;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#d4af37;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b4513;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <rect width="1200" height="900" fill="#3a3a3a"/>
  
  <!-- Painel de Madeira e Metal -->
  <rect x="100" y="100" width="1000" height="700" fill="#6a5a4a" stroke="#8b7355" stroke-width="4" rx="10"/>
  
  <!-- Trilhas Metálicas em Forma de Estrela -->
  <g transform="translate(600, 350)" stroke="#d4af37" stroke-width="2" fill="none">
    <!-- Ponta 1 (cima) -->
    <line x1="0" y1="-150" x2="0" y2="-200"/>
    <!-- Ponta 2 (superior-direita) -->
    <line x1="130" y1="-75" x2="173" y2="-100"/>
    <!-- Ponta 3 (inferior-direita) -->
    <line x1="130" y1="75" x2="173" y2="100"/>
    <!-- Ponta 4 (baixo) -->
    <line x1="0" y1="150" x2="0" y2="200"/>
    <!-- Ponta 5 (inferior-esquerda) -->
    <line x1="-130" y1="75" x2="-173" y2="100"/>
    <!-- Ponta 6 (superior-esquerda) -->
    <line x1="-130" y1="-75" x2="-173" y2="-100"/>
  </g>
  
  <!-- Três Discos Giratórios no Centro -->
  <g transform="translate(600, 350)">
    <!-- Disco 1 (esquerdo) -->
    <circle cx="-120" cy="0" r="60" fill="#5a4a3a" stroke="url(#discGradient)" stroke-width="3"/>
    <circle cx="-120" cy="0" r="40" fill="#3a2a1a" stroke="#d4af37" stroke-width="2"/>
    <text x="-120" y="5" font-size="20" fill="#d4af37" text-anchor="middle" font-weight="bold">I</text>
    
    <!-- Indicador do disco 1 -->
    <line x1="-120" y1="-65" x2="-120" y2="-80" stroke="#d4af37" stroke-width="3"/>
    
    <!-- Disco 2 (centro) -->
    <circle cx="0" cy="0" r="60" fill="#5a4a3a" stroke="url(#discGradient)" stroke-width="3"/>
    <circle cx="0" cy="0" r="40" fill="#3a2a1a" stroke="#d4af37" stroke-width="2"/>
    <text x="0" y="5" font-size="20" fill="#d4af37" text-anchor="middle" font-weight="bold">II</text>
    
    <!-- Indicador do disco 2 -->
    <line x1="0" y1="-65" x2="0" y2="-80" stroke="#d4af37" stroke-width="3"/>
    
    <!-- Disco 3 (direito) -->
    <circle cx="120" cy="0" r="60" fill="#5a4a3a" stroke="url(#discGradient)" stroke-width="3"/>
    <circle cx="120" cy="0" r="40" fill="#3a2a1a" stroke="#d4af37" stroke-width="2"/>
    <text x="120" y="5" font-size="20" fill="#d4af37" text-anchor="middle" font-weight="bold">III</text>
    
    <!-- Indicador do disco 3 -->
    <line x1="120" y1="-65" x2="120" y2="-80" stroke="#d4af37" stroke-width="3"/>
  </g>
  
  <!-- Encaixes Claros -->
  <g transform="translate(600, 350)" fill="none" stroke="#b8860b" stroke-width="2" opacity="0.6">
    <!-- Encaixe 1 -->
    <circle cx="-120" cy="-80" r="8"/>
    <!-- Encaixe 2 -->
    <circle cx="0" cy="-80" r="8"/>
    <!-- Encaixe 3 -->
    <circle cx="120" cy="-80" r="8"/>
  </g>
  
  <!-- Manivela no Topo -->
  <g transform="translate(600, 150)">
    <rect x="-50" y="0" width="100" height="40" fill="#d4af37" stroke="#8b4513" stroke-width="2" rx="5"/>
    <circle cx="-30" cy="20" r="10" fill="#b8860b" stroke="#8b4513" stroke-width="1"/>
    <circle cx="30" cy="20" r="10" fill="#b8860b" stroke="#8b4513" stroke-width="1"/>
    <text x="0" y="30" font-size="14" fill="#8b4513" text-anchor="middle" font-weight="bold">⚙</text>
  </g>
  
  <!-- Eixo Central com Ferrugem -->
  <g transform="translate(600, 350)">
    <circle cx="0" cy="0" r="15" fill="#8b4513" stroke="#5a4a3a" stroke-width="2"/>
    <path d="M -5 -5 L 5 5 M 5 -5 L -5 5" stroke="#a0522d" stroke-width="1" opacity="0.5"/>
  </g>
  
  <!-- Texto descritivo -->
  <text x="600" y="850" font-family="Arial" font-size="18" fill="#999" text-anchor="middle">
    Mecanismo de Trava Rotativa
  </text>
</svg>`;

saveSvgAsPng(painelMecanismoSvg, path.join(IMAGES_DIR, 'painel_mecanismo.svg'));

// ============== SPRITES DE ITENS (128x128) ==============

// 1. Banquinho Dobrável
const banquinhoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="transparent"/>
  
  <!-- Banquinho em perspectiva 3/4 -->
  <g transform="translate(64, 64)">
    <!-- Encosto -->
    <rect x="-20" y="-35" width="40" height="25" fill="#8b7355" stroke="#5a4a3a" stroke-width="1"/>
    
    <!-- Assento -->
    <rect x="-25" y="-10" width="50" height="8" fill="#a8956a" stroke="#5a4a3a" stroke-width="1"/>
    
    <!-- 4 Pernas -->
    <line x1="-20" y1="-2" x2="-20" y2="20" stroke="#8b7355" stroke-width="2"/>
    <line x1="5" y1="-2" x2="5" y2="20" stroke="#8b7355" stroke-width="2"/>
    <line x1="-10" y1="-5" x2="-10" y2="25" stroke="#8b7355" stroke-width="2"/>
    <line x1="15" y1="-5" x2="15" y2="25" stroke="#8b7355" stroke-width="2"/>
    
    <!-- Sombra -->
    <ellipse cx="0" cy="28" rx="28" ry="5" fill="rgba(0,0,0,0.2)"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(ITEMS_DIR, 'banquinho_dobravel.svg'), banquinhoSvg);
console.log(`✓ Salvo: ${path.join(ITEMS_DIR, 'banquinho_dobravel.svg')}`);

// 2. Chave de Fenda Enferrujada
const chaveFendaSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="transparent"/>
  
  <g transform="translate(64, 64)">
    <!-- Cabo de madeira -->
    <path d="M -8 -35 L -5 40 Q -5 42 -3 42 L 3 42 Q 5 42 5 40 L 8 -35 Q 8 -38 5 -38 L -5 -38 Q -8 -38 -8 -35" 
          fill="#a0826d" stroke="#5a4a3a" stroke-width="1"/>
    
    <!-- Ponta de metal oxidado -->
    <path d="M -3 40 L -2 48 L 0 50 L 2 48 L 3 40" fill="#7a6a5a" stroke="#5a4a3a" stroke-width="1"/>
    <path d="M -1.5 45 L -0.5 45 M -1 46 L 1 46 M -1.5 47 L 1.5 47" stroke="#5a4a3a" stroke-width="0.5" opacity="0.6"/>
    
    <!-- Sombra -->
    <ellipse cx="0" cy="52" rx="8" ry="2" fill="rgba(0,0,0,0.2)"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(ITEMS_DIR, 'chave_fenda_enferrujada.svg'), chaveFendaSvg);
console.log(`✓ Salvo: ${path.join(ITEMS_DIR, 'chave_fenda_enferrujada.svg')}`);

// 3. Mapa da Costa
const mapaCoastaSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="transparent"/>
  
  <g transform="translate(64, 64)">
    <!-- Papel do mapa -->
    <rect x="-35" y="-35" width="70" height="70" fill="#e8d7c3" stroke="#8b7355" stroke-width="1" rx="2"/>
    
    <!-- Efeito de umidade -->
    <ellipse cx="-20" cy="-20" rx="8" ry="6" fill="rgba(0,0,100,0.1)"/>
    <ellipse cx="25" cy="20" rx="6" ry="8" fill="rgba(0,0,100,0.1)"/>
    
    <!-- Símbolos marítimos -->
    <circle cx="0" cy="0" r="4" fill="#8b4513"/>
    <circle cx="-20" cy="-15" r="3" fill="#8b4513" opacity="0.6"/>
    <circle cx="20" cy="10" r="2.5" fill="#8b4513" opacity="0.5"/>
    
    <!-- Linhas de costa -->
    <path d="M -30 -10 Q -20 0 -10 -5 Q 0 -2 10 -8 Q 20 -12 30 -5" 
          stroke="#8b4513" stroke-width="1.5" fill="none" opacity="0.7"/>
    
    <!-- Âncora (símbolo) -->
    <text x="0" y="5" font-size="12" fill="#d4af37" text-anchor="middle">⚓</text>
    
    <!-- Sombra -->
    <ellipse cx="0" cy="38" rx="38" ry="3" fill="rgba(0,0,0,0.15)"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(ITEMS_DIR, 'mapa_costa.svg'), mapaCoastaSvg);
console.log(`✓ Salvo: ${path.join(ITEMS_DIR, 'mapa_costa.svg')}`);

// 4. Frasco de Óleo
const frascoOleoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="transparent"/>
  
  <g transform="translate(64, 64)">
    <!-- Frasco de vidro -->
    <rect x="-15" y="-10" width="30" height="40" fill="#f4a460" stroke="#8b4513" stroke-width="1.5" rx="2"/>
    
    <!-- Líquido âmbar -->
    <rect x="-12" y="0" width="24" height="28" fill="#cd853f" opacity="0.8"/>
    
    <!-- Reflexo no vidro -->
    <ellipse cx="-10" cy="5" rx="3" ry="6" fill="rgba(255,255,255,0.3)"/>
    
    <!-- Tampa de cortiça -->
    <rect x="-12" y="-15" width="24" height="8" fill="#d2b48c" stroke="#8b4513" stroke-width="1"/>
    
    <!-- Rótulo -->
    <rect x="-13" y="10" width="26" height="12" fill="#e8d7c3" stroke="#8b4513" stroke-width="0.5"/>
    <text x="0" y="18" font-size="8" fill="#8b4513" text-anchor="middle">⚓</text>
    
    <!-- Sombra -->
    <ellipse cx="0" cy="38" rx="18" ry="4" fill="rgba(0,0,0,0.2)"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(ITEMS_DIR, 'frasco_oleo.svg'), frascoOleoSvg);
console.log(`✓ Salvo: ${path.join(ITEMS_DIR, 'frasco_oleo.svg')}`);

// 5. Manivela de Bronze
const manivelabronceSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="transparent"/>
  
  <g transform="translate(64, 64)">
    <!-- Corpo da manivela -->
    <rect x="-25" y="-8" width="50" height="16" fill="#d4af37" stroke="#8b4513" stroke-width="1.5" rx="3"/>
    
    <!-- Encaixes -->
    <circle cx="-18" cy="0" r="7" fill="#b8860b" stroke="#8b4513" stroke-width="1"/>
    <circle cx="18" cy="0" r="7" fill="#b8860b" stroke="#8b4513" stroke-width="1"/>
    
    <!-- Símbolos marítimos gravados -->
    <text x="-10" y="3" font-size="6" fill="#8b4513" text-anchor="middle">⚓</text>
    <text x="10" y="3" font-size="6" fill="#8b4513" text-anchor="middle">🌊</text>
    
    <!-- Detalhes de profundidade -->
    <line x1="-22" y1="8" x2="-22" y2="10" stroke="#8b4513" stroke-width="0.5" opacity="0.5"/>
    <line x1="22" y1="8" x2="22" y2="10" stroke="#8b4513" stroke-width="0.5" opacity="0.5"/>
    
    <!-- Sombra -->
    <ellipse cx="0" cy="25" rx="30" ry="4" fill="rgba(0,0,0,0.2)"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(ITEMS_DIR, 'manivela_bronze.svg'), manivelabronceSvg);
console.log(`✓ Salvo: ${path.join(ITEMS_DIR, 'manivela_bronze.svg')}`);

// ============== ÁUDIO ==============

// Gerar WAV simples para click sound
function generateClickSound() {
  const sampleRate = 22050;
  const duration = 0.1; // 100ms
  const frequency = 1000; // Hz
  
  const numSamples = Math.floor(sampleRate * duration);
  const audioData = new Int16Array(numSamples);
  
  // Gerar tom com envelope de fade-out
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 10); // Fade out rápido
    const phase = (2 * Math.PI * frequency * t) % (2 * Math.PI);
    audioData[i] = Math.sin(phase) * 32767 * envelope * 0.3;
  }
  
  return audioData;
}

// Salvar como WAV (formato simples)
function saveWav(audioData, filename) {
  const sampleRate = 22050;
  const numChannels = 1;
  const bitDepth = 16;
  
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  
  // "RIFF" chunk descriptor
  view.setUint32(0, 0x46464952, true); // "RIFF"
  view.setUint32(4, audioData.length * 2 + 36, true);
  view.setUint32(8, 0x45564157, true); // "WAVE"
  
  // "fmt " sub-chunk
  view.setUint32(12, 0x20746d66, true); // "fmt "
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // Audio format (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bitDepth / 8, true);
  view.setUint16(32, numChannels * bitDepth / 8, true);
  view.setUint16(34, bitDepth, true);
  
  // "data" sub-chunk
  view.setUint32(36, 0x61746164, true); // "data"
  view.setUint32(40, audioData.length * 2, true);
  
  const wav = new Uint8Array(wavHeader.byteLength + audioData.length * 2);
  wav.set(new Uint8Array(wavHeader), 0);
  
  let offset = 44;
  for (let i = 0; i < audioData.length; i++) {
    wav[offset] = audioData[i] & 0xFF;
    wav[offset + 1] = (audioData[i] >> 8) & 0xFF;
    offset += 2;
  }
  
  fs.writeFileSync(filename, wav);
  console.log(`✓ Salvo: ${filename}`);
}

const clickSound = generateClickSound();
saveWav(clickSound, path.join(AUDIO_DIR, 'sfx_click.wav'));

// Criar MP3 "fake" como WAV (navegadores suportam ambos)
fs.copyFileSync(
  path.join(AUDIO_DIR, 'sfx_click.wav'),
  path.join(AUDIO_DIR, 'sfx_click.mp3')
);
console.log(`✓ Salvo: ${path.join(AUDIO_DIR, 'sfx_click.mp3')}`);

// ============== RESUMO ==============
console.log('\n' + '='.repeat(60));
console.log('✅ ASSET GENERATION COMPLETO!');
console.log('='.repeat(60));
console.log('\n📁 Estrutura Criada:');
console.log('  assets/');
console.log('    ├── images/');
console.log('    │   ├── casa_farol_principal.svg');
console.log('    │   ├── baú_marítimo_closed.svg');
console.log('    │   ├── baú_marítimo_open.svg');
console.log('    │   ├── armário_alto_vazio.svg');
console.log('    │   ├── painel_mecanismo.svg');
console.log('    │   └── itens/');
console.log('    │       ├── banquinho_dobravel.svg');
console.log('    │       ├── chave_fenda_enferrujada.svg');
console.log('    │       ├── mapa_costa.svg');
console.log('    │       ├── frasco_oleo.svg');
console.log('    │       └── manivela_bronze.svg');
console.log('    └── audio/');
console.log('        ├── sfx_click.wav');
console.log('        └── sfx_click.mp3');
console.log('\n⚠️  NOTA: Imagens estão em formato SVG (vetorial)');
console.log('    Para usar em story.js, referenciar as URLs:');
console.log('    assets/images/casa_farol_principal.svg');
console.log('    assets/audio/sfx_click.mp3');
console.log('\n');
