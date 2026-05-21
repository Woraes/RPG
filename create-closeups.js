/**
 * CRIAR CLOSEUPS ADICIONAIS
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'assets', 'images');

// 1. Estante de Livros Close-up
const estanteLivrosSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="900" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="900" fill="#2a2a2a"/>
  
  <!-- Estante de madeira -->
  <rect x="100" y="150" width="1000" height="600" fill="#8b6f47" stroke="#5a4a3a" stroke-width="4" rx="5"/>
  
  <!-- Prateleiras -->
  <line x1="100" y1="280" x2="1100" y2="280" stroke="#5a4a3a" stroke-width="3"/>
  <line x1="100" y1="420" x2="1100" y2="420" stroke="#5a4a3a" stroke-width="3"/>
  <line x1="100" y1="560" x2="1100" y2="560" stroke="#5a4a3a" stroke-width="3"/>
  
  <!-- Livros variados -->
  <!-- Prateleira 1 -->
  <rect x="150" y="200" width="40" height="70" fill="#8b1a1a" stroke="#5a4a3a" stroke-width="1"/>
  <text x="170" y="240" font-size="8" fill="#d4af37" text-anchor="middle">I</text>
  
  <rect x="210" y="190" width="50" height="80" fill="#1a4a8b" stroke="#5a4a3a" stroke-width="1"/>
  <text x="235" y="235" font-size="8" fill="#d4af37" text-anchor="middle">II</text>
  
  <rect x="280" y="200" width="45" height="70" fill="#8b7a1a" stroke="#5a4a3a" stroke-width="1"/>
  <text x="302" y="240" font-size="8" fill="#d4af37" text-anchor="middle">III</text>
  
  <!-- Livro com Símbolo de Maré (destaque) -->
  <g transform="translate(380, 190)">
    <rect x="0" y="0" width="60" height="90" fill="#4a3a2a" stroke="#d4af37" stroke-width="2"/>
    <circle cx="30" cy="30" r="25" fill="none" stroke="#d4af37" stroke-width="2"/>
    <path d="M 20 30 Q 25 20 30 30 Q 25 40 20 30" fill="#d4af37"/>
    <path d="M 30 15 Q 35 5 40 15 Q 35 25 30 15" fill="#d4af37"/>
    <path d="M 40 30 Q 45 20 50 30 Q 45 40 40 30" fill="#d4af37"/>
    <text x="30" y="80" font-size="10" fill="#d4af37" text-anchor="middle" font-weight="bold">MARÉ</text>
  </g>
  
  <!-- Mais livros -->
  <rect x="460" y="200" width="35" height="70" fill="#a0522d" stroke="#5a4a3a" stroke-width="1"/>
  <rect x="510" y="205" width="40" height="65" fill="#6b4423" stroke="#5a4a3a" stroke-width="1"/>
  
  <!-- Prateleira 2 -->
  <rect x="180" y="340" width="45" height="75" fill="#2a1a0a" stroke="#5a4a3a" stroke-width="1"/>
  <rect x="240" y="335" width="50" height="80" fill="#4a3a2a" stroke="#5a4a3a" stroke-width="1"/>
  <rect x="310" y="345" width="40" height="70" fill="#8b7a6a" stroke="#5a4a3a" stroke-width="1"/>
  <rect x="370" y="340" width="45" height="75" fill="#3a2a1a" stroke="#5a4a3a" stroke-width="1"/>
  
  <!-- Prateleira 3 -->
  <rect x="200" y="480" width="50" height="75" fill="#6b5344" stroke="#5a4a3a" stroke-width="1"/>
  <rect x="270" y="485" width="40" height="70" fill="#8b4513" stroke="#5a4a3a" stroke-width="1"/>
  <rect x="330" y="480" width="45" height="75" fill="#5a4a3a" stroke="#3a2a1a" stroke-width="1"/>
  <rect x="400" y="480" width="40" height="75" fill="#a0826d" stroke="#5a4a3a" stroke-width="1"/>
  
  <!-- Poeira e deterioração -->
  <ellipse cx="600" cy="240" rx="100" ry="20" fill="rgba(0,0,0,0.15)"/>
  <ellipse cx="400" cy="400" rx="80" ry="15" fill="rgba(0,0,0,0.1)"/>
  <ellipse cx="550" cy="560" rx="120" ry="25" fill="rgba(0,0,0,0.12)"/>
  
  <!-- Iluminação -->
  <ellipse cx="600" cy="200" rx="400" ry="150" fill="rgba(255,255,200,0.08)"/>
  
  <!-- Texto -->
  <text x="600" y="850" font-family="Arial" font-size="18" fill="#999" text-anchor="middle">
    Estante de Livros - Close-up
  </text>
</svg>`;

fs.writeFileSync(path.join(IMAGES_DIR, 'estante_livros_closeup.svg'), estanteLivrosSvg);
console.log(`✓ Criado: estante_livros_closeup.svg`);

// 2. Mesa de Trabalho Close-up
const mesaTrabalhoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="900" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="900" fill="#2a2a2a"/>
  
  <!-- Tampo da Mesa -->
  <rect x="100" y="300" width="1000" height="400" fill="#8b6f47" stroke="#5a4a3a" stroke-width="4" rx="5"/>
  
  <!-- Textura de madeira úmida -->
  <ellipse cx="300" cy="450" rx="150" ry="80" fill="rgba(0,0,0,0.15)"/>
  <ellipse cx="800" cy="500" rx="120" ry="60" fill="rgba(0,0,0,0.1)"/>
  
  <!-- Chave de Fenda (destaque - pegável) -->
  <g transform="translate(350, 400)">
    <!-- Cabo de madeira -->
    <path d="M -8 -40 L -5 50 Q -5 52 -3 52 L 3 52 Q 5 52 5 50 L 8 -40 Q 8 -43 5 -43 L -5 -43 Q -8 -43 -8 -40" 
          fill="#a0826d" stroke="#5a4a3a" stroke-width="1.5"/>
    <!-- Ponta oxidada -->
    <path d="M -3 50 L -2 58 L 0 60 L 2 58 L 3 50" fill="#7a6a5a" stroke="#5a4a3a" stroke-width="1"/>
    <!-- Marca interativa -->
    <circle cx="0" cy="0" r="30" fill="none" stroke="#ffff00" stroke-width="2" opacity="0.5" stroke-dasharray="5,5"/>
  </g>
  
  <!-- Rótulo "Chave de Fenda" -->
  <text x="350" y="520" font-family="Arial" font-size="14" fill="#d4af37" text-anchor="middle">Chave de Fenda</text>
  
  <!-- Mapa da Costa (destaque - pegável) -->
  <g transform="translate(850, 380)">
    <!-- Papel do mapa -->
    <rect x="-50" y="-50" width="100" height="100" fill="#e8d7c3" stroke="#8b7355" stroke-width="1.5" rx="3"/>
    <!-- Dobradura -->
    <polygon points="-50,-50 -30,-50 -50,-30" fill="#d2c1b0"/>
    <!-- Umidade -->
    <ellipse cx="-30" cy="-30" rx="15" ry="10" fill="rgba(0,0,100,0.1)"/>
    <!-- Símbolos -->
    <circle cx="-20" cy="0" r="5" fill="#8b4513"/>
    <circle cx="10" cy="20" r="4" fill="#8b4513" opacity="0.6"/>
    <circle cx="30" cy="-10" r="3" fill="#8b4513" opacity="0.5"/>
    <!-- Linha de costa -->
    <path d="M -40 -20 Q -25 0 -10 -15 Q 5 -5 25 -20" stroke="#8b4513" stroke-width="1.5" fill="none" opacity="0.7"/>
    <!-- Âncora -->
    <text x="0" y="40" font-size="16" fill="#d4af37" text-anchor="middle">⚓</text>
    <!-- Marca interativa -->
    <circle cx="0" cy="0" r="60" fill="none" stroke="#ffff00" stroke-width="2" opacity="0.5" stroke-dasharray="5,5"/>
  </g>
  
  <!-- Rótulo "Mapa" -->
  <text x="850" y="520" font-family="Arial" font-size="14" fill="#d4af37" text-anchor="middle">Mapa da Costa</text>
  
  <!-- Outros itens na mesa (não pegáveis) -->
  <!-- Tinta e penas -->
  <g transform="translate(150, 450)">
    <rect x="0" y="0" width="15" height="40" fill="#4a3a2a" stroke="#8b4513" stroke-width="1"/>
    <circle cx="7.5" cy="-5" r="4" fill="#d4af37"/>
  </g>
  
  <!-- Lamparina -->
  <g transform="translate(600, 420)">
    <circle cx="0" cy="0" r="20" fill="#d4af37" stroke="#8b4513" stroke-width="1.5"/>
    <rect x="-5" y="-25" width="10" height="20" fill="#8b4513" stroke="#5a4a3a" stroke-width="1"/>
    <path d="M -3 -25 L -2 -30 L 0 -32 L 2 -30 L 3 -25" fill="#ffff66" opacity="0.6"/>
  </g>
  
  <!-- Papéis desordenados -->
  <ellipse cx="450" cy="360" rx="80" ry="40" fill="#e8d7c3" stroke="#8b7355" stroke-width="0.5" opacity="0.8"/>
  <ellipse cx="480" cy="355" rx="75" ry="35" fill="#f0e6d6" stroke="#8b7355" stroke-width="0.5" opacity="0.7"/>
  
  <!-- Iluminação -->
  <ellipse cx="600" cy="350" rx="500" ry="200" fill="rgba(255,255,200,0.1)"/>
  
  <!-- Texto -->
  <text x="600" y="850" font-family="Arial" font-size="18" fill="#999" text-anchor="middle">
    Mesa de Trabalho - Close-up
  </text>
</svg>`;

fs.writeFileSync(path.join(IMAGES_DIR, 'mesa_trabalho_closeup.svg'), mesaTrabalhoSvg);
console.log(`✓ Criado: mesa_trabalho_closeup.svg`);

console.log('\n✅ Closeups adicionais criados!');
