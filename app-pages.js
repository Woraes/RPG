(function () {
  function getPlayerName() {
    return localStorage.getItem('misterio.playerName') || '';
  }

  function setPlayerName(name) {
    localStorage.setItem('misterio.playerName', name);
  }

  function clearPlayerName() {
    localStorage.removeItem('misterio.playerName');
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = document.getElementById('player-name');
      const value = (input.value || '').trim();
      if (!value) return;
      setPlayerName(value);
      window.location.href = 'mapa.html';
    });
  }

  const welcome = document.getElementById('welcome');
  if (welcome) {
    const name = getPlayerName();
    if (!name) {
      window.location.href = 'login.html';
      return;
    }
    welcome.textContent = 'Investigador ativo: ' + name;
  }

  const logout = document.getElementById('logout-btn');
  if (logout) {
    logout.addEventListener('click', function () {
      clearPlayerName();
      window.location.href = 'login.html';
    });
  }
})();
