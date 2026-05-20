/**
 * APP-PAGES.JS (Lógica das telas secundárias: Login e Mapa)
 */
(function () {
  const STORY_ID = "chave_faroleiro_cap01";
  const PLAYER_KEY = `${STORY_ID}.playerName`;
  const STATE_KEY = `${STORY_ID}.storyState`;

  function getPlayerName() {
    return localStorage.getItem(PLAYER_KEY) || '';
  }

  function setPlayerName(name) {
    localStorage.setItem(PLAYER_KEY, name);
  }

  function clearPlayerName() {
    localStorage.removeItem(PLAYER_KEY);
    localStorage.removeItem(STATE_KEY);
  }

  // Limpar dados antigos de histórias anteriores no localStorage
  function clearLegacyStorageKeys() {
    const legacyKeys = [
      'misterio.storyState',
      'cozinha_misteriosa_GDD.playerName',
      'cozinha_misteriosa_GDD.storyState'
    ];
    legacyKeys.forEach(key => localStorage.removeItem(key));
  }

  // A. TELA DE LOGIN
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = document.getElementById('player-name');
      const value = (input.value || '').trim();
      if (!value) return;

      // Limpar dados antigos e começar jogo limpo
      clearLegacyStorageKeys();
      clearPlayerName();
      setPlayerName(value);

      // Redireciona diretamente para a tela unificada de jogo
      window.location.href = 'game.html';
    });
  }

  // B. TELA DE MAPA (Caso mantido ou expandido para novas salas)
  const welcome = document.getElementById('welcome');
  if (welcome) {
    clearLegacyStorageKeys();
    const name = getPlayerName();
    if (!name) {
      window.location.href = 'login.html';
      return;
    }
    welcome.textContent = 'Investigador ativo: ' + name;
  }

  // C. DESCONECTAR / LOGOUT
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      clearPlayerName();
      window.location.href = 'login.html';
    });
  }
})();
