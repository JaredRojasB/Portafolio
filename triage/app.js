/* Triage — conversational service desk demo.
   Portfolio mockup: rule-based classifier, fictional tickets stored only in this browser (localStorage).
   Security: user text is always written with textContent and sanitized before storage. */
(function () {
  'use strict';
  var K = window.DemoKit, h = K.h, clear = K.clear, clean = K.clean;
  var STORE = K.store('triage.demo.v1');

  var L = new K.I18n({
    en: {
      back: 'Portfolio', badge: 'Demo · fictional data', tour: 'Take the tour', reset: 'Reset demo',
      title: 'Northwind Service Desk', subtitle: 'Describe a problem in your own words — Triage classifies it, suggests a fix and escalates only when needed.',
      'tab.chat': 'Get help', 'tab.queue': 'Technician queue', 'tab.kb': 'Knowledge base', 'tab.stats': 'Insights',
      bot: 'Triage assistant', botSub: 'Usually answers instantly', you: 'Your name', placeholder: 'Describe your problem…', send: 'Send',
      'how.title': 'How Triage decides', 'how.1': 'Understand', 'how.1p': 'Keywords in English and Spanish map your message to a category.',
      'how.2': 'Prioritize', 'how.2p': 'Words about urgency, impact and security raise the priority.', 'how.3': 'Self‑service', 'how.3p': 'Common issues get guided steps from the knowledge base.',
      'how.4': 'Escalate', 'how.4p': 'If it is still broken, a ticket with a response deadline goes to a technician.',
      'sla.title': 'Response targets', 'sla.p1': 'Critical · 1 hour', 'sla.p2': 'High · 4 hours', 'sla.p3': 'Normal · 1 day', 'sla.p4': 'Low · 3 days',
      'q.search': 'Search tickets', 'c.ticket': 'Ticket', 'c.cat': 'Category', 'c.prio': 'Priority', 'c.req': 'Requester', 'c.sla': 'Respond by', 'c.status': 'Status',
      'kb.search': 'Search articles', 'kb.hint': 'These are the guides the assistant suggests.', 's.byCat': 'Tickets by category', 's.byPrio': 'Open tickets by priority',
      'd.conv': 'Conversation', 'd.reply': 'Reply to the requester',
      greet: 'Hi! I am the Triage assistant. Tell me what is going on — for example "my Wi‑Fi keeps dropping" or "I clicked a weird link". You can write in English or Spanish.',
      quick: ['My Wi‑Fi keeps disconnecting', 'I forgot my password and I am locked out', 'Outlook is not syncing my email', 'The printer is jammed', 'I clicked a suspicious link, urgent', 'Excel keeps crashing'],
      understood: 'Got it. This looks like a {c} issue.', prio: 'Priority {p}', becauseUrg: 'raised because you mentioned: {w}', becauseLow: 'lowered because it sounds non‑urgent', matched: 'Matched: {w}',
      tryThis: 'Try these steps first ({m} min):', solved: 'That fixed it', notSolved: 'Still not working',
      secNow: 'Security issues are always handled by a person. I opened a ticket right away — meanwhile:',
      unknown: 'I could not match this to a known issue, so I sent it straight to a technician.',
      ticketMade: 'Ticket {id} created with priority {p}. A technician will respond by {d}.', glad: 'Great, glad it is fixed! No ticket needed.', tooShort: 'Could you add a few more details? A sentence or two helps me route it.',
      anon: 'Guest user',
      'st.all': 'All', 'st.open': 'Open', 'st.new': 'New', 'st.progress': 'In progress', 'st.waiting': 'Waiting on user', 'st.resolved': 'Resolved',
      overdue: 'Overdue {t}', inT: 'in {t}', done: 'Done', noTickets: 'No tickets here.',
      take: 'Take ticket', reply: 'Send reply', resolve: 'Resolve', reopen: 'Reopen', mine: 'You', unassigned: 'Unassigned',
      kReq: 'Requester', kOwner: 'Owner', kCreated: 'Created', kDue: 'Respond by', kCat: 'Category',
      whyT: 'Why this priority', whyNone: 'No keywords matched — default routing.',
      tTaken: 'Ticket assigned to you', tReplied: 'Reply sent', tResolved: 'Ticket resolved', tReopened: 'Ticket reopened', tReset: 'Demo data restored', eReply: 'Write a reply first.',
      k1: 'Open tickets', k2: 'At risk or overdue', k3: 'Solved by self‑service', k4: 'Average resolution', k3s: '{n} of {t} conversations', k1s: '{n} unassigned', k2s: 'Need attention now', k4s: 'Last {n} resolved',
      min: 'min', hr: 'h', day: 'd', mins: '~{m}',
      cat: { network: 'Network', access: 'Access & passwords', email: 'Email', printer: 'Printer', hardware: 'Hardware', software: 'Software', security: 'Security', general: 'General' }
    },
    es: {
      back: 'Portafolio', badge: 'Demo · datos ficticios', tour: 'Ver recorrido', reset: 'Reiniciar demo',
      title: 'Mesa de ayuda Northwind', subtitle: 'Describe tu problema con tus palabras — Triage lo clasifica, sugiere una solución y solo escala cuando hace falta.',
      'tab.chat': 'Pedir ayuda', 'tab.queue': 'Cola de técnicos', 'tab.kb': 'Base de conocimiento', 'tab.stats': 'Estadísticas',
      bot: 'Asistente Triage', botSub: 'Suele responder al instante', you: 'Tu nombre', placeholder: 'Describe tu problema…', send: 'Enviar',
      'how.title': 'Cómo decide Triage', 'how.1': 'Entender', 'how.1p': 'Palabras clave en español e inglés ubican tu mensaje en una categoría.',
      'how.2': 'Priorizar', 'how.2p': 'Palabras de urgencia, impacto y seguridad suben la prioridad.', 'how.3': 'Autoservicio', 'how.3p': 'Los problemas comunes reciben pasos guiados de la base de conocimiento.',
      'how.4': 'Escalar', 'how.4p': 'Si sigue fallando, se crea un ticket con fecha límite de respuesta para un técnico.',
      'sla.title': 'Tiempos de respuesta', 'sla.p1': 'Crítica · 1 hora', 'sla.p2': 'Alta · 4 horas', 'sla.p3': 'Normal · 1 día', 'sla.p4': 'Baja · 3 días',
      'q.search': 'Buscar tickets', 'c.ticket': 'Ticket', 'c.cat': 'Categoría', 'c.prio': 'Prioridad', 'c.req': 'Solicitante', 'c.sla': 'Responder antes de', 'c.status': 'Estado',
      'kb.search': 'Buscar artículos', 'kb.hint': 'Estas son las guías que sugiere el asistente.', 's.byCat': 'Tickets por categoría', 's.byPrio': 'Tickets abiertos por prioridad',
      'd.conv': 'Conversación', 'd.reply': 'Responder al solicitante',
      greet: '¡Hola! Soy el asistente Triage. Cuéntame qué pasa — por ejemplo "se me cae el Wi‑Fi" o "le di clic a un enlace raro". Puedes escribir en español o inglés.',
      quick: ['Se me desconecta el Wi‑Fi', 'Olvidé mi contraseña y mi cuenta está bloqueada', 'Outlook no sincroniza mi correo', 'La impresora tiene un atasco', 'Le di clic a un enlace sospechoso, urgente', 'Excel se cierra solo'],
      understood: 'Entendido. Parece un problema de {c}.', prio: 'Prioridad {p}', becauseUrg: 'subió porque mencionaste: {w}', becauseLow: 'bajó porque no suena urgente', matched: 'Coincidencias: {w}',
      tryThis: 'Prueba primero estos pasos ({m} min):', solved: 'Ya quedó', notSolved: 'Sigue fallando',
      secNow: 'Los temas de seguridad siempre los atiende una persona. Ya abrí un ticket — mientras tanto:',
      unknown: 'No pude relacionarlo con un problema conocido, así que lo envié directo a un técnico.',
      ticketMade: 'Se creó el ticket {id} con prioridad {p}. Un técnico responderá antes de {d}.', glad: '¡Qué bien que quedó! No hace falta ticket.', tooShort: '¿Puedes dar un poco más de detalle? Una o dos frases me ayudan a canalizarlo.',
      anon: 'Usuario invitado',
      'st.all': 'Todos', 'st.open': 'Abiertos', 'st.new': 'Nuevo', 'st.progress': 'En proceso', 'st.waiting': 'Esperando usuario', 'st.resolved': 'Resuelto',
      overdue: 'Vencido hace {t}', inT: 'en {t}', done: 'Listo', noTickets: 'No hay tickets aquí.',
      take: 'Tomar ticket', reply: 'Enviar respuesta', resolve: 'Resolver', reopen: 'Reabrir', mine: 'Tú', unassigned: 'Sin asignar',
      kReq: 'Solicitante', kOwner: 'Responsable', kCreated: 'Creado', kDue: 'Responder antes de', kCat: 'Categoría',
      whyT: 'Por qué esta prioridad', whyNone: 'Sin palabras clave — canalización por defecto.',
      tTaken: 'Ticket asignado a ti', tReplied: 'Respuesta enviada', tResolved: 'Ticket resuelto', tReopened: 'Ticket reabierto', tReset: 'Datos de la demo restaurados', eReply: 'Escribe una respuesta primero.',
      k1: 'Tickets abiertos', k2: 'En riesgo o vencidos', k3: 'Resueltos por autoservicio', k4: 'Tiempo promedio de solución', k3s: '{n} de {t} conversaciones', k1s: '{n} sin asignar', k2s: 'Requieren atención ya', k4s: 'Últimos {n} resueltos',
      min: 'min', hr: 'h', day: 'd', mins: '~{m}',
      cat: { network: 'Red', access: 'Accesos y contraseñas', email: 'Correo', printer: 'Impresora', hardware: 'Hardware', software: 'Software', security: 'Seguridad', general: 'General' }
    }
  });
  var T = L.t;
  function catName(c) { return T('cat')[c] || c; }

  /* ---------- Knowledge base ---------- */
  var KB = {
    network: { m: 5, t: { en: 'Wi‑Fi drops or internet is slow', es: 'El Wi‑Fi se cae o el internet está lento' },
      s: { en: ['Turn Wi‑Fi off and on again.', 'Forget the network and reconnect with your credentials.', 'Restart the laptop.', 'Move closer to an access point or try a network cable.', 'Ask a colleague nearby — if it fails for them too, tell me.'],
           es: ['Apaga y vuelve a encender el Wi‑Fi.', 'Olvida la red y vuelve a conectarte con tus credenciales.', 'Reinicia la laptop.', 'Acércate a un punto de acceso o prueba con cable de red.', 'Pregunta a un compañero cercano — si a él también le falla, avísame.'] } },
    access: { m: 5, t: { en: 'Locked out or forgot password', es: 'Cuenta bloqueada u olvidé mi contraseña' },
      s: { en: ['Use "Forgot password" on the sign‑in page to reset it yourself.', 'If the account is locked after several attempts, wait 15 minutes.', 'Check Caps Lock and keyboard language.', 'For MFA codes, open the authenticator app and make sure the phone time is automatic.', 'Got a new phone? A technician must re‑register your MFA.'],
           es: ['Usa "Olvidé mi contraseña" en la pantalla de inicio para restablecerla tú mismo.', 'Si se bloqueó por varios intentos, espera 15 minutos.', 'Revisa Bloq Mayús y el idioma del teclado.', 'Para códigos MFA, abre la app autenticadora y verifica que la hora del celular sea automática.', '¿Celular nuevo? Un técnico debe registrar de nuevo tu MFA.'] } },
    email: { m: 4, t: { en: 'Outlook is not syncing', es: 'Outlook no sincroniza' },
      s: { en: ['Confirm you have internet.', 'Look at the bottom bar: if it says "Working offline", turn it off from the Send/Receive tab.', 'Close and reopen Outlook.', 'Check that your mailbox is not full.', 'Open webmail — if it works there, the problem is the app.'],
           es: ['Confirma que tienes internet.', 'Revisa la barra inferior: si dice "Trabajar sin conexión", desactívalo en la pestaña Enviar y recibir.', 'Cierra y vuelve a abrir Outlook.', 'Verifica que tu buzón no esté lleno.', 'Abre el correo web — si ahí funciona, el problema es la app.'] } },
    printer: { m: 5, t: { en: 'The printer will not print', es: 'La impresora no imprime' },
      s: { en: ['Check paper, toner and any message on the printer screen.', 'Open the print queue and cancel stuck jobs.', 'Turn the printer off for 30 seconds.', 'Make sure you selected the right printer.', 'For jams, open the indicated tray and pull the paper gently in the direction it travels.'],
           es: ['Revisa papel, tóner y cualquier mensaje en la pantalla de la impresora.', 'Abre la cola de impresión y cancela los trabajos atorados.', 'Apaga la impresora 30 segundos.', 'Verifica que elegiste la impresora correcta.', 'Si hay atasco, abre la bandeja indicada y jala el papel con cuidado en el sentido en que avanza.'] } },
    hardware: { m: 6, t: { en: 'Laptop will not turn on or battery issues', es: 'La laptop no enciende o falla la batería' },
      s: { en: ['Connect the original charger and look for the charging light.', 'Hold the power button for 15 seconds, then try again.', 'Unplug docks and USB devices.', 'Try a different outlet.', 'If the battery looks swollen or smells hot, stop using it and tell me.'],
           es: ['Conecta el cargador original y busca la luz de carga.', 'Mantén presionado el botón de encendido 15 segundos y vuelve a intentar.', 'Desconecta docks y dispositivos USB.', 'Prueba otro contacto.', 'Si la batería se ve inflada o huele a quemado, deja de usarla y avísame.'] } },
    software: { m: 5, t: { en: 'An app crashes or needs installing', es: 'Una app se cierra o hay que instalarla' },
      s: { en: ['Close and reopen the app.', 'Install pending updates.', 'Restart the computer.', 'Install software only from the company portal, never from random websites.', 'Write down the exact error message.'],
           es: ['Cierra y vuelve a abrir la app.', 'Instala las actualizaciones pendientes.', 'Reinicia la computadora.', 'Instala programas solo desde el portal de la empresa, nunca de sitios al azar.', 'Anota el mensaje de error exacto.'] } },
    security: { m: 2, t: { en: 'Suspicious email or link', es: 'Correo o enlace sospechoso' },
      s: { en: ['Do not click anything else or reply to the message.', 'If you already clicked, disconnect from Wi‑Fi.', 'Do not type any password.', 'Report it with the "Report phishing" button.', 'A technician will contact you shortly.'],
           es: ['No hagas clic en nada más ni respondas el mensaje.', 'Si ya le diste clic, desconéctate del Wi‑Fi.', 'No escribas ninguna contraseña.', 'Repórtalo con el botón "Reportar phishing".', 'Un técnico te contactará en breve.'] } }
  };

  /* ---------- Classifier (rule based, EN + ES) ---------- */
  var RULES = {
    security: ['phishing', 'virus', 'malware', 'suspicious', 'sospechos', 'hacked', 'hacke', 'ransomware', 'scam', 'fraude', 'estafa', 'weird link', 'enlace raro', 'link raro', 'stolen', 'robaron', 'robo'],
    access: ['password', 'contrasena', 'login', 'log in', 'sign in', 'iniciar sesion', 'locked', 'bloquead', 'mfa', 'authenticator', 'autenticador', '2fa', 'acceso', 'access', 'account', 'cuenta', 'forgot', 'olvide'],
    network: ['wifi', 'wi-fi', 'wi fi', 'internet', 'network', 'vpn', 'conexion', 'connection', 'connect', 'conecta', 'se cae', 'drops', 'dropping', 'router', 'red '],
    email: ['outlook', 'email', 'e-mail', 'correo', 'mail', 'inbox', 'bandeja', 'calendar', 'calendario', 'sync', 'sincroniza'],
    printer: ['printer', 'impresora', 'print', 'imprim', 'scan', 'escane', 'toner', 'paper', 'papel', 'atasco', 'jam'],
    hardware: ['laptop', 'screen', 'pantalla', 'keyboard', 'teclado', 'mouse', 'battery', 'bateria', 'charger', 'cargador', 'monitor', 'turn on', 'no prende', 'no enciende', 'broken', 'roto', 'rota', 'overheat', 'se calienta'],
    software: ['install', 'instal', 'excel', 'word', 'teams', 'app', 'program', 'update', 'actualiza', 'license', 'licencia', 'crash', 'se cierra', 'error', 'freez', 'se congela']
  };
  var BASE = { security: 2, network: 3, access: 3, email: 3, printer: 4, hardware: 3, software: 4, general: 3 };
  var URGENT = ['urgent', 'urgente', 'asap', 'immediately', 'inmediat', 'everyone', 'todos', 'todo el equipo', 'whole office', 'toda la oficina', 'nadie', 'nobody', 'down', 'caido', "can't work", 'cannot work', 'no puedo trabajar', 'client', 'cliente', 'meeting', 'junta', 'presentation', 'presentacion', 'director', 'ceo', 'clicked', 'di clic', 'le di clic'];
  var CALM = ['when you can', 'cuando puedas', 'no urge', 'not urgent', 'sin prisa', 'question', 'pregunta', 'how do i', 'como puedo'];
  function norm(s) { return ' ' + String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ') + ' '; }
  function classify(text) {
    var t = norm(text), best = 'general', bestScore = 0, matched = [];
    Object.keys(RULES).forEach(function (c) {
      var hits = RULES[c].filter(function (w) { return t.indexOf(w) !== -1; });
      var score = hits.length + (c === 'security' && hits.length ? 1 : 0);
      if (score > bestScore) { best = c; bestScore = score; matched = hits; }
    });
    var urg = URGENT.filter(function (w) { return t.indexOf(w) !== -1; });
    var calm = CALM.filter(function (w) { return t.indexOf(w) !== -1; });
    var p = BASE[best];
    if (urg.length) p -= Math.min(2, urg.length);
    else if (calm.length) p += 1;
    p = Math.max(1, Math.min(4, p));
    return { cat: best, prio: p, matched: matched.map(function (w) { return w.trim(); }), urg: urg, calm: calm.length > 0 && !urg.length };
  }

  /* ---------- Time ---------- */
  var SLA = { 1: 60, 2: 240, 3: 1440, 4: 4320 }; // minutes
  function since(ms) {
    var m = Math.max(1, Math.round(Math.abs(ms) / 60000));
    if (m < 60) return m + ' ' + T('min');
    if (m < 1440) return Math.round(m / 60) + ' ' + T('hr');
    return Math.round(m / 1440) + ' ' + T('day');
  }
  function fmtTime(ms) {
    try { return new Date(ms).toLocaleString(L.lang === 'es' ? 'es-MX' : 'en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; }
  }

  /* ---------- Data ---------- */
  function seed() {
    var now = Date.now(), M = 60000;
    var raw = [
      ['Whole sales team without internet since 9am', 'Todo el equipo de ventas sin internet desde las 9', 'network', 1, 'Mateo Cruz', 25, 'progress', 'me'],
      ['Clicked a link in a fake invoice email', 'Di clic en un enlace de una factura falsa', 'security', 1, 'Lucía Peña', 40, 'new', null],
      ['Cannot sign in, MFA code rejected', 'No puedo entrar, rechaza el código MFA', 'access', 2, 'Dana Ruiz', 150, 'waiting', 'me'],
      ['Outlook calendar not syncing with phone', 'El calendario de Outlook no sincroniza con el celular', 'email', 3, 'Elena Ríos', 300, 'new', null],
      ['Laptop overheats and shuts down', 'La laptop se calienta y se apaga', 'hardware', 3, 'Iker Salas', 700, 'progress', 'me'],
      ['Need Power BI installed', 'Necesito que me instalen Power BI', 'software', 4, 'Sara Ibarra', 1500, 'new', null],
      ['Second floor printer keeps jamming', 'La impresora del segundo piso se atasca', 'printer', 4, 'Tomás Vega', 2600, 'waiting', 'me'],
      ['Monitor flickers when connected to dock', 'El monitor parpadea conectado al dock', 'hardware', 3, 'Alex Moreno', 1700, 'new', null],
      ['VPN disconnects every few minutes', 'La VPN se desconecta cada pocos minutos', 'network', 2, 'Iker Salas', 3000, 'resolved', 'me', 180],
      ['Forgot password after vacation', 'Olvidé mi contraseña después de vacaciones', 'access', 3, 'Mateo Cruz', 3900, 'resolved', 'me', 35],
      ['Excel crashes opening large file', 'Excel se cierra al abrir un archivo grande', 'software', 4, 'Lucía Peña', 4200, 'resolved', 'me', 900],
      ['Phishing email impersonating the bank', 'Correo de phishing suplantando al banco', 'security', 2, 'Elena Ríos', 4600, 'resolved', 'me', 50]
    ];
    var tickets = raw.map(function (r, i) {
      var created = now - r[5] * M;
      var t = { id: 'TR-' + (1040 + i), subj: { en: r[0], es: r[1] }, cat: r[2], prio: r[3], req: r[4], created: created, due: created + SLA[r[3]] * M,
        status: r[6], owner: r[7], why: (function (c) { return c.matched.concat(c.urg.map(function (w) { return w.trim(); })); })(classify(r[0])), resolvedAt: r[8] ? created + r[8] * M : null,
        thread: [{ by: 'user', t: r[0], at: created }] };
      if (r[6] === 'waiting') t.thread.push({ by: 'tech', t: 'Could you send a screenshot of the error, please?', at: created + 20 * M });
      return t;
    });
    return { v: 1, tickets: tickets, seq: 1052, selfSolved: 18, escalated: 7 };
  }
  function validate(d) {
    if (!d || d.v !== 1 || !Array.isArray(d.tickets)) return null;
    var ST = { new: 1, progress: 1, waiting: 1, resolved: 1 };
    d.tickets = d.tickets.filter(function (t) { return t && ST[t.status] && BASE[t.cat] && t.prio >= 1 && t.prio <= 4; }).map(function (t) {
      var subj = typeof t.subj === 'object' ? { en: clean(t.subj.en, 80), es: clean(t.subj.es, 80) } : clean(t.subj, 80);
      return { id: clean(t.id, 10), subj: subj, cat: t.cat, prio: t.prio, req: clean(t.req, 40), created: +t.created || Date.now(), due: +t.due || Date.now(),
        status: t.status, owner: t.owner === 'me' ? 'me' : null, why: (t.why || []).slice(0, 10).map(function (w) { return clean(w, 30); }),
        resolvedAt: t.resolvedAt ? +t.resolvedAt : null,
        thread: (t.thread || []).slice(-30).map(function (m) { return { by: m.by === 'tech' ? 'tech' : 'user', t: clean(m.t, 400), at: +m.at || Date.now() }; }) };
    });
    d.seq = +d.seq || 1100; d.selfSolved = +d.selfSolved || 0; d.escalated = +d.escalated || 0;
    return d;
  }
  var db = validate(STORE.load()) || seed();
  function save() { STORE.save(db); }
  function subj(t) { return typeof t.subj === 'object' ? (t.subj[L.lang] || t.subj.en) : t.subj; }

  /* ---------- State ---------- */
  var state = { view: 'chat', filter: 'open', q: '', open: null, kq: '' };
  function $(id) { return document.getElementById(id); }
  var PRIO_CLS = { 1: 'err', 2: 'warn', 3: 'acc', 4: '' };
  function prioPill(p) { return h('span', { class: 'pill plain ' + PRIO_CLS[p], text: 'P' + p }); }
  function statusPill(s) { return h('span', { class: 'pill ' + (s === 'resolved' ? 'ok' : s === 'waiting' ? '' : s === 'new' ? 'warn' : 'acc'), text: T('st.' + s) }); }

  function renderHeader() {
    document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-view') === state.view); });
    document.querySelectorAll('.view').forEach(function (v) { v.classList.toggle('on', v.id === 'view-' + state.view); });
    $('openCount').textContent = String(db.tickets.filter(function (t) { return t.status !== 'resolved'; }).length);
  }

  /* ---------- Chat ---------- */
  var chatStarted = false;
  function scrollChat() { var m = $('msgs'); m.scrollTop = m.scrollHeight; }
  function botSay(nodes) { var b = h('div', { class: 'msg bot' }, nodes); $('msgs').appendChild(b); scrollChat(); return b; }
  function meSay(text) { $('msgs').appendChild(h('div', { class: 'msg me', text: text })); scrollChat(); }
  function typing(cb) {
    var t = h('div', { class: 'typing' }, [h('i'), h('i'), h('i')]); $('msgs').appendChild(t); scrollChat();
    setTimeout(function () { t.remove(); cb(); }, 650);
  }
  function startChat() {
    if (chatStarted) return; chatStarted = true;
    clear($('msgs')); botSay([h('p', { text: T('greet') })]); renderQuick();
  }
  function renderQuick() {
    var q = $('quick'); clear(q);
    T('quick').forEach(function (s) { q.appendChild(h('button', { type: 'button', class: 'chip', text: s, onclick: function () { $('input').value = s; send(); } })); });
  }
  function requester() { return clean($('who').value, 40) || T('anon'); }

  function send() {
    var text = clean($('input').value, 400);
    if (!text) return;
    $('input').value = ''; autoGrow();
    meSay(text);
    if (text.split(/\s+/).length < 2) { typing(function () { botSay([h('p', { text: T('tooShort') })]); }); return; }
    var r = classify(text);
    typing(function () { respond(text, r); });
  }
  function reasonLine(r) {
    var parts = [];
    if (r.matched.length) parts.push(T('matched', { w: r.matched.join(', ') }));
    if (r.urg.length) parts.push(T('becauseUrg', { w: r.urg.map(function (w) { return w.trim(); }).join(', ') }));
    else if (r.calm) parts.push(T('becauseLow'));
    return parts.join(' · ');
  }
  function respond(text, r) {
    var meta = h('div', { class: 'meta' }, [h('span', { class: 'pill acc', text: catName(r.cat) }), h('span', { class: 'pill plain ' + PRIO_CLS[r.prio], text: T('prio', { p: 'P' + r.prio }) })]);
    var why = reasonLine(r);
    var art = KB[r.cat];
    if (r.cat === 'general') {
      var t0 = createTicket(text, r);
      botSay([h('p', { text: T('unknown') }), meta, why ? h('p', { class: 'why-line', text: why }) : null, h('p', { text: T('ticketMade', { id: t0.id, p: 'P' + t0.prio, d: fmtTime(t0.due) }) })]);
      return;
    }
    if (r.cat === 'security') {
      var t1 = createTicket(text, r);
      var ol1 = h('ol'); art.s[L.lang].forEach(function (s) { ol1.appendChild(h('li', { text: s })); });
      botSay([h('p', { text: T('understood', { c: catName(r.cat).toLowerCase() }) }), meta, why ? h('p', { class: 'why-line', text: why }) : null,
        h('p', { text: T('secNow') }), ol1, h('p', { text: T('ticketMade', { id: t1.id, p: 'P' + t1.prio, d: fmtTime(t1.due) }) })]);
      return;
    }
    var ol = h('ol'); art.s[L.lang].forEach(function (s) { ol.appendChild(h('li', { text: s })); });
    var acts = h('div', { class: 'acts' });
    var b = botSay([h('p', { text: T('understood', { c: catName(r.cat).toLowerCase() }) }), meta, why ? h('p', { class: 'why-line', text: why }) : null,
      h('p', { text: T('tryThis', { m: art.m }) }), ol, acts]);
    function lock() { acts.querySelectorAll('button').forEach(function (x) { x.disabled = true; }); }
    acts.appendChild(h('button', { type: 'button', class: 'btn sm', text: T('solved'), onclick: function () {
      lock(); db.selfSolved++; save(); meSay(T('solved')); typing(function () { botSay([h('p', { text: T('glad') })]); });
    } }));
    acts.appendChild(h('button', { type: 'button', class: 'btn ghost sm', text: T('notSolved'), onclick: function () {
      lock(); meSay(T('notSolved'));
      var t = createTicket(text, r);
      typing(function () { botSay([h('p', { text: T('ticketMade', { id: t.id, p: 'P' + t.prio, d: fmtTime(t.due) }) })]); });
    } }));
    void b;
  }
  function createTicket(text, r) {
    db.seq++;
    var now = Date.now();
    var t = { id: 'TR-' + db.seq, subj: clean(text, 80), cat: r.cat, prio: r.prio, req: requester(), created: now, due: now + SLA[r.prio] * 60000,
      status: 'new', owner: null, why: r.matched.concat(r.urg.map(function (w) { return w.trim(); })).slice(0, 10), resolvedAt: null,
      thread: [{ by: 'user', t: clean(text, 400), at: now }] };
    db.tickets.unshift(t); db.escalated++; save(); renderHeader();
    return t;
  }
  function autoGrow() { var i = $('input'); i.style.height = 'auto'; i.style.height = Math.min(140, i.scrollHeight) + 'px'; }

  /* ---------- Queue ---------- */
  function slaInfo(t) {
    if (t.status === 'resolved') return { t: T('done'), c: 'sla-ok' };
    var left = t.due - Date.now(), win = SLA[t.prio] * 60000;
    if (left < 0) return { t: T('overdue', { t: since(left) }), c: 'sla-late' };
    return { t: T('inT', { t: since(left) }), c: left < win * 0.25 ? 'sla-warn' : 'sla-ok' };
  }
  function renderChips() {
    var c = $('statusChips'); clear(c);
    ['open', 'new', 'progress', 'waiting', 'resolved', 'all'].forEach(function (s) {
      var n = db.tickets.filter(function (t) { return s === 'all' || (s === 'open' ? t.status !== 'resolved' : t.status === s); }).length;
      c.appendChild(h('button', { type: 'button', class: 'chip' + (state.filter === s ? ' on' : ''), text: T('st.' + s) + ' · ' + n,
        onclick: function () { state.filter = s; renderQueue(); } }));
    });
  }
  function renderQueue() {
    renderChips();
    var q = norm(state.q).trim();
    var list = db.tickets.filter(function (t) {
      if (state.filter === 'open' && t.status === 'resolved') return false;
      if (state.filter !== 'open' && state.filter !== 'all' && t.status !== state.filter) return false;
      return !q || norm([t.id, subj(t), t.req, catName(t.cat)].join(' ')).indexOf(q) !== -1;
    }).sort(function (a, b) {
      if ((a.status === 'resolved') !== (b.status === 'resolved')) return a.status === 'resolved' ? 1 : -1;
      return a.status === 'resolved' ? b.resolvedAt - a.resolvedAt : (a.prio - b.prio) || (a.due - b.due);
    });
    var tb = $('tRows'); clear(tb);
    if (!list.length) tb.appendChild(h('tr', null, [h('td', { colspan: '6', class: 'empty-row', text: T('noTickets') })]));
    list.forEach(function (t) {
      var s = slaInfo(t);
      tb.appendChild(h('tr', { class: state.open === t.id ? 'sel' : '', tabindex: '0', onclick: function () { openTicket(t.id); }, onkeydown: function (e) { if (e.key === 'Enter') openTicket(t.id); } }, [
        h('td', null, [h('div', { class: 'cell-main' }, [h('b', { text: subj(t) }), h('small', { class: 'mono', text: t.id + ' · ' + since(Date.now() - t.created) })])]),
        h('td', { text: catName(t.cat) }), h('td', null, [prioPill(t.prio)]), h('td', { text: t.req }),
        h('td', { class: s.c, text: s.t }), h('td', null, [statusPill(t.status)])
      ]));
    });
  }

  function byId(id) { for (var i = 0; i < db.tickets.length; i++) if (db.tickets[i].id === id) return db.tickets[i]; return null; }
  function openTicket(id) {
    state.open = id; renderTicket();
    $('drawer').classList.add('open'); $('drawer').setAttribute('aria-hidden', 'false'); $('backdrop').hidden = false;
    renderQueue();
  }
  function closeTicket() {
    state.open = null; $('drawer').classList.remove('open'); $('drawer').setAttribute('aria-hidden', 'true'); $('backdrop').hidden = true;
    if (state.view === 'queue') renderQueue();
  }
  function renderTicket() {
    var t = byId(state.open); if (!t) { closeTicket(); return; }
    $('dId').textContent = t.id; $('dSubj').textContent = subj(t);
    var p = $('dPills'); clear(p); p.appendChild(prioPill(t.prio)); p.appendChild(statusPill(t.status)); p.appendChild(h('span', { class: 'pill plain', text: catName(t.cat) }));
    var kv = $('dKv'); clear(kv);
    var s = slaInfo(t);
    [[T('kReq'), t.req], [T('kOwner'), t.owner ? T('mine') : T('unassigned')], [T('kCreated'), fmtTime(t.created)], [T('kDue'), fmtTime(t.due) + ' · ' + s.t]].forEach(function (x) {
      kv.appendChild(h('dt', { text: x[0] })); kv.appendChild(h('dd', { text: x[1] }));
    });
    var w = $('dWhy'); clear(w);
    w.appendChild(h('b', { text: T('whyT') }));
    w.appendChild(h('span', { text: t.why.length ? t.why.join(', ') : T('whyNone') }));
    var th = $('dThread'); clear(th);
    t.thread.forEach(function (m) {
      var text = m.t;
      if (m.by === 'user' && typeof t.subj === 'object' && m.t === t.subj.en) text = subj(t);
      if (m.by === 'tech' && m.t === 'Could you send a screenshot of the error, please?' && L.lang === 'es') text = '¿Me puedes mandar una captura del error, por favor?';
      th.appendChild(h('div', { class: 'tmsg ' + m.by }, [h('small', { text: (m.by === 'tech' ? T('mine') : t.req) + ' · ' + fmtTime(m.at) }), text]));
    });
    var a = $('dActions'); clear(a);
    function btn(label, cls, fn) { a.appendChild(h('button', { type: 'button', class: 'btn sm ' + (cls || ''), text: label, onclick: fn })); }
    if (t.status !== 'resolved') {
      if (!t.owner) btn(T('take'), '', function () { t.owner = 'me'; t.status = 'progress'; done(T('tTaken')); });
      btn(T('reply'), t.owner ? '' : 'ghost', function () {
        var r = clean($('dReply').value, 400); if (!r) { K.toast(T('eReply')); return; }
        t.thread.push({ by: 'tech', t: r, at: Date.now() }); t.owner = 'me'; t.status = 'waiting'; $('dReply').value = ''; done(T('tReplied'));
      });
      btn(T('resolve'), 'ghost', function () { t.status = 'resolved'; t.resolvedAt = Date.now(); t.owner = 'me'; done(T('tResolved')); });
    } else {
      btn(T('reopen'), 'ghost', function () { t.status = 'progress'; t.resolvedAt = null; done(T('tReopened')); });
    }
  }
  function done(msg) { save(); K.toast(msg); renderTicket(); renderHeader(); renderQueue(); }

  /* ---------- KB ---------- */
  function renderKb() {
    var g = $('kbGrid'); clear(g);
    var q = norm(state.kq).trim();
    Object.keys(KB).forEach(function (c) {
      var a = KB[c];
      var hay = norm(a.t[L.lang] + ' ' + a.s[L.lang].join(' ') + ' ' + catName(c));
      if (q && hay.indexOf(q) === -1) return;
      var ol = h('ol'); a.s[L.lang].forEach(function (s) { ol.appendChild(h('li', { text: s })); });
      g.appendChild(h('article', { class: 'art' }, [h('span', { class: 'pill acc', text: catName(c) }), h('h3', { text: a.t[L.lang] }), ol,
        h('p', { class: 'foot', text: T('mins', { m: a.m }) + ' ' + T('min') })]));
    });
  }

  /* ---------- Stats ---------- */
  function renderStats() {
    var open = db.tickets.filter(function (t) { return t.status !== 'resolved'; });
    var risk = open.filter(function (t) { return slaInfo(t).c !== 'sla-ok'; });
    var res = db.tickets.filter(function (t) { return t.status === 'resolved' && t.resolvedAt; });
    var avg = res.length ? res.reduce(function (s, t) { return s + (t.resolvedAt - t.created); }, 0) / res.length : 0;
    var total = db.selfSolved + db.escalated;
    var k = $('kpis'); clear(k);
    [[T('k1'), open.length, T('k1s', { n: open.filter(function (t) { return !t.owner; }).length }), ''],
     [T('k2'), risk.length, T('k2s'), risk.length ? 'alert' : ''],
     [T('k3'), (total ? Math.round(db.selfSolved / total * 100) : 0) + '%', T('k3s', { n: db.selfSolved, t: total }), ''],
     [T('k4'), avg ? since(avg) : '—', T('k4s', { n: res.length }), '']].forEach(function (x) {
      k.appendChild(h('div', { class: 'kpi ' + x[3] }, [h('span', { text: x[0] }), h('b', { text: String(x[1]) }), h('small', { text: x[2] })]));
    });
    var bc = $('byCat'); clear(bc);
    var cats = {}; db.tickets.forEach(function (t) { cats[t.cat] = (cats[t.cat] || 0) + 1; });
    var max = Math.max.apply(null, Object.keys(cats).map(function (c) { return cats[c]; }).concat([1]));
    Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; }).forEach(function (c) { bc.appendChild(bar(catName(c), cats[c] / max, String(cats[c]))); });
    var bp = $('byPrio'); clear(bp);
    [1, 2, 3, 4].forEach(function (p) {
      var n = open.filter(function (t) { return t.prio === p; }).length;
      bp.appendChild(bar('P' + p + ' · ' + T('sla.p' + p).split(' · ')[0], open.length ? n / open.length : 0, String(n)));
    });
  }
  function bar(label, frac, val) {
    var fill = h('i'); fill.style.width = Math.round(frac * 100) + '%';
    return h('div', { class: 'bar' }, [h('span', { text: label }), h('span', { class: 'track' }, [fill]), h('b', { text: val })]);
  }

  /* ---------- Render ---------- */
  function renderAll() {
    renderHeader();
    if (state.view === 'chat') startChat();
    if (state.view === 'queue') renderQueue();
    if (state.view === 'kb') renderKb();
    if (state.view === 'stats') renderStats();
    if (state.open) renderTicket();
  }

  document.querySelectorAll('#tabs button').forEach(function (b) { b.addEventListener('click', function () { state.view = b.getAttribute('data-view'); renderAll(); }); });
  $('send').addEventListener('click', send);
  $('input').addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
  $('input').addEventListener('input', autoGrow);
  $('qq').addEventListener('input', function () { state.q = clean(this.value, 60); renderQueue(); });
  $('kq').addEventListener('input', function () { state.kq = clean(this.value, 60); renderKb(); });
  $('dClose').addEventListener('click', closeTicket);
  $('backdrop').addEventListener('click', closeTicket);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.open && !document.querySelector('.dk-tour')) closeTicket(); });
  $('resetBtn').addEventListener('click', function () { STORE.clear(); db = seed(); save(); closeTicket(); chatStarted = false; K.toast(T('tReset')); renderAll(); });
  setInterval(function () { if (state.view === 'queue') renderQueue(); }, 60000);

  /* ---------- Tour ---------- */
  function go(view) { return function () { closeTicket(); if (state.view !== view) { state.view = view; renderAll(); } }; }
  var tour = new K.Tour({
    key: 'triage', lang: function () { return L.lang; },
    steps: [
      { target: null, title: { en: 'Welcome to Triage', es: 'Bienvenido a Triage' },
        body: { en: 'A help desk that talks like a person. Users describe problems in their own words; Triage sorts them, helps them fix what they can and sends the rest to a technician.', es: 'Una mesa de ayuda que conversa como una persona. Los usuarios describen su problema con sus palabras; Triage lo ordena, ayuda a resolver lo que se puede y manda el resto a un técnico.' } },
      { target: '#chatPanel', before: go('chat'), title: { en: 'Just describe it', es: 'Solo descríbelo' },
        body: { en: 'Type a problem in English or Spanish, or tap one of the examples. Mention urgency ("everyone", "urgent", "client") and watch the priority change.', es: 'Escribe un problema en español o inglés, o toca un ejemplo. Menciona urgencia ("todos", "urgente", "cliente") y mira cómo cambia la prioridad.' } },
      { target: '#howPanel', before: go('chat'), title: { en: 'Transparent rules', es: 'Reglas transparentes' },
        body: { en: 'Every answer shows which words were matched and why the priority was chosen, plus the response target for each level.', es: 'Cada respuesta muestra qué palabras coincidieron y por qué se eligió la prioridad, además del tiempo de respuesta de cada nivel.' } },
      { target: '#queueBar', before: go('queue'), title: { en: 'The technician side', es: 'El lado del técnico' },
        body: { en: 'Escalated tickets land here sorted by priority and deadline. Filter by status or search.', es: 'Los tickets escalados llegan aquí ordenados por prioridad y fecha límite. Filtra por estado o busca.' } },
      { target: '#tRows', before: go('queue'), title: { en: 'Work a ticket', es: 'Atiende un ticket' },
        body: { en: 'Open one to see the conversation and the classifier\'s reasoning, take it, reply to the user and resolve it. Overdue deadlines turn red.', es: 'Abre uno para ver la conversación y el razonamiento del clasificador, tómalo, responde al usuario y resuélvelo. Las fechas vencidas se ponen en rojo.' } },
      { target: '#tabs', before: go('queue'), title: { en: 'Guides and numbers', es: 'Guías y números' },
        body: { en: 'The knowledge base holds the guides the assistant suggests. Insights shows open tickets, deadlines at risk and how many problems users solved on their own.', es: 'La base de conocimiento tiene las guías que sugiere el asistente. Estadísticas muestra tickets abiertos, fechas en riesgo y cuántos problemas resolvieron los usuarios solos.' } },
      { target: '.top-right', title: { en: 'Always at hand', es: 'Siempre a la mano' },
        body: { en: 'Replay this tour, switch language or reset the demo. The Portfolio button takes you back.', es: 'Repite este recorrido, cambia el idioma o reinicia la demo. El botón Portafolio te regresa.' } }
    ]
  });
  $('tourBtn').addEventListener('click', function () { tour.start(); });

  L.bind(function () { if ($('msgs').children.length <= 1) chatStarted = false; else renderQuick(); renderAll(); });
  save();
  renderAll();
  if (!tour.seen()) setTimeout(function () { tour.start(); }, 400);
})();
