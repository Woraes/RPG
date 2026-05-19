(function () {
  function getPlayerName() {
    return localStorage.getItem('misterio.playerName') || '';
  }

  function setPlayerName(name) {
    localStorage.setItem('misterio.playerName', name);
  }

  function clearPlayerName() {
    localStorage.removeItem('misterio.playerName');
    localStorage.removeItem('misterio.storyState');
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = document.getElementById('player-name');
      const value = (input.value || '').trim();
      if (!value) return;
      localStorage.removeItem('misterio.storyState');
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

    let storyState = {};
    try {
      storyState = JSON.parse(localStorage.getItem('misterio.storyState') || '{}') || {};
    } catch (error) {
      storyState = {};
    }
    const flags = storyState.flags || {};
    const roomLocks = {
      'biblioteca.html': !flags.libraryDoorOpen,
      'jardim.html': !flags.gardenWindowOpen,
      'laboratorio.html': true,
      'sotao.html': true
    };

    document.querySelectorAll('.room-card').forEach(function (card) {
      const href = card.getAttribute('href');
      if (!roomLocks[href]) return;
      card.classList.add('locked');
      card.setAttribute('aria-disabled', 'true');
      card.addEventListener('click', function (event) {
        event.preventDefault();
      });
    });
  }

  const logout = document.getElementById('logout-btn');
  if (logout) {
    logout.addEventListener('click', function () {
      clearPlayerName();
      window.location.href = 'login.html';
    });
  }
})();
