
  var $ = function (i) { return document.getElementById(i); };
  var sesion = null;      // { id, pin, nombre }
  var claveSup = '';      // solo en memoria, se pierde al cerrar la página
  var alta = null;        // { correo, pin } mientras se confirma el código de registro
  var DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  var servidor = TurnoAPI.call;
  function recordar(v) { try { v ? localStorage.setItem('horas', JSON.stringify(v)) : localStorage.removeItem('horas'); } catch (e) {} }
  function recordado() { try { return JSON.parse(localStorage.getItem('horas')); } catch (e) { return null; } }
  function hoy() { var d = new Date(); return d.getFullYear() + '-' + dos(d.getMonth() + 1) + '-' + dos(d.getDate()); }
  function dos(n) { return (n < 10 ? '0' : '') + n; }
  function h(n) { return (Math.round(n * 100) / 100).toFixed(2).replace('.', ','); }
  function fechaCorta(iso) { var p = iso.split('-'); return DIAS[new Date(+p[0], +p[1] - 1, +p[2]).getDay()] + ' ' + p[2] + '/' + p[1]; }
  function aviso(el, texto, tipo) { el.textContent = texto; el.className = 'aviso ' + tipo + (texto ? '' : ' oculto'); }
  function mostrar(panel) {
    ['p-login', 'p-nuevo', 'p-registro', 'p-sup', 'p-ayuda'].forEach(function (p) { $(p).classList.toggle('oculto', p !== panel); });
    $('b-sup').classList.toggle('oculto', panel === 'p-sup'); $('b-ayuda').classList.toggle('oculto', panel === 'p-ayuda');
    window.scrollTo(0, 0);
  }
  function celda(tr, texto, clase) { var td = document.createElement('td'); td.textContent = texto; if (clase) td.className = clase; tr.appendChild(td); }
  function ocupado(boton, si, texto) { boton.disabled = si; boton.textContent = texto; }
  function fallo(el) { return function () { aviso(el, 'No se pudo confirmar la respuesta del servidor. Si estabas guardando horas, comprueba la semana antes de volver a enviarlas.', 'mal'); }; }
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

  try { $('hoy').textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) {}

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
      if (ini2 < e + dur) return { error: 'La segunda parte debe empezar después de terminar la primera.' };
      if (dur2 <= 0) dur2 += 1440;
      if (ini2 + dur2 - e > 1440) return { error: 'El turno completo no puede durar más de 24 horas.' };
      if (ini2 + dur2 > 1440) noche = true;
      dur += dur2;
    }
    var horas = (dur - +$('pausa').value) / 60;
    if (horas <= 0) return { error: 'La pausa no puede ser mayor que el turno.' };
    if (horas > 16) return { error: 'Un turno no puede pasar de 16 horas. Revisa la entrada y la salida.' };
    return { horas: horas, noche: noche };
  }
  function horario(d) { return d.libre ? 'Día libre' : d.entrada + '–' + d.salida + (d.entrada2 ? '\n' + d.entrada2 + '–' + d.salida2 : ''); }
  $('fecha').value = hoy(); $('mes').value = hoy().substring(0, 7);

  function vista() {
    var libre = $('libre').checked, v = $('vista');
    $('horario').classList.toggle('oculto', libre);
    v.className = 'vista';
    if (libre) { v.innerHTML = '<span>Día de descanso</span><b>0,00</b>'; return; }
    var c = calcular();
    if (c.error) { v.className = 'vista error'; v.textContent = c.error; }
    else { v.innerHTML = '<span>Horas trabajadas' + (c.noche ? ' · sale al día siguiente' : '') + '</span><b>' + h(c.horas) + '</b>'; }
  }
  ['libre', 'entrada', 'salida', 'entrada2', 'salida2', 'pausa'].forEach(function (id) { $(id).addEventListener('change', vista); });
  vista();

  // Un día ya guardado no se puede volver a registrar: el botón queda bloqueado.
  var semanaActual = null;
  function bloqueo() {
    var ya = !!semanaActual && semanaActual.dias.some(function (d) { return d.fecha === $('fecha').value; });
    ocupado($('b-guardar'), ya, ya ? 'Día ya registrado' : 'Guardar');
  }

  function pintarSemana(sem) {
    semanaActual = sem;
    bloqueo();
    var tb = $('t-semana'); tb.textContent = '';
    if (!sem.dias.length) { var tr0 = document.createElement('tr'); celda(tr0, 'Sin registros esta semana', 'gris'); tr0.firstChild.colSpan = 4; tb.appendChild(tr0); }
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
    ocupado($('b-entrar'), true, 'Entrando…');
    servidor('api_login', id, pin, $('fecha').value).then(function (r) {
      ocupado($('b-entrar'), false, 'Entrar');
      if (!r.ok) { recordar(null); if (!silencioso) aviso($('m-login'), r.error, 'mal'); mostrar('p-login'); return; }
      aviso($('m-login'), '', 'mal'); abrirSesion(id, r.token || pin, r.nombre, r.semana, r.foto);
    }).catch(function () { ocupado($('b-entrar'), false, 'Entrar'); fallo($('m-login'))(); });
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
        if (r.ok) aviso($('m-registro'), 'Foto guardada.', 'ok'); else deshacer(r.error);
      }).catch(function () { deshacer('No se pudo confirmar la respuesta del servidor. Si estabas guardando horas, comprueba la semana antes de volver a enviarlas.'); });
    };
    im.onerror = function () { URL.revokeObjectURL(url); aviso($('m-registro'), 'No se pudo leer la imagen.', 'mal'); };
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
    if (!d.invitacion) { aviso($('m-nuevo'), 'Escribe el código de la empresa. Te lo da tu supervisor.', 'mal'); return; }
    if (!d.nombre || !d.apellido) { aviso($('m-nuevo'), 'Escribe tu nombre y tu apellido.', 'mal'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo)) { aviso($('m-nuevo'), 'Escribe un correo electrónico válido.', 'mal'); return; }
    if (!/^\d{8,11}$/.test(d.telefono)) { aviso($('m-nuevo'), 'Escribe tu teléfono sin el +39, solo números.', 'mal'); return; }
    if (!/^\d{4,8}$/.test(d.pin)) { aviso($('m-nuevo'), 'El PIN debe tener de 4 a 8 cifras.', 'mal'); return; }
    if (d.pin !== $('n-pin2').value.trim()) { aviso($('m-nuevo'), 'Los dos PIN no coinciden.', 'mal'); return; }
    if (!$('n-acepto').checked) { aviso($('m-nuevo'), 'Debes aceptar el aviso de privacidad para registrarte.', 'mal'); return; }
    d.acepta = true;
    ocupado($('b-registrar'), true, 'Enviando código…');
    servidor('api_registroCodigo', d).then(function (r) {
      ocupado($('b-registrar'), false, 'Enviar código');
      if (!r.ok) { aviso($('m-nuevo'), r.error, 'mal'); return; }
      alta = { correo: r.destino, pin: d.pin };
      $('nuevo-destino').textContent = 'Enviamos un código a ' + r.destino + '. Escríbelo para terminar. Si no lo ves, revisa la carpeta de spam.';
      $('n-codigo').value = ''; pasoAlta(2);
    }).catch(function () { ocupado($('b-registrar'), false, 'Enviar código'); fallo($('m-nuevo'))(); });
  });
  $('b-confirmar').addEventListener('click', function () {
    if (!alta) { pasoAlta(1); return; }
    ocupado($('b-confirmar'), true, 'Confirmando…');
    servidor('api_registrar', alta.correo, $('n-codigo').value.trim()).then(function (r) {
      ocupado($('b-confirmar'), false, 'Confirmar registro');
      if (!r.ok) { aviso($('m-nuevo'), r.error, 'mal'); return; }
      ['n-inv', 'n-nombre', 'n-apellido', 'n-correo', 'n-tel', 'n-pin', 'n-pin2', 'n-codigo'].forEach(function (i) { $(i).value = ''; });
      $('n-acepto').checked = false;
      var pin = alta.pin; alta = null;
      abrirSesion(r.id, r.token || pin, r.nombre, r.semana);
      aviso($('m-registro'), 'Registro completado. Tu ID es ' + r.id + ': apúntalo, lo necesitas para entrar.', 'ok');
    }).catch(function () { ocupado($('b-confirmar'), false, 'Confirmar registro'); fallo($('m-nuevo'))(); });
  });

  $('fecha').addEventListener('change', function () {
    if (!sesion || !$('fecha').value) return;
    aviso($('m-registro'), '', 'ok');
    ocupado($('b-guardar'), true, 'Comprobando…');
    servidor('api_semana', sesion.id, sesion.pin, $('fecha').value).then(function (r) {
      if (r.ok) pintarSemana(r.semana); else ocupado($('b-guardar'), false, 'Guardar');
    }).catch(function () { ocupado($('b-guardar'), false, 'Guardar'); });
  });

  $('b-guardar').addEventListener('click', function () {
    var d = { fecha: $('fecha').value, libre: $('libre').checked, entrada: $('entrada').value, salida: $('salida').value, pausa: +$('pausa').value };
    if ($('partido').checked && !d.libre) { d.entrada2 = $('entrada2').value; d.salida2 = $('salida2').value; }
    if (!d.fecha) { aviso($('m-registro'), 'Elige la fecha.', 'mal'); return; }
    if (!d.libre && calcular().error) { aviso($('m-registro'), calcular().error, 'mal'); return; }
    ocupado($('b-guardar'), true, 'Guardando…');
    servidor('api_guardar', sesion.id, sesion.pin, d).then(function (r) {
      ocupado($('b-guardar'), false, 'Guardar');
      if (!r.ok) { aviso($('m-registro'), r.error, 'mal'); if (r.semana) pintarSemana(r.semana); return; }
      aviso($('m-registro'), (d.libre ? 'Día libre registrado: ' + fechaCorta(d.fecha) + '.' : 'Hora registrada: ' + fechaCorta(d.fecha) + ', ' + horario(d).replace('\n', ' y ') + '.'), 'ok');
      if (!d.libre) { try { localStorage.setItem('turno_horario', JSON.stringify({ e: d.entrada, s: d.salida, e2: d.entrada2 || '', s2: d.salida2 || '', p: String(d.pausa) })); } catch (e) {} }
      $('libre').checked = false; vista(); pintarSemana(r.semana);
    }).catch(function () { ocupado($('b-guardar'), false, 'Guardar'); fallo($('m-registro'))(); });
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
    ocupado($('b-olvido'), true, 'Enviando código…');
    servidor('api_recuperar').then(function (r) {
      ocupado($('b-olvido'), false, 'Olvidé la contraseña');
      if (!r.ok) { aviso($('m-sup'), r.error, 'mal'); return; }
      aviso($('m-sup'), 'Enviamos un código a ' + r.destino + '. Escríbelo aquí abajo.', 'ok');
      $('sup-rec').classList.remove('oculto');
    }).catch(function () { ocupado($('b-olvido'), false, 'Olvidé la contraseña'); fallo($('m-sup'))(); });
  });
  $('b-cambiar').addEventListener('click', function () {
    ocupado($('b-cambiar'), true, 'Cambiando…');
    servidor('api_nuevaClave', $('r-codigo').value.trim(), $('r-clave').value).then(function (r) {
      ocupado($('b-cambiar'), false, 'Cambiar contraseña');
      if (!r.ok) { aviso($('m-sup'), r.error, 'mal'); return; }
      $('r-codigo').value = ''; $('r-clave').value = ''; $('sup-rec').classList.add('oculto'); claveSup = '';
      $('sup-clave').classList.remove('oculto');
      aviso($('m-sup'), 'Contraseña cambiada. Ya puedes entrar con la nueva.', 'ok');
    }).catch(function () { ocupado($('b-cambiar'), false, 'Cambiar contraseña'); fallo($('m-sup'))(); });
  });
  $('b-ver').addEventListener('click', function () {
    var clave = claveSup || $('clave').value;
    if (!clave || !$('mes').value) { aviso($('m-sup'), 'Escribe la contraseña y elige el mes.', 'mal'); return; }
    var mesPedido = $('mes').value;
    ocupado($('b-ver'), true, 'Cargando…');
    servidor('api_supervisor', clave, mesPedido).then(function (r) {
      ocupado($('b-ver'), false, 'Ver control de horas');
      if (!r.ok) { $('sup-datos').classList.add('oculto'); aviso($('m-sup'), r.error, 'mal'); return; }
      claveSup = r.ficha || clave; $('clave').value = ''; $('sup-clave').classList.add('oculto'); aviso($('m-sup'), '', 'mal');
      $('b-olvido').classList.add('oculto'); $('sup-rec').classList.add('oculto');
      supDatos = r; supMes = mesPedido; $('sup-inv').textContent = r.invitacion || ''; aviso($('m-exp'), '', 'ok'); llenarEmpleados(r.lista || []); pintarSup();
      $('sup-emp-caja').classList.remove('oculto'); $('sup-datos').classList.remove('oculto');
    }).catch(function () { ocupado($('b-ver'), false, 'Ver control de horas'); fallo($('m-sup'))(); });
  });

  // El supervisor elige un empleado y ve solo sus horas del mes; "Todos" muestra el resumen general.
  var supDatos = null, supMes = '';
  $('b-exportar').addEventListener('click', function () {
    if (!claveSup || !supMes) return;
    ocupado($('b-exportar'), true, 'Enviando…');
    servidor('api_exportar', claveSup, supMes).then(function (r) {
      ocupado($('b-exportar'), false, 'Enviar resumen del mes a mi correo');
      aviso($('m-exp'), r.ok ? 'Resumen de ' + supMes + ' enviado a ' + r.destino + '.' : r.error, r.ok ? 'ok' : 'mal');
    }).catch(function () { ocupado($('b-exportar'), false, 'Enviar resumen del mes a mi correo'); fallo($('m-exp'))(); });
  });
  function llenarEmpleados(lista) {
    var sel = $('sup-emp'), antes = sel.value; sel.textContent = '';
    lista.forEach(function (e) {
      var o = document.createElement('option'); o.value = e.id; o.textContent = e.nombre + ' (' + e.id + ')'; o.setAttribute('data-nombre', e.nombre); sel.appendChild(o);
    });
    var t = document.createElement('option'); t.value = 'todos'; t.textContent = 'Todos los empleados'; sel.appendChild(t);
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
    if (!regs.length) { var v = document.createElement('tr'); celda(v, 'No hay registros en este mes', 'gris'); v.firstChild.colSpan = 7; b.appendChild(v); }
    regs.forEach(function (d) {
      var tr = document.createElement('tr');
      celda(tr, fechaCorta(d.fecha) + (d.festivo ? ' (festivo)' : '')); celda(tr, d.id); celda(tr, d.nombre);
      celda(tr, horario(d), d.libre ? 'gris' : 'hor');
      celda(tr, d.libre ? '' : d.pausa + ' min'); celda(tr, h(d.horas)); celda(tr, h(d.extra), d.extra > 0 ? 'ex' : 'gris');
      b.appendChild(tr);
    });
    $('sup-titulo').textContent = uno ? 'Resumen del empleado' : 'Resumen por empleado';
    $('k-t1').textContent = uno ? 'Horas' : 'Empleados'; $('k-emp').textContent = uno ? h(horas) : emps.length;
    $('k-t2').textContent = uno ? 'Normales' : 'Horas'; $('k-horas').textContent = uno ? h(normales) : h(horas);
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) { aviso($('m-rp'), 'Escribe un correo electrónico válido.', 'mal'); return; }
    ocupado($('b-rp-enviar'), true, 'Enviando código…');
    servidor('api_recuperarAcceso', correo).then(function (r) {
      ocupado($('b-rp-enviar'), false, 'Enviar código');
      if (!r.ok) { aviso($('m-rp'), r.error, 'mal'); return; }
      rpCorreo = correo; $('rp-codigo').value = ''; $('rp-pin').value = ''; $('rp-pin2').value = ''; pasoRp(2);
      aviso($('m-rp'), 'Si ese correo está registrado, recibirás un mensaje con tu ID y un código. Revisa también el spam.', 'ok');
    }).catch(function () { ocupado($('b-rp-enviar'), false, 'Enviar código'); fallo($('m-rp'))(); });
  });
  $('b-rp-cambiar').addEventListener('click', function () {
    var pin = $('rp-pin').value.trim();
    if (!/^\d{4,8}$/.test(pin)) { aviso($('m-rp'), 'El PIN debe tener de 4 a 8 cifras.', 'mal'); return; }
    if (pin !== $('rp-pin2').value.trim()) { aviso($('m-rp'), 'Los dos PIN no coinciden.', 'mal'); return; }
    ocupado($('b-rp-cambiar'), true, 'Cambiando…');
    servidor('api_nuevoPin', rpCorreo, $('rp-codigo').value.trim(), pin).then(function (r) {
      ocupado($('b-rp-cambiar'), false, 'Cambiar PIN');
      if (!r.ok) { aviso($('m-rp'), r.error, 'mal'); return; }
      pasoRp(1); $('rp-correo').value = '';
      if (sesion) {
        if (String(sesion.id) === String(r.id)) { sesion.pin = r.token || pin; recordar({ id: sesion.id, pin: sesion.pin }); }
        aviso($('m-rp'), 'PIN cambiado. Tu ID es ' + r.id + '.', 'ok'); return;
      }
      $('id').value = r.id; $('pin').value = ''; mostrar('p-login');
      aviso($('m-login'), 'PIN cambiado. Tu ID es ' + r.id + ': entra con tu PIN nuevo.', 'ok');
    }).catch(function () { ocupado($('b-rp-cambiar'), false, 'Cambiar PIN'); fallo($('m-rp'))(); });
  });
  $('b-rep').addEventListener('click', function () {
    var d = { tipo: $('rep-tipo').value, mensaje: $('rep-msg').value.trim(), contacto: $('rep-contacto').value.trim(),
              id: sesion ? sesion.id : $('id').value.trim(), dispositivo: navigator.userAgent };
    if (d.mensaje.length < 10) { aviso($('m-rep'), 'Describe el problema con un poco más de detalle.', 'mal'); return; }
    ocupado($('b-rep'), true, 'Enviando…');
    servidor('api_reporte', d).then(function (r) {
      ocupado($('b-rep'), false, 'Enviar reporte');
      if (!r.ok) { aviso($('m-rep'), r.error, 'mal'); return; }
      $('rep-msg').value = ''; aviso($('m-rep'), 'Reporte enviado. Gracias, lo revisaremos lo antes posible.', 'ok');
    }).catch(function () { ocupado($('b-rep'), false, 'Enviar reporte'); fallo($('m-rep'))(); });
  });

  // ----- arranque -----
  servidor('api_inicio').then(function (r) { $('empresa').textContent = r.empresa; $('priv-empresa').textContent = r.empresa; document.title = 'Turno · ' + r.empresa; }).catch(function () {});
  var guardado = recordado();
  if (guardado && guardado.id && guardado.pin) { $('id').value = guardado.id; entrar(guardado.id, guardado.pin, true); }

