
  var $ = function (i) { return document.getElementById(i); };
  var sesion = null;      // { id, pin, nombre }
  var claveSup = '';      // solo en memoria, se pierde al cerrar la página
  var alta = null;        // { correo, pin } mientras se confirma el código de registro
  var i18n = window.TurnoI18n, t = i18n.t;
  var dias = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var textosDinamicos = [];
  function textoDinamico(el, renderizar) {
    if (!el.turnoTexto) textosDinamicos.push(el);
    el.turnoTexto = renderizar;
    el.textContent = renderizar();
  }

  // Cada consulta al servidor lleva un número y la sesión del momento en que se pidió:
  // si llega tarde una respuesta vieja (hay otra consulta más nueva o la sesión cambió), se ignora.
  var consultas = { semana: 0, login: 0, supervisor: 0 };
  function pedir(tipo) { return { n: ++consultas[tipo], sesion: sesion ? sesion.id : null }; }
  function vigente(tipo, p) { return p.n === consultas[tipo] && p.sesion === (sesion ? sesion.id : null); }

  var servidor = TurnoAPI.call;
  function recordar(v) { try { v ? localStorage.setItem('horas', JSON.stringify(v)) : localStorage.removeItem('horas'); } catch (e) {} }
  function recordado() { try { return JSON.parse(localStorage.getItem('horas')); } catch (e) { return null; } }
  function hoy() { var d = new Date(); return d.getFullYear() + '-' + dos(d.getMonth() + 1) + '-' + dos(d.getDate()); }
  function dos(n) { return (n < 10 ? '0' : '') + n; }
  function h(n) { return (Math.round(n * 100) / 100).toFixed(2).replace('.', ','); }
  function fechaCorta(iso) { var p = iso.split('-'); return t(dias[new Date(+p[0], +p[1] - 1, +p[2]).getDay()]) + ' ' + p[2] + '/' + p[1]; }
  function aviso(el, texto, tipo) {
    textoDinamico(el, typeof texto === 'function' ? texto : function () { return i18n.serverText(texto); });
    el.className = 'aviso ' + tipo + (el.textContent ? '' : ' oculto');
  }
  function mostrar(panel) {
    ['p-login', 'p-nuevo', 'p-registro', 'p-sup', 'p-ayuda'].forEach(function (p) { $(p).classList.toggle('oculto', p !== panel); });
    $('b-sup').classList.toggle('oculto', panel === 'p-sup'); $('b-ayuda').classList.toggle('oculto', panel === 'p-ayuda');
    window.scrollTo(0, 0);
  }
  function celda(tr, texto, clase) { var td = document.createElement('td'); td.textContent = texto; if (clase) td.className = clase; tr.appendChild(td); }
  function ocupado(boton, si, renderizar) { boton.disabled = si; textoDinamico(boton, renderizar); }
  function fallo(el) { return function () { aviso(el, function () { return t('unconfirmed'); }, 'mal'); }; }
  function ficha(nombre, detalle, foto) {
    $('ficha').classList.toggle('oculto', !nombre); $('b-puerta').classList.toggle('oculto', !nombre);
    if (!nombre) return;
    $('saludo').textContent = nombre; $('saludo-id').textContent = detalle; avatar(nombre, foto);
  }
  // círculo de la cabecera: la foto del empleado o, si no tiene, sus iniciales
  function avatar(nombre, foto) {
    var b = $('inic'); b.textContent = '';
    if (foto) { var im = document.createElement('img'); im.src = foto; im.alt = ''; b.appendChild(im); }
    else b.textContent = nombre.split(' ').slice(0, 2).map(function (p) { return p.charAt(0).toUpperCase(); }).join('');
  }


  // listas de horas de 15 en 15 minutos
  ['entrada', 'salida', 'entrada2', 'salida2'].forEach(function (id) {
    for (var m = 0; m < 1440; m += 15) {
      var o = document.createElement('option'); o.value = o.textContent = dos(Math.floor(m / 60)) + ':' + dos(m % 60); $(id).appendChild(o);
    }
  });
  $('entrada').value = '08:00'; $('salida').value = '17:00'; $('pausa').value = '60';
  // el teléfono recuerda el último horario guardado, para no elegirlo cada día
  $('entrada2').value = '19:00'; $('salida2').value = '23:00';
  function partido(si) {
    $('partido').checked = si; $('tramo2').classList.toggle('oculto', !si);
    $('op-sinpausa').hidden = !si; $('op-sinpausa').disabled = !si;
    if (!si && $('pausa').value === '0') $('pausa').value = '60';
  }
  try {
    var ult = JSON.parse(localStorage.getItem('turno_horario'));
    if (ult) {
      $('entrada').value = ult.e; $('salida').value = ult.s;
      if (ult.e2 && ult.s2) { $('entrada2').value = ult.e2; $('salida2').value = ult.s2; partido(true); }
      $('pausa').value = ult.p;
    }
  } catch (e) {}
  if (!$('entrada').value) $('entrada').value = '08:00';
  if (!$('salida').value) $('salida').value = '17:00';
  if (!$('entrada2').value) $('entrada2').value = '19:00';
  if (!$('salida2').value) $('salida2').value = '23:00';
  if (!$('pausa').value) $('pausa').value = '60';
  $('partido').addEventListener('change', function () { partido(this.checked); if (this.checked) $('pausa').value = '0'; vista(); });

  function minutos(v) { var p = v.split(':'); return +p[0] * 60 + +p[1]; }
  // mismas reglas que el servidor: cada tramo puede acabar pasada la medianoche; tope de 16 horas
  function calcular() {
    var e = minutos($('entrada').value), dur = minutos($('salida').value) - e, noche = dur <= 0;
    if (noche) dur += 1440;
    if ($('partido').checked) {
      var e2 = minutos($('entrada2').value), ini2 = e2 < e ? e2 + 1440 : e2, dur2 = minutos($('salida2').value) - e2;
      if (ini2 < e + dur) return { error: function () { return t('secondTooEarly'); } };
      if (dur2 <= 0) dur2 += 1440;
      if (ini2 + dur2 - e > 1440) return { error: function () { return t('shiftTooLong'); } };
      if (ini2 + dur2 > 1440) noche = true;
      dur += dur2;
    }
    var horas = (dur - +$('pausa').value) / 60;
    if (horas <= 0) return { error: function () { return t('breakTooLong'); } };
    if (horas > 16) return { error: function () { return t('shiftLimit', { n: 16 }); } };
    return { horas: horas, noche: noche };
  }
  function horario(d) { return d.libre ? t('dayOff') : d.entrada + '–' + d.salida + (d.entrada2 ? '\n' + d.entrada2 + '–' + d.salida2 : ''); }
  $('fecha').value = hoy(); $('mes').value = hoy().substring(0, 7);

  function vista() {
    var libre = $('libre').checked, v = $('vista');
    $('horario').classList.toggle('oculto', libre);
    v.className = 'vista';
    var c = libre ? { horas: 0 } : calcular();
    if (c.error) { v.className = 'vista error'; v.textContent = c.error(); return; }
    var etiqueta = document.createElement('span'), total = document.createElement('b');
    etiqueta.textContent = libre ? t('restDay') : t('workedHours') + (c.noche ? t('overnight') : '');
    total.textContent = h(c.horas);
    v.textContent = ''; v.appendChild(etiqueta); v.appendChild(total);
  }
  ['libre', 'entrada', 'salida', 'entrada2', 'salida2', 'pausa'].forEach(function (id) { $(id).addEventListener('change', vista); });
  vista();

  // Un día ya guardado no se puede volver a registrar: el botón queda bloqueado.
  var semanaActual = null;
  function bloqueo() {
    var ya = !!semanaActual && semanaActual.dias.some(function (d) { return d.fecha === $('fecha').value; });
    ocupado($('b-guardar'), ya, function () { return ya ? t('alreadyLogged') : t('save'); });
  }

  function pintarSemana(sem) {
    semanaActual = sem;
    bloqueo();
    traducirSemana(sem);
  }
  function traducirSemana(sem) {
    var tb = $('t-semana'); tb.textContent = '';
    if (!sem.dias.length) { var tr0 = document.createElement('tr'); celda(tr0, t('noWeekRecords'), 'gris'); tr0.firstChild.colSpan = 4; tb.appendChild(tr0); }
    sem.dias.forEach(function (d) {
      var tr = document.createElement('tr');
      celda(tr, fechaCorta(d.fecha));
      celda(tr, horario(d), d.libre ? 'gris' : 'hor');
      celda(tr, h(d.horas));
      celda(tr, h(d.extra), d.extra > 0 ? 'ex' : 'gris');
      tb.appendChild(tr);
    });
    var limite = sem.limite || 40;
    $('s-horas').textContent = h(sem.total.horas); $('s-extra').textContent = h(sem.total.extra); $('s-limite').textContent = limite;
    $('s-barra').style.width = Math.min(100, sem.total.horas / limite * 100) + '%';
    $('s-barra').className = sem.total.horas > limite ? 'pasa' : '';
  }

  function entrar(id, pin, silencioso) {
    ocupado($('b-entrar'), true, function () { return t('signingIn'); });
    var p = pedir('login');
    servidor('api_login', id, pin, $('fecha').value).then(function (r) {
      if (!vigente('login', p)) return;
      ocupado($('b-entrar'), false, function () { return t('signIn'); });
      if (!r.ok) { recordar(null); if (!silencioso) aviso($('m-login'), r.error, 'mal'); mostrar('p-login'); return; }
      aviso($('m-login'), '', 'mal'); abrirSesion(id, r.token || pin, r.nombre, r.semana, r.foto);
    }).catch(function () { if (!vigente('login', p)) return; ocupado($('b-entrar'), false, function () { return t('signIn'); }); fallo($('m-login'))(); });
  }
  function abrirSesion(id, pin, nombre, semana, foto) {
    sesion = { id: id, pin: pin, nombre: nombre, foto: foto || '' }; recordar({ id: id, pin: pin });
    ficha(nombre, 'ID ' + id, sesion.foto);
    aviso($('m-registro'), '', 'ok');
    pintarSemana(semana); mostrar('p-registro');
  }
  $('b-entrar').addEventListener('click', function () { entrar($('id').value.trim(), $('pin').value.trim(), false); });
  $('pin').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('b-entrar').click(); });

  function salir() {
    // aviso al servidor de que la sesión se cierra, sin esperar respuesta
    if (sesion) { try { servidor('api_salir', sesion.id, sesion.pin).then(function () {}, function () {}); } catch (e) {} }
    consultas.semana++; consultas.login++; consultas.supervisor++;
    ocupado($('b-entrar'), false, function () { return t('signIn'); }); ocupado($('b-guardar'), false, function () { return t('save'); }); ocupado($('b-ver'), false, function () { return t('viewHours'); });
    sesion = null; semanaActual = null; recordar(null); $('id').value = ''; $('pin').value = '';
    ficha(''); aviso($('m-registro'), '', 'ok');
    $('fecha').value = hoy(); mostrar('p-login');
  }
  // la puerta de la cabecera pide confirmación antes de cerrar la sesión
  $('b-puerta').addEventListener('click', function () { $('dlg').classList.remove('oculto'); $('dlg-no').focus(); });
  $('dlg-no').addEventListener('click', function () { $('dlg').classList.add('oculto'); });
  $('dlg-si').addEventListener('click', function () { $('dlg').classList.add('oculto'); salir(); });

  // ----- foto del empleado: tocar el círculo abre la cámara o la galería -----
  $('inic').addEventListener('click', function () { if (sesion) $('f-foto').click(); });
  $('f-foto').addEventListener('change', function () {
    var f = this.files && this.files[0]; this.value = '';
    if (!f || !sesion) return;
    var url = URL.createObjectURL(f), im = new Image();
    im.onload = function () {
      var n = 128, c = document.createElement('canvas'), lado = Math.min(im.width, im.height); c.width = c.height = n;
      c.getContext('2d').drawImage(im, (im.width - lado) / 2, (im.height - lado) / 2, lado, lado, 0, 0, n, n);
      URL.revokeObjectURL(url);
      var datos = c.toDataURL('image/jpeg', 0.8), antes = sesion.foto;
      function deshacer(texto) { if (sesion) { sesion.foto = antes; avatar(sesion.nombre, antes); } aviso($('m-registro'), texto, 'mal'); }
      sesion.foto = datos; avatar(sesion.nombre, datos);
      servidor('api_foto', sesion.id, sesion.pin, datos).then(function (r) {
        if (r.ok) aviso($('m-registro'), function () { return t('photoSaved'); }, 'ok'); else deshacer(r.error);
      }).catch(function () { deshacer(function () { return t('unconfirmed'); }); });
    };
    im.onerror = function () { URL.revokeObjectURL(url); aviso($('m-registro'), function () { return t('photoUnreadable'); }, 'mal'); };
    im.src = url;
  });

  // ----- nuevo empleado (dos pasos: datos y código enviado al correo) -----
  function pasoAlta(n) {
    $('nuevo-paso1').classList.toggle('oculto', n !== 1); $('nuevo-paso2').classList.toggle('oculto', n !== 2);
    aviso($('m-nuevo'), '', 'mal');
  }
  $('b-nuevo').addEventListener('click', function () { pasoAlta(1); mostrar('p-nuevo'); });
  $('b-nuevo-volver').addEventListener('click', function () { mostrar('p-login'); });
  $('b-corregir').addEventListener('click', function () { pasoAlta(1); });
  $('b-registrar').addEventListener('click', function () {
    var d = { nombre: $('n-nombre').value.trim(), apellido: $('n-apellido').value.trim(), correo: $('n-correo').value.trim(),
              telefono: $('n-tel').value.replace(/[\s.\-]/g, ''), pin: $('n-pin').value.trim(), invitacion: $('n-inv').value.trim() };
    if (!d.invitacion) { aviso($('m-nuevo'), function () { return t('enterCompanyCode'); }, 'mal'); return; }
    if (!d.nombre || !d.apellido) { aviso($('m-nuevo'), function () { return t('enterName'); }, 'mal'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo)) { aviso($('m-nuevo'), function () { return t('invalidEmail'); }, 'mal'); return; }
    if (!/^\d{8,11}$/.test(d.telefono)) { aviso($('m-nuevo'), function () { return t('invalidPhone'); }, 'mal'); return; }
    if (!/^\d{4,8}$/.test(d.pin)) { aviso($('m-nuevo'), function () { return t('invalidPin'); }, 'mal'); return; }
    if (d.pin !== $('n-pin2').value.trim()) { aviso($('m-nuevo'), function () { return t('pinMismatch'); }, 'mal'); return; }
    if (!$('n-acepto').checked) { aviso($('m-nuevo'), function () { return t('privacyRequired'); }, 'mal'); return; }
    d.acepta = true;
    ocupado($('b-registrar'), true, function () { return t('sendingCode'); });
    servidor('api_registroCodigo', d).then(function (r) {
      ocupado($('b-registrar'), false, function () { return t('sendCode'); });
      if (!r.ok) { aviso($('m-nuevo'), r.error, 'mal'); return; }
      alta = { correo: r.destino, pin: d.pin };
      textoDinamico($('nuevo-destino'), function () { return t('registrationCodeSent', { email: r.destino }); });
      $('n-codigo').value = ''; pasoAlta(2);
    }).catch(function () { ocupado($('b-registrar'), false, function () { return t('sendCode'); }); fallo($('m-nuevo'))(); });
  });
  $('b-confirmar').addEventListener('click', function () {
    if (!alta) { pasoAlta(1); return; }
    ocupado($('b-confirmar'), true, function () { return t('confirming'); });
    servidor('api_registrar', alta.correo, $('n-codigo').value.trim()).then(function (r) {
      ocupado($('b-confirmar'), false, function () { return t('confirmRegistration'); });
      if (!r.ok) { aviso($('m-nuevo'), r.error, 'mal'); return; }
      ['n-inv', 'n-nombre', 'n-apellido', 'n-correo', 'n-tel', 'n-pin', 'n-pin2', 'n-codigo'].forEach(function (i) { $(i).value = ''; });
      $('n-acepto').checked = false;
      var pin = alta.pin; alta = null;
      abrirSesion(r.id, r.token || pin, r.nombre, r.semana);
      aviso($('m-registro'), function () { return t('registered', { id: r.id }); }, 'ok');
    }).catch(function () { ocupado($('b-confirmar'), false, function () { return t('confirmRegistration'); }); fallo($('m-nuevo'))(); });
  });

  $('fecha').addEventListener('change', function () {
    if (!sesion || !$('fecha').value) return;
    aviso($('m-registro'), '', 'ok');
    ocupado($('b-guardar'), true, function () { return t('checking'); });
    var p = pedir('semana');
    servidor('api_semana', sesion.id, sesion.pin, $('fecha').value).then(function (r) {
      if (!vigente('semana', p)) return;
      if (r.ok) pintarSemana(r.semana); else ocupado($('b-guardar'), false, function () { return t('save'); });
    }).catch(function () { if (vigente('semana', p)) ocupado($('b-guardar'), false, function () { return t('save'); }); });
  });

  $('b-guardar').addEventListener('click', function () {
    var d = { fecha: $('fecha').value, libre: $('libre').checked, entrada: $('entrada').value, salida: $('salida').value, pausa: +$('pausa').value };
    if ($('partido').checked && !d.libre) { d.entrada2 = $('entrada2').value; d.salida2 = $('salida2').value; }
    if (!d.fecha) { aviso($('m-registro'), function () { return t('chooseDate'); }, 'mal'); return; }
    if (!d.libre && calcular().error) { aviso($('m-registro'), calcular().error, 'mal'); return; }
    ocupado($('b-guardar'), true, function () { return t('saving'); });
    servidor('api_guardar', sesion.id, sesion.pin, d).then(function (r) {
      ocupado($('b-guardar'), false, function () { return t('save'); });
      if (!r.ok) { aviso($('m-registro'), r.error, 'mal'); if (r.semana) pintarSemana(r.semana); return; }
      aviso($('m-registro'), function () {
        var fecha = fechaCorta(d.fecha);
        if (d.libre) return t('dayOffSaved', { date: fecha });
        var tramos = horario(d).split('\n');
        var texto = tramos.length > 1 ? t('splitSchedule', { first: tramos[0], second: tramos[1] }) : tramos[0];
        return t('shiftSaved', { date: fecha, schedule: texto });
      }, 'ok');
      if (!d.libre) { try { localStorage.setItem('turno_horario', JSON.stringify({ e: d.entrada, s: d.salida, e2: d.entrada2 || '', s2: d.salida2 || '', p: String(d.pausa) })); } catch (e) {} }
      $('libre').checked = false; vista(); pintarSemana(r.semana);
    }).catch(function () { ocupado($('b-guardar'), false, function () { return t('save'); }); fallo($('m-registro'))(); });
  });

  // ----- supervisor -----
  $('b-sup').addEventListener('click', function () { ficha(''); mostrar('p-sup'); });
  $('b-volver').addEventListener('click', function () {
    claveSup = ''; $('clave').value = ''; $('sup-clave').classList.remove('oculto'); $('sup-datos').classList.add('oculto');
    $('sup-rec').classList.add('oculto'); $('b-olvido').classList.remove('oculto');
    supDatos = null; $('sup-emp-caja').classList.add('oculto');
    aviso($('m-sup'), '', 'mal'); if (sesion) ficha(sesion.nombre, 'ID ' + sesion.id, sesion.foto);
    mostrar(sesion ? 'p-registro' : 'p-login');
  });
  $('b-olvido').addEventListener('click', function () {
    ocupado($('b-olvido'), true, function () { return t('sendingCode'); });
    servidor('api_recuperar').then(function (r) {
      ocupado($('b-olvido'), false, function () { return t('forgotPassword'); });
      if (!r.ok) { aviso($('m-sup'), r.error, 'mal'); return; }
      aviso($('m-sup'), function () { return t('supervisorCodeSent', { email: r.destino }); }, 'ok');
      $('sup-rec').classList.remove('oculto');
    }).catch(function () { ocupado($('b-olvido'), false, function () { return t('forgotPassword'); }); fallo($('m-sup'))(); });
  });
  $('b-cambiar').addEventListener('click', function () {
    ocupado($('b-cambiar'), true, function () { return t('changing'); });
    servidor('api_nuevaClave', $('r-codigo').value.trim(), $('r-clave').value).then(function (r) {
      ocupado($('b-cambiar'), false, function () { return t('changePassword'); });
      if (!r.ok) { aviso($('m-sup'), r.error, 'mal'); return; }
      $('r-codigo').value = ''; $('r-clave').value = ''; $('sup-rec').classList.add('oculto'); claveSup = '';
      $('sup-clave').classList.remove('oculto');
      aviso($('m-sup'), function () { return t('passwordChanged'); }, 'ok');
    }).catch(function () { ocupado($('b-cambiar'), false, function () { return t('changePassword'); }); fallo($('m-sup'))(); });
  });
  $('b-ver').addEventListener('click', function () {
    var clave = claveSup || $('clave').value;
    if (!clave || !$('mes').value) { aviso($('m-sup'), function () { return t('needPasswordAndMonth'); }, 'mal'); return; }
    var mesPedido = $('mes').value;
    ocupado($('b-ver'), true, function () { return t('loading'); });
    var p = pedir('supervisor');
    servidor('api_supervisor', clave, mesPedido).then(function (r) {
      if (!vigente('supervisor', p)) return;
      ocupado($('b-ver'), false, function () { return t('viewHours'); });
      if (!r.ok) { $('sup-datos').classList.add('oculto'); aviso($('m-sup'), r.error, 'mal'); return; }
      claveSup = r.ficha || clave; $('clave').value = ''; $('sup-clave').classList.add('oculto'); aviso($('m-sup'), '', 'mal');
      $('b-olvido').classList.add('oculto'); $('sup-rec').classList.add('oculto');
      supDatos = r; supMes = mesPedido; $('sup-inv').textContent = r.invitacion || ''; aviso($('m-exp'), '', 'ok'); llenarEmpleados(r.lista || []); pintarSup();
      $('sup-emp-caja').classList.remove('oculto'); $('sup-datos').classList.remove('oculto');
    }).catch(function () { if (!vigente('supervisor', p)) return; ocupado($('b-ver'), false, function () { return t('viewHours'); }); fallo($('m-sup'))(); });
  });

  // El supervisor elige un empleado y ve solo sus horas del mes; "Todos" muestra el resumen general.
  var supDatos = null, supMes = '';
  $('b-exportar').addEventListener('click', function () {
    if (!claveSup || !supMes) return;
    ocupado($('b-exportar'), true, function () { return t('sending'); });
    servidor('api_exportar', claveSup, supMes).then(function (r) {
      ocupado($('b-exportar'), false, function () { return t('sendSummary'); });
      var mesEnviado = supMes;
      aviso($('m-exp'), r.ok ? function () { return t('summarySent', { month: mesEnviado, email: r.destino }); } : r.error, r.ok ? 'ok' : 'mal');
    }).catch(function () { ocupado($('b-exportar'), false, function () { return t('sendSummary'); }); fallo($('m-exp'))(); });
  });
  function llenarEmpleados(lista) {
    var sel = $('sup-emp'), antes = sel.value; sel.textContent = '';
    lista.forEach(function (e) {
      var o = document.createElement('option'); o.value = e.id; o.textContent = e.nombre + ' (' + e.id + ')'; o.setAttribute('data-nombre', e.nombre); sel.appendChild(o);
    });
    var todos = document.createElement('option'); todos.value = 'todos'; todos.textContent = t('allEmployees'); sel.appendChild(todos);
    if (antes && sel.querySelector('option[value="' + antes + '"]')) sel.value = antes;
  }
  function pintarSup() {
    if (!supDatos) return;
    var sel = $('sup-emp').value, uno = sel !== 'todos';
    var emps = supDatos.empleados.filter(function (e) { return !uno || String(e.id) === sel; });
    var regs = supDatos.registros.filter(function (d) { return !uno || String(d.id) === sel; });
    if (uno && !emps.length) {
      var op = $('sup-emp').options[$('sup-emp').selectedIndex];
      emps = [{ id: sel, nombre: op ? op.getAttribute('data-nombre') : '', horas: 0, normales: 0, extra: 0, libres: 0, dias: 0 }];
    }
    var a = $('t-resumen'), b = $('t-registros'), horas = 0, normales = 0, extra = 0; a.textContent = ''; b.textContent = '';
    emps.forEach(function (e) {
      var tr = document.createElement('tr'); horas += e.horas; normales += e.normales; extra += e.extra;
      celda(tr, e.nombre + ' (' + e.id + ')'); celda(tr, e.dias); celda(tr, e.libres);
      celda(tr, h(e.horas)); celda(tr, h(e.normales)); celda(tr, h(e.extra), e.extra > 0 ? 'ex' : 'gris');
      a.appendChild(tr);
    });
    if (!regs.length) { var v = document.createElement('tr'); celda(v, t('noMonthRecords'), 'gris'); v.firstChild.colSpan = 7; b.appendChild(v); }
    regs.forEach(function (d) {
      var tr = document.createElement('tr');
      celda(tr, fechaCorta(d.fecha) + (d.festivo ? t('publicHoliday') : '')); celda(tr, d.id); celda(tr, d.nombre);
      celda(tr, horario(d), d.libre ? 'gris' : 'hor');
      celda(tr, d.libre ? '' : t('minutes', { n: d.pausa })); celda(tr, h(d.horas)); celda(tr, h(d.extra), d.extra > 0 ? 'ex' : 'gris');
      b.appendChild(tr);
    });
    $('sup-titulo').textContent = uno ? t('employeeSummary') : t('employeeSummaries');
    $('k-t1').textContent = uno ? t('hours') : t('employees'); $('k-emp').textContent = uno ? h(horas) : emps.length;
    $('k-t2').textContent = uno ? t('regularHours') : t('hours'); $('k-horas').textContent = uno ? h(normales) : h(horas);
    $('k-extra').textContent = h(extra);
  }
  $('sup-emp').addEventListener('change', pintarSup);

  // ----- ayuda: recuperar acceso y enviar reportes -----
  var rpCorreo = '';
  function pasoRp(n) { $('rp-1').classList.toggle('oculto', n !== 1); $('rp-2').classList.toggle('oculto', n !== 2); }
  $('b-ayuda').addEventListener('click', function () {
    aviso($('m-rp'), '', 'ok'); aviso($('m-rep'), '', 'ok'); pasoRp(1); mostrar('p-ayuda');
  });
  $('b-ayuda-volver').addEventListener('click', function () { mostrar(sesion ? 'p-registro' : 'p-login'); });
  $('b-rp-enviar').addEventListener('click', function () {
    var correo = $('rp-correo').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) { aviso($('m-rp'), function () { return t('invalidEmail'); }, 'mal'); return; }
    ocupado($('b-rp-enviar'), true, function () { return t('sendingCode'); });
    servidor('api_recuperarAcceso', correo).then(function (r) {
      ocupado($('b-rp-enviar'), false, function () { return t('sendCode'); });
      if (!r.ok) { aviso($('m-rp'), r.error, 'mal'); return; }
      rpCorreo = correo; $('rp-codigo').value = ''; $('rp-pin').value = ''; $('rp-pin2').value = ''; pasoRp(2);
      aviso($('m-rp'), function () { return t('recoveryEmailSent'); }, 'ok');
    }).catch(function () { ocupado($('b-rp-enviar'), false, function () { return t('sendCode'); }); fallo($('m-rp'))(); });
  });
  $('b-rp-cambiar').addEventListener('click', function () {
    var pin = $('rp-pin').value.trim();
    if (!/^\d{4,8}$/.test(pin)) { aviso($('m-rp'), function () { return t('invalidPin'); }, 'mal'); return; }
    if (pin !== $('rp-pin2').value.trim()) { aviso($('m-rp'), function () { return t('pinMismatch'); }, 'mal'); return; }
    ocupado($('b-rp-cambiar'), true, function () { return t('changing'); });
    servidor('api_nuevoPin', rpCorreo, $('rp-codigo').value.trim(), pin).then(function (r) {
      ocupado($('b-rp-cambiar'), false, function () { return t('changePin'); });
      if (!r.ok) { aviso($('m-rp'), r.error, 'mal'); return; }
      pasoRp(1); $('rp-correo').value = '';
      if (sesion) {
        if (String(sesion.id) === String(r.id)) { sesion.pin = r.token || pin; recordar({ id: sesion.id, pin: sesion.pin }); }
        aviso($('m-rp'), function () { return t('pinChanged', { id: r.id }); }, 'ok'); return;
      }
      $('id').value = r.id; $('pin').value = ''; mostrar('p-login');
      aviso($('m-login'), function () { return t('pinChangedSignIn', { id: r.id }); }, 'ok');
    }).catch(function () { ocupado($('b-rp-cambiar'), false, function () { return t('changePin'); }); fallo($('m-rp'))(); });
  });
  $('b-rep').addEventListener('click', function () {
    var d = { tipo: $('rep-tipo').value, mensaje: $('rep-msg').value.trim(), contacto: $('rep-contacto').value.trim(),
              id: sesion ? sesion.id : $('id').value.trim(), dispositivo: navigator.userAgent };
    if (d.mensaje.length < 10) { aviso($('m-rep'), function () { return t('reportTooShort'); }, 'mal'); return; }
    ocupado($('b-rep'), true, function () { return t('sending'); });
    servidor('api_reporte', d).then(function (r) {
      ocupado($('b-rep'), false, function () { return t('sendReport'); });
      if (!r.ok) { aviso($('m-rep'), r.error, 'mal'); return; }
      $('rep-msg').value = ''; aviso($('m-rep'), function () { return t('reportSent'); }, 'ok');
    }).catch(function () { ocupado($('b-rep'), false, function () { return t('sendReport'); }); fallo($('m-rep'))(); });
  });

  var estadoPwa = $('app-status'), estadoOriginal = '', estadoTraducido = '';
  function traducirEstadoPwa() {
    if (estadoPwa.textContent !== estadoTraducido) estadoOriginal = estadoPwa.textContent;
    estadoTraducido = i18n.serverText(estadoOriginal);
    if (estadoPwa.textContent !== estadoTraducido) estadoPwa.textContent = estadoTraducido;
  }
  if (window.MutationObserver) {
    new window.MutationObserver(traducirEstadoPwa).observe(estadoPwa, { childList: true });
  }

  var empresa = '';
  function traducirPantalla() {
    i18n.apply(document);
    $('idioma').value = i18n.language();
    try { $('hoy').textContent = i18n.longDate(new Date()); } catch (e) {}
    if (empresa) {
      $('empresa').textContent = empresa;
      $('priv-empresa').textContent = empresa;
      document.title = 'Turno · ' + empresa;
    } else if (empresaPredeterminada) {
      document.title = t('footer');
    }
    textosDinamicos.forEach(function (el) { el.textContent = el.turnoTexto(); });
    traducirEstadoPwa();
    vista();
    if (semanaActual) traducirSemana(semanaActual);
    if (supDatos) {
      $('sup-emp').querySelector('option[value="todos"]').textContent = t('allEmployees');
      pintarSup();
    }
  }
  var empresaPredeterminada = false;
  $('idioma').addEventListener('change', function () {
    i18n.setLanguage(this.value);
    traducirPantalla();
  });

  // ----- arranque -----
  traducirPantalla();
  servidor('api_inicio').then(function (r) {
    empresaPredeterminada = r.empresa === i18n.dictionaries.es.hoursControl;
    empresa = empresaPredeterminada ? '' : r.empresa;
    traducirPantalla();
  }).catch(function () {});
  var guardado = recordado();
  if (guardado && guardado.id && guardado.pin) { $('id').value = guardado.id; entrar(guardado.id, guardado.pin, true); }

