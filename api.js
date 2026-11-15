(function (root) {
  'use strict';
  function endpoint() {
    var url = (root.TURNO_CONFIG || {}).apiUrl || '';
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url)) {
      throw new Error('Configura la URL /exec de Apps Script en config.js.');
    }
    return url;
  }
  async function call(fn) {
    var url = endpoint();
    if (root.navigator && root.navigator.onLine === false) throw new Error('Sin conexión.');
    var args = Array.prototype.slice.call(arguments, 1);
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 60000);
    try {
      var response = await root.fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ fn: fn, args: args }), credentials: 'omit',
        redirect: 'follow', cache: 'no-store', signal: controller.signal
      });
      if (!response.ok) throw new Error('El servidor no está disponible.');
      var envelope = await response.json();
      if (!envelope || typeof envelope.ok !== 'boolean') throw new Error('Respuesta del servidor no válida.');
      if (!envelope.ok) throw new Error(envelope.error || 'Error del servidor.');
      return envelope.res;
    } finally { clearTimeout(timer); }
  }
  root.TurnoAPI = { call: call, endpoint: endpoint };
})(typeof window === 'undefined' ? globalThis : window);
