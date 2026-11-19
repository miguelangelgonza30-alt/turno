(function () {
  'use strict';
  // Si otra web mete Turno en un marco (para engañar con clics), se oculta y se intenta salir del marco.
  if (window.top !== window.self) {
    document.documentElement.style.display = 'none';
    try { window.top.location = window.location.href; } catch (e) {}
  }
  var status = document.getElementById('app-status');
  function connection() {
    var message = '';
    try { TurnoAPI.endpoint(); } catch (error) { message = error.message; }
    if (!message && !navigator.onLine) message = 'Sin conexión. Puedes abrir Turno, pero necesitas conexión para consultar o guardar horas. Si un envío falló, comprueba la semana antes de repetirlo.';
    status.textContent = message;
    status.hidden = !message;
  }
  connection();
  window.addEventListener('online', connection);
  window.addEventListener('offline', connection);
  var pending;
  var install = document.getElementById('pwa-install');
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault(); pending = event; install.hidden = false;
  });
  install.addEventListener('click', async function () {
    if (!pending) return;
    await pending.prompt(); await pending.userChoice;
    pending = null; install.hidden = true;
  });
  window.addEventListener('appinstalled', function () { pending = null; install.hidden = true; });
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.register('./sw.js').catch(function () {
      status.textContent = 'No se pudo preparar el acceso sin conexión. Puedes seguir usando Turno con conexión.';
      status.hidden = false;
    });
  }
})();
