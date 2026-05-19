/* ============================================
   MISTERIO - Main Entry Point (ES6 Module)
   ============================================ */

import { Game } from './engine/core.js';

// Expose Game to the global scope to support inline HTML onclick event bindings
window.Game = Game;

document.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
