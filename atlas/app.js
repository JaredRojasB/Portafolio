/* Atlas — private cloud case study + simulated monitoring console.
   Everything here is anonymized: no real names, addresses, IPs or credentials. Console data is simulated in the browser. */
(function () {
  'use strict';
  var K = window.DemoKit, h = K.h, clear = K.clear;
  var SVGNS = 'http://www.w3.org/2000/svg';

  var L = new K.I18n({
    en: {
      back: 'Portfolio', badge: 'Case study · details anonymized', 'mode.study': 'Case study', 'mode.console': 'Console (simulated)', tour: 'Take the tour',
      'h.kicker': 'Infrastructure · Case study', 'h.title': 'A private cloud built from hardware that was already in a drawer.',
      'h.lede': 'Photos, documents and a family movie library moved off paid cloud storage and onto reused computers at home — virtualized, backed up every night, reachable from anywhere and never exposed to the internet.',
      'g.k': '01 · The goal', 'g.t': 'Stop paying for storage without giving up convenience.',
      'g.p1': "The family's photos lived in a paid cloud subscription that kept growing, movies were scattered across laptops and nobody knew where the important documents were. The brief was simple: one private place for everything, as easy as the apps they already used.",
      'a.k': '02 · Architecture', 'a.t': 'Three reused machines, one job each.', 'a.p': 'A main node runs every service in isolated containers; a low‑power node receives encrypted backups and watches the others; a third machine stays on standby for heavier tasks.',
      'c.k': '03 · Building blocks', 'c.t': 'Open‑source tools, chosen for reliability.', 'd.k': '04 · Decisions', 'd.t': 'The choices that mattered.', 'r.k': '05 · Results', 'r.t': 'What changed.', 'l.t': 'Lessons learned',
      'x.k': '06 · For clients', 'x.t': 'The same approach, for your office or home.', 'x.p': 'A small office file server with permissions, automatic off‑site backups, secure remote access for the team, uptime alerts on your phone — sized to your budget and built so anyone can use it.',
      'x.btn': 'Open the simulated console', 'x.contact': 'Talk about a project',
      'k.title': 'Atlas console', 'k.sub': 'Simulated data that mirrors the real dashboard. Names and addresses are fictional.', 'k.svc': 'Services', 'k.actions': 'Quick actions', 'k.backups': 'Backups',
      'k.policy': 'Nightly · keep 7 daily, 4 weekly, 6 monthly', 'k.alerts': 'Alerts', 'k.alertsSub': 'Sent to the family chat',
      stats: [['0', 'monthly storage fees'], ['3', 'reused machines'], ['24/7', 'monitoring with alerts'], ['0', 'ports open to the internet']],
      req: ['Private: nobody outside the family can reach it.', 'Free to run: reuse existing hardware and open‑source software.', 'Simple: photos sync from phones, movies play on the TV, documents open in the browser.', 'Safe: automatic, encrypted backups that are actually tested.', 'Reachable from anywhere, including for relatives who are not technical.'],
      blocks: [['Virtualization', 'Proxmox VE', 'Hypervisor with two‑factor login; services split into containers and VMs.'], ['Containers', 'LXC + Docker', 'Unprivileged container hosting every app with its own compose stack.'],
        ['Media', 'Jellyfin', 'Family movie library with offline downloads and watch‑together sessions.'], ['Photos', 'Immich', 'Private photo library with mobile upload, replacing a paid subscription.'],
        ['Files', 'File Browser + SMB shares', 'Documents in the browser and as network drives on Windows and Mac.'], ['Network', 'AdGuard Home', 'Encrypted DNS and ad/tracker blocking for the whole home network.'],
        ['Remote access', 'Tailscale mesh VPN', 'Zero‑trust access from phones and laptops — no ports opened on the router.'], ['Backups', 'restic over SFTP', 'Encrypted, deduplicated nightly backups to a second machine with retention rules.'],
        ['Monitoring', 'Uptime Kuma + chat bot', 'Health checks every minute and alerts straight to a family chat.'], ['Dashboard', 'Custom web panel', 'One page with every app and safe one‑click actions, also on the phone home screen.'],
        ['Automation', 'Home Assistant', 'Smart‑home devices and the TV streaming box in one place.'], ['Local AI', 'Ollama + Open WebUI', 'A private assistant that runs on the server; no data leaves the house.']],
      decisions: [['Reuse before buying', 'A mini PC and two office desktops were upgraded with spare RAM and drives instead of buying a commercial NAS.'],
        ['Isolation by default', 'Each service lives in its own container inside an unprivileged host, so one failure cannot take down the rest.'],
        ['No open ports', 'Remote access goes through a private mesh VPN that turns on only when needed. The router exposes nothing.'],
        ['Backups you can trust', 'Nightly encrypted backups to a different machine, 7/4/6 retention, an extra monthly copy to an external drive — and restores tested before every migration.'],
        ['Alerts where people already look', 'Instead of yet another app, alerts arrive in the chat the family already uses.'],
        ['Designed for non‑technical users', 'A single dashboard, home‑screen shortcuts and PIN‑protected actions make it usable by everyone.']],
      results: [['$0 / month', 'Paid photo storage cancelled'], ['Every night', 'Automatic encrypted backups'], ['< 1 min', 'From outage to alert on the phone'], ['1 page', 'To reach every service']],
      lessons: ['Document every step; the notes are what make the next change safe.', 'Keep a recovery copy before any migration — and check it.', 'Start simple and remove what nobody uses (torrent tools were removed after testing).', 'Usability is part of the infrastructure: if the family cannot use it, it does not work.'],
      d: { dev: 'Devices', d1: 'Phones & tablets', d2: 'TV streaming box', d3: 'Laptops', d4: 'Family away from home', vpn: 'Private VPN · no open ports',
        main: 'node‑01 · Main server', mainS: 'Hypervisor · reused micro desktop', ct: 'Container host (unprivileged)', vm: 'VM · Home automation',
        s1: 'Media server', s2: 'Photo library', s3: 'Files & shares', s4: 'DNS filtering', s5: 'Dashboard', s6: 'Local AI',
        bk: 'node‑02 · Backups', bkS: 'Reused mini PC', bk1: 'Encrypted backups · nightly', bk2: 'Uptime checks', sb: 'node‑03 · Standby', sbS: 'On demand',
        al: 'Alerts → family chat bot', alS: 'Outages, backup results, disk health', enc: 'encrypted · nightly', alert: 'alerts' },
      nodes: [['node‑01', 'Main server', 'Hypervisor · 12 containers'], ['node‑02', 'Backups & monitoring', 'Low‑power mini PC'], ['node‑03', 'Standby', 'Wakes on demand']],
      cpu: 'CPU', ram: 'RAM', disk: 'Disk', temp: 'Temp', online: 'Online', standby: 'Standby', up: 'up {d} days',
      svcs: [['Media server', 'streaming'], ['Photo library', 'photos'], ['File manager', 'documents'], ['DNS filtering', 'network'], ['Dashboard', 'web panel'], ['Local AI', 'assistant'], ['Home automation', 'VM'], ['Uptime monitor', 'node‑02'], ['VPN mesh', 'remote access']],
      svcSum: '{n} of {t} healthy',
      acts: [['Run backup now', 'Encrypted snapshot to node‑02'], ['Pause ad blocking 5 min', 'For a site that needs it'], ['Wake standby node', 'Wake‑on‑LAN'], ['Restart media server', 'Container restart']],
      run: 'Run', running: 'Running…', done: 'Done', tBackup: 'Backup finished · {s} added', tPause: 'Ad blocking paused for 5 minutes (simulated)', tWake: 'node‑03 is waking up (simulated)', tRestart: 'Media server restarted (simulated)',
      ok: 'OK', bkLabel: '{f} files changed', al: [['ok', 'Nightly backup completed', '02:41'], ['ok', 'Disk health check passed', 'yesterday'], ['warn', 'Main disk at 82% — time to add storage', '2 days ago'], ['down', 'Photo library unreachable for 3 min', '5 days ago'], ['ok', 'Photo library back online', '5 days ago']]
    },
    es: {
      back: 'Portafolio', badge: 'Caso de estudio · datos anonimizados', 'mode.study': 'Caso de estudio', 'mode.console': 'Consola (simulada)', tour: 'Ver recorrido',
      'h.kicker': 'Infraestructura · Caso de estudio', 'h.title': 'Una nube privada hecha con equipo que ya estaba guardado en un cajón.',
      'h.lede': 'Fotos, documentos y la biblioteca de películas de la familia dejaron el almacenamiento en la nube de paga y pasaron a computadoras reutilizadas en casa — virtualizadas, respaldadas cada noche, accesibles desde cualquier lugar y nunca expuestas a internet.',
      'g.k': '01 · El objetivo', 'g.t': 'Dejar de pagar almacenamiento sin perder comodidad.',
      'g.p1': 'Las fotos de la familia vivían en una suscripción de nube de paga que no dejaba de crecer, las películas estaban regadas en varias laptops y nadie sabía dónde estaban los documentos importantes. La meta era sencilla: un solo lugar privado para todo, tan fácil como las apps que ya usaban.',
      'a.k': '02 · Arquitectura', 'a.t': 'Tres equipos reutilizados, una tarea cada uno.', 'a.p': 'Un nodo principal corre todos los servicios en contenedores aislados; un nodo de bajo consumo recibe los respaldos cifrados y vigila a los demás; un tercer equipo queda en espera para tareas pesadas.',
      'c.k': '03 · Componentes', 'c.t': 'Herramientas de código abierto, elegidas por confiables.', 'd.k': '04 · Decisiones', 'd.t': 'Las decisiones que importaron.', 'r.k': '05 · Resultados', 'r.t': 'Qué cambió.', 'l.t': 'Lecciones aprendidas',
      'x.k': '06 · Para clientes', 'x.t': 'El mismo enfoque, para tu oficina o tu casa.', 'x.p': 'Un servidor de archivos para oficina con permisos, respaldos automáticos fuera del equipo, acceso remoto seguro para el equipo y alertas de caída en tu celular — a la medida de tu presupuesto y hecho para que cualquiera lo use.',
      'x.btn': 'Abrir la consola simulada', 'x.contact': 'Platiquemos de un proyecto',
      'k.title': 'Consola Atlas', 'k.sub': 'Datos simulados que replican el panel real. Nombres y direcciones son ficticios.', 'k.svc': 'Servicios', 'k.actions': 'Acciones rápidas', 'k.backups': 'Respaldos',
      'k.policy': 'Cada noche · conserva 7 diarios, 4 semanales, 6 mensuales', 'k.alerts': 'Alertas', 'k.alertsSub': 'Enviadas al chat familiar',
      stats: [['0', 'pagos mensuales de almacenamiento'], ['3', 'equipos reutilizados'], ['24/7', 'monitoreo con alertas'], ['0', 'puertos abiertos a internet']],
      req: ['Privado: nadie fuera de la familia puede entrar.', 'Gratis de operar: reutilizar equipo existente y software de código abierto.', 'Sencillo: las fotos se suben desde el celular, las películas se ven en la tele y los documentos se abren en el navegador.', 'Seguro: respaldos automáticos y cifrados que de verdad se prueban.', 'Accesible desde cualquier lugar, incluso para familiares que no son técnicos.'],
      blocks: [['Virtualización', 'Proxmox VE', 'Hipervisor con inicio de sesión de dos factores; servicios separados en contenedores y VMs.'], ['Contenedores', 'LXC + Docker', 'Contenedor sin privilegios que aloja cada app con su propio compose.'],
        ['Películas', 'Jellyfin', 'Biblioteca familiar con descargas sin conexión y sesiones para ver juntos a distancia.'], ['Fotos', 'Immich', 'Biblioteca privada de fotos con subida desde el celular, en lugar de una suscripción.'],
        ['Archivos', 'File Browser + carpetas SMB', 'Documentos en el navegador y como unidades de red en Windows y Mac.'], ['Red', 'AdGuard Home', 'DNS cifrado y bloqueo de anuncios y rastreadores para toda la red de la casa.'],
        ['Acceso remoto', 'VPN mesh Tailscale', 'Acceso de confianza cero desde celulares y laptops — sin abrir puertos en el router.'], ['Respaldos', 'restic por SFTP', 'Respaldos nocturnos cifrados y deduplicados a otro equipo, con reglas de retención.'],
        ['Monitoreo', 'Uptime Kuma + bot de chat', 'Revisión cada minuto y alertas directo al chat familiar.'], ['Panel', 'Panel web propio', 'Una sola página con todas las apps y acciones seguras de un clic, también en el celular.'],
        ['Automatización', 'Home Assistant', 'Dispositivos inteligentes y el reproductor de la tele en un mismo lugar.'], ['IA local', 'Ollama + Open WebUI', 'Un asistente privado que corre en el servidor; ningún dato sale de la casa.']],
      decisions: [['Reutilizar antes de comprar', 'Una mini PC y dos equipos de oficina se mejoraron con RAM y discos que ya había, en lugar de comprar un NAS comercial.'],
        ['Aislamiento por defecto', 'Cada servicio vive en su propio contenedor dentro de un host sin privilegios, así una falla no tumba lo demás.'],
        ['Cero puertos abiertos', 'El acceso remoto pasa por una VPN mesh privada que se enciende solo cuando hace falta. El router no expone nada.'],
        ['Respaldos confiables', 'Respaldos cifrados cada noche a otro equipo, retención 7/4/6, una copia mensual extra a disco externo — y restauraciones probadas antes de cada migración.'],
        ['Alertas donde la gente ya mira', 'En vez de otra app más, las alertas llegan al chat que la familia ya usa.'],
        ['Pensado para usuarios no técnicos', 'Un solo panel, accesos en la pantalla de inicio y acciones protegidas con PIN para que todos lo puedan usar.']],
      results: [['$0 / mes', 'Se canceló el almacenamiento de fotos de paga'], ['Cada noche', 'Respaldos automáticos y cifrados'], ['< 1 min', 'De una caída a la alerta en el celular'], ['1 página', 'Para llegar a todos los servicios']],
      lessons: ['Documentar cada paso; las notas son lo que hace seguro el siguiente cambio.', 'Tener una copia de rescate antes de cualquier migración — y verificarla.', 'Empezar simple y quitar lo que nadie usa (las herramientas de torrents se retiraron tras probarlas).', 'La usabilidad es parte de la infraestructura: si la familia no lo puede usar, no funciona.'],
      d: { dev: 'Dispositivos', d1: 'Celulares y tablets', d2: 'Reproductor de TV', d3: 'Laptops', d4: 'Familia fuera de casa', vpn: 'VPN privada · sin puertos abiertos',
        main: 'node‑01 · Servidor principal', mainS: 'Hipervisor · micro PC reutilizada', ct: 'Host de contenedores (sin privilegios)', vm: 'VM · Automatización del hogar',
        s1: 'Películas', s2: 'Fotos', s3: 'Archivos', s4: 'Filtro DNS', s5: 'Panel', s6: 'IA local',
        bk: 'node‑02 · Respaldos', bkS: 'Mini PC reutilizada', bk1: 'Respaldo cifrado · noche', bk2: 'Monitoreo de caídas', sb: 'node‑03 · Espera', sbS: 'Bajo demanda',
        al: 'Alertas → bot del chat familiar', alS: 'Caídas, respaldos, salud de discos', enc: 'cifrado · cada noche', alert: 'alertas' },
      nodes: [['node‑01', 'Servidor principal', 'Hipervisor · 12 contenedores'], ['node‑02', 'Respaldos y monitoreo', 'Mini PC de bajo consumo'], ['node‑03', 'En espera', 'Se enciende bajo demanda']],
      cpu: 'CPU', ram: 'RAM', disk: 'Disco', temp: 'Temp', online: 'En línea', standby: 'En espera', up: 'encendido {d} días',
      svcs: [['Películas', 'streaming'], ['Fotos', 'biblioteca'], ['Archivos', 'documentos'], ['Filtro DNS', 'red'], ['Panel', 'web'], ['IA local', 'asistente'], ['Automatización', 'VM'], ['Monitor de caídas', 'node‑02'], ['VPN mesh', 'acceso remoto']],
      svcSum: '{n} de {t} sanos',
      acts: [['Respaldar ahora', 'Snapshot cifrado hacia node‑02'], ['Pausar bloqueo 5 min', 'Para un sitio que lo necesite'], ['Encender nodo en espera', 'Wake‑on‑LAN'], ['Reiniciar películas', 'Reinicio del contenedor']],
      run: 'Ejecutar', running: 'Ejecutando…', done: 'Listo', tBackup: 'Respaldo terminado · {s} agregados', tPause: 'Bloqueo de anuncios pausado 5 minutos (simulado)', tWake: 'node‑03 está encendiendo (simulado)', tRestart: 'Servidor de películas reiniciado (simulado)',
      ok: 'OK', bkLabel: '{f} archivos con cambios', al: [['ok', 'Respaldo nocturno completado', '02:41'], ['ok', 'Revisión de salud de discos correcta', 'ayer'], ['warn', 'Disco principal al 82% — hay que agregar espacio', 'hace 2 días'], ['down', 'Fotos sin respuesta por 3 min', 'hace 5 días'], ['ok', 'Fotos de vuelta en línea', 'hace 5 días']]
    }
  });
  var T = L.t;
  function $(id) { return document.getElementById(id); }

  /* ---------- Case study ---------- */
  function renderStudy() {
    var st = $('stats'); clear(st);
    T('stats').forEach(function (x) { st.appendChild(h('div', null, [h('b', { text: x[0] }), h('span', { text: x[1] })])); });
    var rq = $('reqList'); clear(rq); T('req').forEach(function (x) { rq.appendChild(h('li', { text: x })); });
    var bl = $('blocks'); clear(bl); T('blocks').forEach(function (x) { bl.appendChild(h('div', { class: 'blk' }, [h('small', { text: x[0] }), h('b', { text: x[1] }), h('p', { text: x[2] })])); });
    var dc = $('decisions'); clear(dc); T('decisions').forEach(function (x) { dc.appendChild(h('div', { class: 'dec' }, [h('b', { text: x[0] }), h('p', { text: x[1] })])); });
    var rs = $('results'); clear(rs); T('results').forEach(function (x) { rs.appendChild(h('div', { class: 'res' }, [h('b', { text: x[0] }), h('span', { text: x[1] })])); });
    var ls = $('lessons'); clear(ls); T('lessons').forEach(function (x) { ls.appendChild(h('li', { text: x })); });
    drawDiagram();
  }
  function s(tag, a, text) { var e = document.createElementNS(SVGNS, tag); Object.keys(a).forEach(function (k) { e.setAttribute(k, a[k]); }); if (text != null) e.textContent = text; return e; }
  function drawDiagram() {
    var d = T('d'), box = $('diagram'); clear(box);
    var g = s('svg', { viewBox: '0 0 760 470' });
    var defs = s('defs', {}), mk = s('marker', { id: 'ar', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
    mk.appendChild(s('path', { d: 'M0 0 L10 5 L0 10 z', fill: '#9aa0a6' })); defs.appendChild(mk); g.appendChild(defs);
    g.appendChild(s('rect', { x: 10, y: 20, width: 170, height: 300, rx: 14, class: 'box' }));
    g.appendChild(s('text', { x: 24, y: 46, class: 't' }, d.dev));
    [d.d1, d.d2, d.d3, d.d4].forEach(function (t, i) { g.appendChild(s('rect', { x: 22, y: 62 + i * 62, width: 146, height: 48, rx: 10, class: 'svc' })); g.appendChild(s('text', { x: 32, y: 91 + i * 62 }, t)); });
    g.appendChild(s('path', { d: 'M180 170 H208', class: 'ln enc', 'marker-end': 'url(#ar)' }));
    g.appendChild(s('text', { x: 12, y: 342, class: 'lbl' }, d.vpn));
    g.appendChild(s('rect', { x: 210, y: 20, width: 330, height: 300, rx: 16, class: 'box main' }));
    g.appendChild(s('text', { x: 226, y: 46, class: 't' }, d.main));
    g.appendChild(s('text', { x: 226, y: 63, class: 'ts' }, d.mainS));
    g.appendChild(s('rect', { x: 224, y: 76, width: 302, height: 176, rx: 12, class: 'box' }));
    g.appendChild(s('text', { x: 236, y: 96, class: 'ts' }, d.ct));
    [d.s1, d.s2, d.s3, d.s4, d.s5, d.s6].forEach(function (t, i) {
      var x = 236 + (i % 3) * 96, y = 108 + Math.floor(i / 3) * 70;
      g.appendChild(s('rect', { x: x, y: y, width: 88, height: 58, rx: 10, class: 'svc' }));
      g.appendChild(s('text', { x: x + 44, y: y + 34, 'text-anchor': 'middle' }, t));
    });
    g.appendChild(s('rect', { x: 224, y: 262, width: 302, height: 44, rx: 10, class: 'svc' }));
    g.appendChild(s('text', { x: 240, y: 289 }, d.vm));
    g.appendChild(s('rect', { x: 575, y: 20, width: 175, height: 170, rx: 14, class: 'box' }));
    g.appendChild(s('text', { x: 589, y: 46, class: 't' }, d.bk));
    g.appendChild(s('text', { x: 589, y: 63, class: 'ts' }, d.bkS));
    [d.bk1, d.bk2].forEach(function (t, i) { g.appendChild(s('rect', { x: 587, y: 78 + i * 52, width: 151, height: 42, rx: 10, class: 'svc' })); g.appendChild(s('text', { x: 597, y: 104 + i * 52, class: 'ts' }, t)); });
    g.appendChild(s('path', { d: 'M540 100 H573', class: 'ln enc', 'marker-end': 'url(#ar)' }));
    g.appendChild(s('rect', { x: 575, y: 214, width: 130, height: 92, rx: 14, class: 'box' }));
    g.appendChild(s('text', { x: 587, y: 240, class: 't' }, d.sb));
    g.appendChild(s('text', { x: 587, y: 258, class: 'ts' }, d.sbS));
    g.appendChild(s('path', { d: 'M540 260 H573', class: 'ln', 'marker-end': 'url(#ar)' }));
    g.appendChild(s('rect', { x: 210, y: 370, width: 540, height: 80, rx: 16, class: 'box dark' }));
    g.appendChild(s('text', { x: 232, y: 404, class: 'tw' }, d.al));
    g.appendChild(s('text', { x: 232, y: 424, class: 'tsw' }, d.alS));
    g.appendChild(s('path', { d: 'M730 190 V368', class: 'ln alert', 'marker-end': 'url(#ar)' }));
    g.appendChild(s('path', { d: 'M375 320 V368', class: 'ln alert', 'marker-end': 'url(#ar)' }));
    g.appendChild(s('text', { x: 714, y: 352, class: 'lbl', 'text-anchor': 'end' }, d.alert));
    box.appendChild(g);
  }

  /* ---------- Console (simulated) ---------- */
  var sim = { n: [{ cpu: 18, ram: 46, disk: 82, temp: 47, up: 23 }, { cpu: 6, ram: 61, disk: 58, temp: 41, up: 64 }, { cpu: 0, ram: 0, disk: 34, temp: 0, up: 0 }],
    ms: [12, 18, 9, 3, 6, 41, 15, 7, 22], timer: null, awake: false };
  var backups = (function () {
    var r = K.rng(311), out = [], d = new Date();
    for (var i = 0; i < 7; i++) { var dd = new Date(d); dd.setDate(d.getDate() - i); out.push({ d: dd, size: (40 + Math.floor(r() * 900)) + ' MB', files: 20 + Math.floor(r() * 400), dur: (2 + Math.floor(r() * 6)) + ' min' }); }
    return out;
  })();
  function meter(label, val, unit, hot) {
    var bar = h('i', { class: hot ? 'hot' : '' }); bar.style.width = Math.min(100, val) + '%';
    return h('div', { class: 'meter' }, [h('span', { text: label }), h('span', { class: 'tr' }, [bar]), h('b', { text: Math.round(val) + unit })]);
  }
  function renderNodes() {
    var box = $('nodes'); clear(box);
    T('nodes').forEach(function (x, i) {
      var m = sim.n[i], standby = i === 2 && !sim.awake;
      var card = h('div', { class: 'glass node' }, [
        h('div', { class: 'n-top' }, [h('div', null, [h('b', { text: x[0] + ' · ' + x[1] }), h('small', { text: x[2] + (standby ? '' : ' · ' + T('up', { d: m.up })) })]),
          h('span', { class: 'st' + (standby ? ' idle' : ''), text: standby ? T('standby') : T('online') })])
      ]);
      if (standby) { card.appendChild(meter(T('disk'), m.disk, '%', false)); }
      else { card.appendChild(meter(T('cpu'), m.cpu, '%', m.cpu > 70)); card.appendChild(meter(T('ram'), m.ram, '%', m.ram > 85)); card.appendChild(meter(T('disk'), m.disk, '%', m.disk > 80)); card.appendChild(meter(T('temp'), m.temp, '°', m.temp > 70)); }
      box.appendChild(card);
    });
  }
  function renderSvcs() {
    var box = $('svcs'), list = T('svcs'), healthy = 0; clear(box);
    list.forEach(function (x, i) {
      var ms = sim.ms[i], cls = ms > 200 ? 'warn' : '';
      if (!cls) healthy++;
      box.appendChild(h('div', { class: 'svc' }, [h('span', { class: 'dot ' + cls }), h('div', null, [h('b', { text: x[0] }), h('small', { text: x[1] })]), h('span', { class: 'ms', text: ms + ' ms' })]));
    });
    $('svcSum').textContent = T('svcSum', { n: healthy, t: list.length });
  }
  function renderActs() {
    var box = $('acts'); clear(box);
    T('acts').forEach(function (x, i) {
      var prog = h('div', { class: 'prog' }, [h('i')]); prog.hidden = true;
      var btn = h('button', { type: 'button', class: 'gbtn', text: T('run') });
      btn.addEventListener('click', function () { runAction(i, btn, prog); });
      box.appendChild(h('div', { class: 'act' }, [h('div', null, [h('span', { text: x[0] }), h('small', { text: x[1] }), prog]), btn]));
    });
  }
  function runAction(i, btn, prog) {
    btn.disabled = true; btn.textContent = T('running'); prog.hidden = false;
    var bar = prog.firstChild, p = 0;
    var iv = setInterval(function () {
      p += 12 + Math.random() * 18; bar.style.width = Math.min(100, p) + '%';
      if (p >= 100) {
        clearInterval(iv); btn.textContent = T('done');
        if (i === 0) { var size = (30 + Math.floor(Math.random() * 300)) + ' MB'; backups.unshift({ d: new Date(), size: size, files: 5 + Math.floor(Math.random() * 80), dur: '1 min' }); backups.length = 7; renderBk(); K.toast(T('tBackup', { s: size })); }
        if (i === 1) { sim.ms[3] = 0; K.toast(T('tPause')); }
        if (i === 2) { sim.awake = true; sim.n[2] = { cpu: 4, ram: 12, disk: 34, temp: 38, up: 0 }; renderNodes(); K.toast(T('tWake')); }
        if (i === 3) { sim.ms[0] = 30; K.toast(T('tRestart')); }
        setTimeout(function () { btn.disabled = false; btn.textContent = T('run'); prog.hidden = true; bar.style.width = '0'; }, 1800);
      }
    }, 250);
  }
  function renderBk() {
    var box = $('bk'); clear(box);
    backups.forEach(function (b) {
      box.appendChild(h('div', { class: 'bk-row' }, [h('span', { class: 'mono', text: b.d.toLocaleDateString(L.lang === 'es' ? 'es-MX' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' }) }),
        h('span', { text: T('bkLabel', { f: b.files }) }), h('span', { class: 'mono', text: b.size }), h('span', { class: 'ok', text: T('ok') })]));
    });
  }
  function renderAlerts() {
    var box = $('alerts'); clear(box);
    T('al').forEach(function (a) { box.appendChild(h('div', { class: 'al' }, [h('i', { class: a[0] }), h('div', null, [h('span', { text: a[1] }), h('small', { text: a[2] })])])); });
  }
  function tick() {
    sim.n.forEach(function (m, i) {
      if (i === 2 && !sim.awake) return;
      m.cpu = Math.max(2, Math.min(95, m.cpu + (Math.random() - 0.5) * (i === 0 ? 14 : 6)));
      m.ram = Math.max(10, Math.min(92, m.ram + (Math.random() - 0.5) * 3));
      m.temp = Math.max(34, Math.min(78, m.temp + (Math.random() - 0.5) * 2));
    });
    sim.ms = sim.ms.map(function (v) { return Math.max(1, Math.round(v + (Math.random() - 0.5) * 6)); });
    renderNodes(); renderSvcs();
    $('clock').textContent = new Date().toLocaleTimeString(L.lang === 'es' ? 'es-MX' : 'en-US');
  }
  function renderConsole() { renderNodes(); renderSvcs(); renderActs(); renderBk(); renderAlerts(); $('clock').textContent = new Date().toLocaleTimeString(); }

  /* ---------- Mode ---------- */
  var mode = 'study';
  function setMode(m) {
    mode = m;
    $('study').hidden = m !== 'study'; $('console').hidden = m !== 'console';
    document.body.classList.toggle('dark', m === 'console');
    document.querySelectorAll('#modeSeg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-mode') === m); });
    clearInterval(sim.timer);
    if (m === 'console') { renderConsole(); sim.timer = setInterval(tick, 2000); }
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('#modeSeg button').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); }); });
  $('toConsole').addEventListener('click', function () { setMode('console'); });

  function go(m) { return function () { if (mode !== m) setMode(m); }; }
  var tour = new K.Tour({
    key: 'atlas', lang: function () { return L.lang; },
    steps: [
      { target: null, title: { en: 'Welcome to Atlas', es: 'Bienvenido a Atlas' },
        body: { en: 'A real project told as a case study: a private cloud for a family, built from reused computers. Personal details, names and addresses are anonymized.', es: 'Un proyecto real contado como caso de estudio: una nube privada para una familia, hecha con computadoras reutilizadas. Datos personales, nombres y direcciones están anonimizados.' } },
      { target: '#diagram', before: go('study'), title: { en: 'How it fits together', es: 'Cómo encaja todo' },
        body: { en: 'Devices reach the main server through a private VPN; backups travel encrypted to a second machine; alerts go to a chat.', es: 'Los dispositivos llegan al servidor principal por una VPN privada; los respaldos viajan cifrados a otro equipo; las alertas llegan a un chat.' } },
      { target: '#decisions', before: go('study'), title: { en: 'Why it was built this way', es: 'Por qué se hizo así' },
        body: { en: 'The key decisions — reuse, isolation, no open ports, tested backups — are the same ones applied for clients.', es: 'Las decisiones clave — reutilizar, aislar, no abrir puertos, probar respaldos — son las mismas que se aplican con clientes.' } },
      { target: '#modeSeg', before: go('study'), title: { en: 'See it running', es: 'Míralo funcionando' },
        body: { en: 'Switch to the console for a simulated version of the real monitoring dashboard.', es: 'Cambia a la consola para ver una versión simulada del panel de monitoreo real.' } },
      { target: '#actPanel', before: go('console'), title: { en: 'Live‑looking console', es: 'Consola en vivo' },
        body: { en: 'Node metrics update every two seconds. Try the quick actions: run a backup, pause ad blocking or wake the standby node — all simulated.', es: 'Las métricas se actualizan cada dos segundos. Prueba las acciones rápidas: respaldar, pausar el bloqueo o encender el nodo en espera — todo simulado.' } },
      { target: '.top-right', title: { en: 'Always at hand', es: 'Siempre a la mano' },
        body: { en: 'Replay this tour or switch language. The Portfolio button takes you back.', es: 'Repite este recorrido o cambia el idioma. El botón Portafolio te regresa.' } }
    ]
  });
  $('tourBtn').addEventListener('click', function () { tour.start(); });

  L.bind(function () { renderStudy(); if (mode === 'console') renderConsole(); });
  renderStudy();
  if (!tour.seen()) setTimeout(function () { tour.start(); }, 400);
})();
