/* ============================================
   MISTERIO - Game State Manager (ES6 Module)
   ============================================ */

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.investigatorName = 'Investigador';
    this.currentRoom = 'hall';
    this.currentCloseup = null;
    this.inventory = [];
    this.foundObjects = [];       // IDs de hiddenObjects coletados
    this.completedHotspots = [];   // IDs de hotspots (puzzles) resolvidos
    this.unlockedPortals = [];     // IDs de portais destrancados
    this.journal = [
      { text: 'Cheguei à mansão. As portas se trancaram atrás de mim. Preciso encontrar uma saída.', time: new Date().toLocaleTimeString() }
    ];
    this.hintsRemaining = 3;
    this.isVictory = false;
  }

  addJournal(text) {
    this.journal.push({
      text,
      time: new Date().toLocaleTimeString()
    });
    this.saveToStorage();
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem('misterio_save_v3');
      if (data) {
        const parsed = JSON.parse(data);
        this.investigatorName = parsed.investigatorName || 'Investigador';
        this.currentRoom = parsed.currentRoom || 'hall';
        this.inventory = parsed.inventory || [];
        this.foundObjects = parsed.foundObjects || [];
        this.completedHotspots = parsed.completedHotspots || [];
        this.unlockedPortals = parsed.unlockedPortals || [];
        this.journal = parsed.journal || [];
        this.hintsRemaining = parsed.hintsRemaining ?? 3;
        this.isVictory = parsed.isVictory || false;
        return true;
      }
    } catch (e) {
      console.error('Falha ao carregar save:', e);
    }
    return false;
  }

  saveToStorage() {
    try {
      const data = JSON.stringify({
        investigatorName: this.investigatorName,
        currentRoom: this.currentRoom,
        inventory: this.inventory,
        foundObjects: this.foundObjects,
        completedHotspots: this.completedHotspots,
        unlockedPortals: this.unlockedPortals,
        journal: this.journal,
        hintsRemaining: this.hintsRemaining,
        isVictory: this.isVictory
      });
      localStorage.setItem('misterio_save_v3', data);
    } catch (e) {
      console.error('Falha ao salvar jogo:', e);
    }
  }

  clearStorage() {
    localStorage.removeItem('misterio_save_v3');
    this.reset();
  }
}
export const state = new GameState();
