/* Spacio — space booking demo.
   Portfolio mockup: fictional data, stored only in this browser (localStorage).
   Security: user text is only ever written with textContent / setAttribute, never innerHTML. */
(function () {
  'use strict';

  var STORE_KEY = 'spacio.demo.v1';
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- Sites (fictional) ---------- */
  var SITES = {
    office: {
      name: 'Northwind Studio — Level 3',
      meta: 'Workplace · 32 bookable spaces · open 8:00–20:00',
      open: 8 * 60, close: 20 * 60, maxMin: 240,
      types: { desk: 'Desk', booth: 'Focus booth', room: 'Meeting room', lounge: 'Lounge' },
      rooms: [
        { label: 'Open area', x: 40, y: 40, w: 520, h: 300 },
        { label: 'Meeting rooms', x: 600, y: 40, w: 360, h: 300 },
        { label: 'Focus', x: 40, y: 380, w: 300, h: 200 },
        { label: 'Lounge & kitchen', x: 380, y: 380, w: 580, h: 200 }
      ],
      spaces: []
    },
    home: {
      name: 'Alameda Residences — Amenities',
      meta: 'Residence · 9 shared amenities · open 7:00–22:00',
      open: 7 * 60, close: 22 * 60, maxMin: 120,
      types: { gym: 'Gym', terrace: 'Terrace', grill: 'Grill', laundry: 'Laundry', cowork: 'Co‑work', party: 'Event room' },
      rooms: [
        { label: 'Rooftop', x: 40, y: 40, w: 560, h: 260 },
        { label: 'Ground floor', x: 40, y: 340, w: 920, h: 240 },
        { label: 'Wellness', x: 640, y: 40, w: 320, h: 260 }
      ],
      spaces: [
        { id: 'h-ter', name: 'Sky Terrace', type: 'terrace', cap: 20, amen: ['Shade', 'Sound'], x: 70, y: 80, w: 260, h: 190 },
        { id: 'h-g1', name: 'Grill A', type: 'grill', cap: 8, amen: ['Shade'], x: 360, y: 80, w: 210, h: 85 },
        { id: 'h-g2', name: 'Grill B', type: 'grill', cap: 8, amen: [], x: 360, y: 185, w: 210, h: 85 },
        { id: 'h-gym', name: 'Fitness Room', type: 'gym', cap: 6, amen: ['A/C', 'Sound'], x: 670, y: 80, w: 260, h: 190 },
        { id: 'h-l1', name: 'Laundry 1', type: 'laundry', cap: 1, amen: [], x: 70, y: 380, w: 120, h: 80 },
        { id: 'h-l2', name: 'Laundry 2', type: 'laundry', cap: 1, amen: [], x: 70, y: 480, w: 120, h: 80 },
        { id: 'h-cw', name: 'Co‑work Room', type: 'cowork', cap: 6, amen: ['Wi‑Fi', 'Screen', 'A/C'], x: 230, y: 380, w: 260, h: 180 },
        { id: 'h-pr', name: 'Event Room', type: 'party', cap: 30, amen: ['Sound', 'Kitchen', 'A/C'], x: 520, y: 380, w: 260, h: 180 },
        { id: 'h-kid', name: 'Kids Room', type: 'party', cap: 10, amen: ['A/C'], x: 810, y: 380, w: 120, h: 180 }
      ]
    }
  };

  (function buildOffice() {
    var s = SITES.office.spaces, i, r, c, n = 1;
    for (r = 0; r < 3; r++) {
      for (c = 0; c < 6; c++) {
        s.push({ id: 'd' + n, name: 'Desk ' + (n < 10 ? '0' + n : n), type: 'desk', cap: 1,
          amen: c % 2 === 0 ? ['Monitor', 'Dock'] : ['Monitor'],
          x: 70 + c * 80 + (c > 2 ? 20 : 0), y: 80 + r * 85, w: 64, h: 56 });
        n++;
      }
    }
    var rooms = [
      { id: 'r-ceiba', name: 'Ceiba', cap: 10, amen: ['Screen', 'Video', 'Whiteboard'], x: 630, y: 80, w: 150, h: 120 },
      { id: 'r-agave', name: 'Agave', cap: 6, amen: ['Screen', 'Video'], x: 790, y: 80, w: 140, h: 120 },
      { id: 'r-nopal', name: 'Nopal', cap: 4, amen: ['Screen'], x: 630, y: 210, w: 110, h: 100 },
      { id: 'r-maguey', name: 'Maguey', cap: 4, amen: ['Whiteboard'], x: 750, y: 210, w: 85, h: 100 },
      { id: 'r-salvia', name: 'Salvia', cap: 2, amen: ['Video'], x: 845, y: 210, w: 85, h: 100 }
    ];
    rooms.forEach(function (o) { o.type = 'room'; s.push(o); });
    for (i = 1; i <= 4; i++) {
      s.push({ id: 'b' + i, name: 'Booth ' + i, type: 'booth', cap: 1, amen: ['Video'], x: 70 + (i - 1) * 66, y: 420, w: 54, h: 70 });
    }
    s.push({ id: 'b5', name: 'Booth 5', type: 'booth', cap: 2, amen: ['Video', 'Screen'], x: 70, y: 505, w: 120, h: 55 });
    s.push({ id: 'b6', name: 'Booth 6', type: 'booth', cap: 2, amen: ['Video'], x: 200, y: 505, w: 120, h: 55 });
    s.push({ id: 'l1', name: 'Garden Lounge', type: 'lounge', cap: 8, amen: ['Sound', 'Kitchen'], x: 410, y: 420, w: 240, h: 140 });
    s.push({ id: 'l2', name: 'Window Bar', type: 'lounge', cap: 6, amen: ['Kitchen'], x: 680, y: 420, w: 250, h: 60 });
    s.push({ id: 'l3', name: 'Huddle Corner', type: 'lounge', cap: 4, amen: ['Screen'], x: 680, y: 500, w: 250, h: 60 });
  })();

  /* ---------- Language ---------- */
  var LANG = window.DemoKit ? window.DemoKit.getLang() : 'en';
  var STR = {
    en: {
      back: 'Portfolio', badge: 'Demo · fictional data', 'mode.office': 'Workplace', 'mode.home': 'Residence',
      tour: 'Take the tour', reset: 'Reset demo', 'tab.plan': 'Floor plan', 'tab.week': 'Week', 'tab.insights': 'Insights', 'tab.mine': 'My bookings',
      'f.title': 'Filter', 'f.cap': 'Minimum capacity', 'f.any': 'Any',
      'lg.free': 'Available', 'lg.part': 'Partly booked', 'lg.full': 'Fully booked', 'lg.sel': 'Selected', 'lg.dim': 'Filtered out',
      hint: 'Click a space to see availability and book it.', 'd.empty': 'Select a space on the plan.', 'd.pick': 'Pick a time',
      'd.name': 'Your name', 'd.note': 'Note (optional)', 'd.book': 'Book',
      'w.title': 'This week at a glance', 'w.hint': 'Bars show how much of each day is booked. Click a cell to open it on the plan.',
      'i.type': 'Utilization by space type', 'i.hours': 'Busiest hours this week', 'i.top': 'Most booked spaces',
      'p.kicker': 'Check‑in pass', 'p.note': 'Demo pass — the pattern is decorative, not a scannable code.',
      office: 'Workplace', home: 'Residence',
      'meta.office': 'Workplace · 32 bookable spaces · open 8:00–20:00', 'meta.home': 'Residence · 9 shared amenities · open 7:00–22:00',
      today: 'Today', person: 'person', people: 'people', upTo: 'Up to {n}', max: '· max {d}',
      available: 'available', partly: 'partly booked', fully: 'fully booked',
      booked: 'Booked', byYou: ' by you', selHint: 'Click a start time, then an end time.',
      errLimit: 'Bookings here are limited to {d}.', errOverlap: 'That range overlaps another booking.', errName: 'Please enter your name.',
      errTaken: 'Someone just booked part of that time.', errMine: 'You already have a booking that overlaps this time.',
      toastBooked: 'Booked {s} · {t}', toastCancel: 'Booking cancelled', toastIn: 'Checked in. Enjoy your space.', toastReset: 'Demo data restored',
      cellTitle: '{s} · {d} · {p}% booked',
      kWeek: 'Bookings this week', kHours: 'Hours booked', kUtil: 'Utilization', kPeak: 'Peak hour', noWeek: 'No bookings this week yet.',
      histTitle: '{h}: {n} bookings',
      noneTitle: 'No upcoming bookings', noneBody: 'Book a space from the floor plan and it will show up here with its check‑in pass.',
      checkedIn: 'Checked in', code: 'Code {c}', showPass: 'Show pass', cancel: 'Cancel',
      checkInNow: 'Check in now', checkInLater: 'Check‑in opens 15 min before', notePh: 'e.g. Client call',
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    es: {
      back: 'Portafolio', badge: 'Demo · datos ficticios', 'mode.office': 'Oficina', 'mode.home': 'Residencial',
      tour: 'Ver recorrido', reset: 'Reiniciar demo', 'tab.plan': 'Plano', 'tab.week': 'Semana', 'tab.insights': 'Estadísticas', 'tab.mine': 'Mis reservas',
      'f.title': 'Filtrar', 'f.cap': 'Capacidad mínima', 'f.any': 'Cualquiera',
      'lg.free': 'Disponible', 'lg.part': 'Parcialmente reservado', 'lg.full': 'Lleno', 'lg.sel': 'Seleccionado', 'lg.dim': 'Fuera del filtro',
      hint: 'Haz clic en un espacio para ver su disponibilidad y reservarlo.', 'd.empty': 'Selecciona un espacio en el plano.', 'd.pick': 'Elige un horario',
      'd.name': 'Tu nombre', 'd.note': 'Nota (opcional)', 'd.book': 'Reservar',
      'w.title': 'La semana de un vistazo', 'w.hint': 'Las barras muestran qué tanto de cada día está reservado. Haz clic en una celda para abrirla en el plano.',
      'i.type': 'Uso por tipo de espacio', 'i.hours': 'Horas más ocupadas de la semana', 'i.top': 'Espacios más reservados',
      'p.kicker': 'Pase de check‑in', 'p.note': 'Pase de demostración — el patrón es decorativo, no es un código escaneable.',
      office: 'Oficina', home: 'Residencial',
      'meta.office': 'Oficina · 32 espacios reservables · abierto 8:00–20:00', 'meta.home': 'Residencial · 9 amenidades compartidas · abierto 7:00–22:00',
      today: 'Hoy', person: 'persona', people: 'personas', upTo: 'Hasta {n}', max: '· máx. {d}',
      available: 'disponible', partly: 'parcialmente reservado', fully: 'lleno',
      booked: 'Reservado', byYou: ' por ti', selHint: 'Haz clic en una hora de inicio y luego en una de fin.',
      errLimit: 'Aquí las reservas están limitadas a {d}.', errOverlap: 'Ese horario se empalma con otra reserva.', errName: 'Escribe tu nombre.',
      errTaken: 'Alguien acaba de reservar parte de ese horario.', errMine: 'Ya tienes una reserva que se empalma con ese horario.',
      toastBooked: 'Reservado: {s} · {t}', toastCancel: 'Reserva cancelada', toastIn: 'Check‑in listo. Disfruta tu espacio.', toastReset: 'Datos de la demo restaurados',
      cellTitle: '{s} · {d} · {p}% reservado',
      kWeek: 'Reservas esta semana', kHours: 'Horas reservadas', kUtil: 'Ocupación', kPeak: 'Hora pico', noWeek: 'Aún no hay reservas esta semana.',
      histTitle: '{h}: {n} reservas',
      noneTitle: 'No tienes reservas próximas', noneBody: 'Reserva un espacio desde el plano y aparecerá aquí con su pase de check‑in.',
      checkedIn: 'Check‑in hecho', code: 'Código {c}', showPass: 'Ver pase', cancel: 'Cancelar',
      checkInNow: 'Hacer check‑in', checkInLater: 'El check‑in abre 15 min antes', notePh: 'p. ej. Llamada con cliente',
      days: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    }
  };
  var TYPES_ES = { desk: 'Escritorio', booth: 'Cabina', room: 'Sala de juntas', lounge: 'Lounge', gym: 'Gimnasio', terrace: 'Terraza', grill: 'Asador', laundry: 'Lavandería', cowork: 'Co‑work', party: 'Salón de eventos' };
  var ZONES_ES = { 'Open area': 'Área abierta', 'Meeting rooms': 'Salas de juntas', 'Focus': 'Concentración', 'Lounge & kitchen': 'Lounge y cocina', 'Rooftop': 'Azotea', 'Ground floor': 'Planta baja', 'Wellness': 'Bienestar' };
  var AMEN_ES = { 'A/C': 'Clima', Dock: 'Dock', Kitchen: 'Cocina', Monitor: 'Monitor', Screen: 'Pantalla', Shade: 'Sombra', Sound: 'Audio', Video: 'Video', Whiteboard: 'Pizarrón', 'Wi‑Fi': 'Wi‑Fi' };
  var NAMES_ES = { 'Sky Terrace': 'Terraza Panorámica', 'Grill A': 'Asador A', 'Grill B': 'Asador B', 'Fitness Room': 'Gimnasio', 'Laundry 1': 'Lavandería 1', 'Laundry 2': 'Lavandería 2', 'Co‑work Room': 'Sala Co‑work', 'Event Room': 'Salón de Eventos', 'Kids Room': 'Salón Infantil', 'Garden Lounge': 'Lounge Jardín', 'Window Bar': 'Barra Ventanal', 'Huddle Corner': 'Rincón de Equipo' };
  function T(k, v) {
    var s = (STR[LANG] && STR[LANG][k] != null) ? STR[LANG][k] : STR.en[k];
    if (v) Object.keys(v).forEach(function (x) { s = s.split('{' + x + '}').join(v[x]); });
    return s;
  }
  function spName(sp) {
    if (LANG !== 'es') return sp.name;
    if (NAMES_ES[sp.name]) return NAMES_ES[sp.name];
    return sp.name.replace(/^Desk /, 'Escritorio ').replace(/^Booth /, 'Cabina ');
  }
  function typeName(t, m) { return LANG === 'es' ? TYPES_ES[t] : SITES[m || state.mode].types[t]; }
  function amenName(a) { return LANG === 'es' && AMEN_ES[a] ? AMEN_ES[a] : a; }
  function zoneName(z) { return LANG === 'es' && ZONES_ES[z] ? ZONES_ES[z] : z; }
  function applyStatic() {
    document.documentElement.lang = LANG;
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = T(n.getAttribute('data-i18n')); });
    document.querySelectorAll('#langSeg button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === LANG ? 'true' : 'false'); });
    var np = document.getElementById('inNote'); if (np) np.placeholder = T('notePh');
  }

  /* ---------- Helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function svg(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function cleanText(v, max) { return String(v || '').replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, max); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function parseIso(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function hm(min) { var h = Math.floor(min / 60), m = min % 60, ap = h >= 12 ? (LANG === 'es' ? 'p. m.' : 'pm') : (LANG === 'es' ? 'a. m.' : 'am'); var hh = h % 12 || 12; return hh + (m ? ':' + pad(m) : '') + ' ' + ap; }
  function dur(min) { var h = Math.floor(min / 60), m = min % 60; return (h ? h + ' h' : '') + (h && m ? ' ' : '') + (m ? m + ' min' : ''); }
  function DAYN(i) { return T('days')[i]; }
  function MON(i) { return T('months')[i]; }
  function nice(s) { var d = parseIso(s); return LANG === 'es' ? DAYN(d.getDay()) + ' ' + d.getDate() + ' ' + MON(d.getMonth()) : DAYN(d.getDay()) + ', ' + MON(d.getMonth()) + ' ' + d.getDate(); }
  function nowMin() { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
  function code() {
    var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', out = '', buf = new Uint32Array(6);
    (window.crypto || {}).getRandomValues ? window.crypto.getRandomValues(buf) : buf.forEach(function (_, i) { buf[i] = Math.random() * 1e9; });
    for (var i = 0; i < 6; i++) out += a[buf[i] % a.length];
    return out;
  }

  /* ---------- State ---------- */
  var today = iso(new Date());
  var state = {
    mode: 'office', view: 'plan', date: today,
    selected: null, selStart: null, selEnd: null,
    typeOff: {}, cap: 1, amen: {}
  };
  var db = load();

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && d.v === 1 && Array.isArray(d.bookings) && d.seededFor === today) return sanitizeDb(d);
      }
    } catch (e) { /* storage unavailable or corrupt: fall back to fresh seed */ }
    return seed();
  }
  function sanitizeDb(d) {
    var ids = {};
    Object.keys(SITES).forEach(function (m) { SITES[m].spaces.forEach(function (s) { ids[s.id] = m; }); });
    d.bookings = d.bookings.filter(function (b) {
      return b && ids[b.space] === b.site && /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
        typeof b.start === 'number' && typeof b.end === 'number' && b.end > b.start;
    }).map(function (b) {
      return { id: String(b.id).slice(0, 20), site: b.site, space: b.space, date: b.date, start: b.start, end: b.end,
        name: cleanText(b.name, 40), note: cleanText(b.note, 80), code: cleanText(b.code, 8), mine: !!b.mine, checkedIn: !!b.checkedIn };
    });
    d.me = cleanText(d.me, 40);
    return d;
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); } catch (e) { /* ignore */ } }

  function seed() {
    var names = ['Alex Moreno', 'Dana Ruiz', 'Iker Salas', 'Lucía Peña', 'Mateo Cruz', 'Sara Ibarra', 'Tomás Vega', 'Elena Ríos', 'Bruno Lara', 'Nora Fuentes'];
    var notes = ['Sprint review', 'Client call', 'Focus time', 'Interview', '1:1', 'Workshop', '', '', 'Birthday', 'Family lunch'];
    var r = rng(20261125), out = [];
    var start = addDays(parseIso(today), -((parseIso(today).getDay() + 6) % 7)); // Monday
    Object.keys(SITES).forEach(function (m) {
      var site = SITES[m];
      for (var d = 0; d < 21; d++) {
        var date = iso(addDays(start, d)), wd = addDays(start, d).getDay(), weekend = wd === 0 || wd === 6;
        site.spaces.forEach(function (sp) {
          var busy = m === 'office' ? (weekend ? 0.05 : (sp.type === 'desk' ? 0.7 : 0.85)) : (weekend ? 0.8 : 0.55);
          if (r() > busy) return;
          var tries = 1 + Math.floor(r() * (sp.type === 'desk' ? 1 : 5));
          for (var t = 0; t < tries; t++) {
            var len = sp.type === 'desk' ? (r() < 0.6 ? site.maxMin : 120) : 30 * (1 + Math.floor(r() * (site.maxMin / 30)));
            var slots = (site.close - site.open - len) / 30;
            var st = site.open + 30 * Math.floor(r() * (slots + 1));
            var b = { id: 'seed' + out.length, site: m, space: sp.id, date: date, start: st, end: st + len,
              name: names[Math.floor(r() * names.length)], note: notes[Math.floor(r() * notes.length)], code: '', mine: false, checkedIn: false };
            if (!out.some(function (o) { return o.space === b.space && o.date === b.date && o.start < b.end && b.start < o.end; })) out.push(b);
          }
        });
      }
    });
    var d0 = { v: 1, seededFor: today, me: '', bookings: out };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(d0)); } catch (e) { /* ignore */ }
    return d0;
  }

  /* ---------- Queries ---------- */
  function site() { return SITES[state.mode]; }
  function spaceById(id) { var s = site().spaces; for (var i = 0; i < s.length; i++) if (s[i].id === id) return s[i]; return null; }
  function bookingsFor(spaceId, date) {
    return db.bookings.filter(function (b) { return b.site === state.mode && b.space === spaceId && b.date === date; })
      .sort(function (a, b) { return a.start - b.start; });
  }
  function bookedMin(spaceId, date) { return bookingsFor(spaceId, date).reduce(function (t, b) { return t + (b.end - b.start); }, 0); }
  function openMin() { return site().close - site().open; }
  function status(sp, date) {
    var m = bookedMin(sp.id, date);
    if (m === 0) return 'free';
    if (sp.type === 'desk' ? m >= site().maxMin : m >= openMin() * 0.9) return 'full';
    return 'part';
  }
  function passesFilter(sp) {
    if (state.typeOff[sp.type]) return false;
    if (sp.cap < state.cap) return false;
    var need = Object.keys(state.amen).filter(function (k) { return state.amen[k]; });
    return need.every(function (a) { return sp.amen.indexOf(a) !== -1; });
  }
  function weekDates() {
    var d = parseIso(state.date), mon = addDays(d, -((d.getDay() + 6) % 7)), out = [];
    for (var i = 0; i < 7; i++) out.push(iso(addDays(mon, i)));
    return out;
  }

  /* ---------- Rendering: header ---------- */
  function renderHeader() {
    $('siteName').textContent = LANG === 'es' ? (state.mode === 'office' ? 'Northwind Studio — Piso 3' : 'Residencial Alameda — Amenidades') : site().name;
    $('siteMeta').textContent = T('meta.' + state.mode);
    document.querySelectorAll('#modeSeg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-mode') === state.mode); });
    document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-view') === state.view); });
    document.querySelectorAll('.view').forEach(function (v) { v.classList.toggle('on', v.id === 'view-' + state.view); });
    $('mineCount').textContent = String(db.bookings.filter(function (b) { return b.mine && b.date >= today; }).length);
    $('days').hidden = state.view === 'mine' || state.view === 'insights';
  }

  function renderDays() {
    var box = $('days'); clear(box);
    var base = parseIso(today);
    for (var i = 0; i < 14; i++) {
      var d = addDays(base, i), s = iso(d);
      box.appendChild(el('button', {
        type: 'button', class: 'day' + (s === state.date ? ' on' : ''),
        'aria-pressed': s === state.date ? 'true' : 'false',
        onclick: (function (v) { return function () { state.date = v; state.selStart = state.selEnd = null; renderAll(); }; })(s)
      }, [el('span', { text: i === 0 ? T('today') : DAYN(d.getDay()) }), el('b', { text: String(d.getDate()) }), el('small', { text: MON(d.getMonth()) })]));
    }
  }

  /* ---------- Filters ---------- */
  function renderFilters() {
    var tf = $('typeFilters'); clear(tf);
    var types = site().types;
    Object.keys(types).forEach(function (t) {
      tf.appendChild(el('button', {
        type: 'button', class: 'chip' + (state.typeOff[t] ? '' : ' on'),
        onclick: function () { state.typeOff[t] = !state.typeOff[t]; renderFilters(); renderPlan(); }
      }, [typeName(t)]));
    });
    $('capFilter').value = String(state.cap);
    var af = $('amenFilters'); clear(af);
    var all = {};
    site().spaces.forEach(function (s) { s.amen.forEach(function (a) { all[a] = 1; }); });
    Object.keys(all).sort().forEach(function (a) {
      var cb = el('input', { type: 'checkbox' });
      cb.checked = !!state.amen[a];
      cb.addEventListener('change', function () { state.amen[a] = cb.checked; renderPlan(); });
      af.appendChild(el('label', null, [cb, amenName(a)]));
    });
  }

  /* ---------- Plan ---------- */
  function renderPlan() {
    var p = $('plan'); clear(p);
    p.appendChild(svg('rect', { x: 10, y: 10, width: 980, height: 600, rx: 18, class: 'floor' }));
    site().rooms.forEach(function (r) {
      p.appendChild(svg('rect', { x: r.x, y: r.y, width: r.w, height: r.h, rx: 14, class: 'zone' }));
      var t = svg('text', { x: r.x + 14, y: r.y + 24, class: 'zone-label' }); t.textContent = zoneName(r.label); p.appendChild(t);
    });
    site().spaces.forEach(function (sp) {
      var st = status(sp, state.date), ok = passesFilter(sp);
      var g = svg('g', { class: 'sp ' + st + (ok ? '' : ' dim') + (state.selected === sp.id ? ' sel' : ''), tabindex: ok ? '0' : '-1', role: 'button' });
      g.setAttribute('aria-label', spName(sp) + ', ' + (st === 'free' ? T('available') : st === 'part' ? T('partly') : T('fully')));
      g.appendChild(svg('rect', { x: sp.x, y: sp.y, width: sp.w, height: sp.h, rx: sp.type === 'desk' || sp.type === 'booth' ? 10 : 12 }));
      var small = sp.w < 90;
      var t = svg('text', { x: sp.x + sp.w / 2, y: sp.y + sp.h / 2 + (small ? 4 : -2), 'text-anchor': 'middle', class: 'sp-name' + (small ? ' sm' : '') });
      t.textContent = small ? sp.name.replace(/^(Desk|Booth) /, '') : spName(sp); g.appendChild(t);
      if (!small) {
        var c = svg('text', { x: sp.x + sp.w / 2, y: sp.y + sp.h / 2 + 16, 'text-anchor': 'middle', class: 'sp-cap' });
        c.textContent = sp.cap + ' ' + (sp.cap === 1 ? T('person') : T('people')); g.appendChild(c);
      }
      function pick() { if (!ok) return; state.selected = sp.id; state.selStart = state.selEnd = null; $('err').textContent = ''; renderPlan(); renderDetail(); }
      g.addEventListener('click', pick);
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      p.appendChild(g);
    });
  }

  /* ---------- Detail / booking ---------- */
  function slotTaken(list, m) { return list.some(function (b) { return m >= b.start && m < b.end; }); }
  function renderDetail() {
    var sp = state.selected && spaceById(state.selected);
    $('detailEmpty').hidden = !!sp; $('detailBody').hidden = !sp;
    if (!sp) return;
    $('dType').textContent = typeName(sp.type) + ' · ' + nice(state.date);
    $('dName').textContent = spName(sp);
    var f = $('dFacts'); clear(f);
    f.appendChild(el('span', { text: T('upTo', { n: sp.cap }) }));
    sp.amen.forEach(function (a) { f.appendChild(el('span', { text: amenName(a) })); });
    $('dRule').textContent = T('max', { d: dur(site().maxMin) });

    var list = bookingsFor(sp.id, state.date), box = $('slots'); clear(box);
    var isToday = state.date === today, nm = nowMin();
    for (var m = site().open; m < site().close; m += 30) {
      var taken = slotTaken(list, m), past = isToday && m + 30 <= nm;
      var inSel = state.selStart !== null && m >= state.selStart && m < state.selEnd;
      var who = taken ? list.filter(function (b) { return m >= b.start && m < b.end; })[0] : null;
      var btn = el('button', {
        type: 'button', class: 'slot' + (taken ? ' taken' : '') + (past ? ' past' : '') + (inSel ? ' on' : ''),
        title: taken ? T('booked') + (who && who.mine ? T('byYou') : '') : hm(m) + ' – ' + hm(m + 30)
      }, [LANG === 'es' ? Math.floor(m / 60) + ':' + pad(m % 60) : hm(m).replace(' ', '')]);
      if (taken || past) btn.disabled = true;
      else btn.addEventListener('click', (function (v) { return function () { pickSlot(v); }; })(m));
      box.appendChild(btn);
    }
    var sum = $('selSum');
    if (state.selStart === null) sum.textContent = T('selHint');
    else sum.textContent = hm(state.selStart) + ' – ' + hm(state.selEnd) + ' · ' + dur(state.selEnd - state.selStart);
    if (!$('inName').value && db.me) $('inName').value = db.me;
    $('bookBtn').disabled = state.selStart === null;
  }

  function pickSlot(m) {
    var list = bookingsFor(state.selected, state.date);
    if (state.selStart === null || state.selEnd - state.selStart > 30 || m < state.selStart) {
      state.selStart = m; state.selEnd = m + 30;
    } else {
      var end = m + 30;
      if (end - state.selStart > site().maxMin) { $('err').textContent = T('errLimit', { d: dur(site().maxMin) }); return; }
      for (var x = state.selStart; x < end; x += 30) if (slotTaken(list, x)) { $('err').textContent = T('errOverlap'); return; }
      state.selEnd = end;
    }
    $('err').textContent = '';
    renderDetail();
  }

  function book() {
    var sp = spaceById(state.selected), name = cleanText($('inName').value, 40), note = cleanText($('inNote').value, 80);
    if (!sp || state.selStart === null) return;
    if (name.length < 2) { $('err').textContent = T('errName'); $('inName').focus(); return; }
    var list = bookingsFor(sp.id, state.date);
    for (var x = state.selStart; x < state.selEnd; x += 30) if (slotTaken(list, x)) { $('err').textContent = T('errTaken'); return; }
    var mineSameDay = db.bookings.filter(function (b) { return b.mine && b.site === state.mode && b.date === state.date && b.start < state.selEnd && state.selStart < b.end; });
    if (mineSameDay.length) { $('err').textContent = T('errMine'); return; }
    var b = { id: 'b' + Date.now().toString(36), site: state.mode, space: sp.id, date: state.date, start: state.selStart, end: state.selEnd,
      name: name, note: note, code: code(), mine: true, checkedIn: false };
    db.bookings.push(b); db.me = name; save();
    state.selStart = state.selEnd = null; $('inNote').value = '';
    toast(T('toastBooked', { s: spName(sp), t: hm(b.start) + ' – ' + hm(b.end) }));
    renderAll();
    openPass(b);
  }

  /* ---------- Week ---------- */
  function renderWeek() {
    var g = $('weekGrid'); clear(g);
    var days = weekDates();
    g.style.setProperty('--cols', String(days.length));
    g.appendChild(el('div', { class: 'wh' }));
    days.forEach(function (d) { g.appendChild(el('div', { class: 'wh' + (d === today ? ' today' : ''), text: nice(d).replace(',', '') })); });
    site().spaces.filter(passesFilter).forEach(function (sp) {
      g.appendChild(el('div', { class: 'wn' }, [el('b', { text: spName(sp) }), el('small', { text: typeName(sp.type) })]));
      days.forEach(function (d) {
        var pct = Math.min(100, Math.round(bookedMin(sp.id, d) / (sp.type === 'desk' ? site().maxMin * 2 : openMin()) * 100));
        var mine = db.bookings.some(function (b) { return b.mine && b.site === state.mode && b.space === sp.id && b.date === d; });
        var bar = el('i'); bar.style.width = pct + '%';
        var cell = el('button', { type: 'button', class: 'wc' + (mine ? ' mine' : '') + (d < today ? ' past' : ''), title: T('cellTitle', { s: spName(sp), d: nice(d), p: pct }) }, [el('span', { class: 'track' }, [bar]), el('small', { text: pct + '%' })]);
        if (d < today) cell.disabled = true;
        else cell.addEventListener('click', function () { state.date = d; state.selected = sp.id; state.view = 'plan'; state.selStart = state.selEnd = null; renderAll(); });
        g.appendChild(cell);
      });
    });
  }

  /* ---------- Insights ---------- */
  function renderInsights() {
    var days = weekDates(), sp = site().spaces;
    var wk = db.bookings.filter(function (b) { return b.site === state.mode && days.indexOf(b.date) !== -1; });
    var hours = wk.reduce(function (t, b) { return t + (b.end - b.start); }, 0) / 60;
    var capacity = sp.length * days.length * openMin() / 60;
    var perSpace = {};
    wk.forEach(function (b) { perSpace[b.space] = (perSpace[b.space] || 0) + (b.end - b.start); });
    var top = Object.keys(perSpace).sort(function (a, b) { return perSpace[b] - perSpace[a]; });
    var hist = {};
    for (var h = site().open / 60; h < site().close / 60; h++) hist[h] = 0;
    wk.forEach(function (b) { for (var m = b.start; m < b.end; m += 60) { var hh = Math.floor(m / 60); if (hh in hist) hist[hh]++; } });
    var peak = Object.keys(hist).sort(function (a, b) { return hist[b] - hist[a]; })[0];

    var k = $('kpis'); clear(k);
    [[T('kWeek'), String(wk.length)], [T('kHours'), String(Math.round(hours))],
     [T('kUtil'), Math.round(hours / capacity * 100) + '%'], [T('kPeak'), peak ? hm(+peak * 60) : '—']]
      .forEach(function (x) { k.appendChild(el('div', { class: 'kpi' }, [el('span', { text: x[0] }), el('b', { text: x[1] })])); });

    var bt = $('byType'); clear(bt);
    Object.keys(site().types).forEach(function (t) {
      var ofType = sp.filter(function (s) { return s.type === t; });
      var used = wk.filter(function (b) { return ofType.some(function (s) { return s.id === b.space; }); })
        .reduce(function (a, b) { return a + b.end - b.start; }, 0);
      var pct = Math.round(used / (ofType.length * days.length * openMin()) * 100);
      bt.appendChild(barRow(typeName(t), pct, pct + '%'));
    });

    var bh = $('byHour'), ax = $('byHourAxis'); clear(bh); clear(ax);
    var max = Math.max.apply(null, Object.keys(hist).map(function (x) { return hist[x]; }).concat([1]));
    Object.keys(hist).forEach(function (x) {
      var col = el('i', { title: T('histTitle', { h: hm(+x * 60), n: hist[x] }), class: x === peak ? 'peak' : '' });
      col.style.height = Math.max(4, hist[x] / max * 100) + '%';
      bh.appendChild(col);
      ax.appendChild(el('span', { text: +x % 2 === 0 ? String(+x % 12 || 12) : '' }));
    });

    var ts = $('topSpaces'); clear(ts);
    var tmax = top.length ? perSpace[top[0]] : 1;
    top.slice(0, 6).forEach(function (id) { var s = spaceById(id); ts.appendChild(barRow(spName(s), Math.round(perSpace[id] / tmax * 100), dur(perSpace[id]))); });
    if (!top.length) ts.appendChild(el('p', { class: 'muted', text: T('noWeek') }));
  }
  function barRow(label, pct, value) {
    var fill = el('i'); fill.style.width = Math.min(100, pct) + '%';
    return el('div', { class: 'bar' }, [el('span', { text: label }), el('span', { class: 'track' }, [fill]), el('b', { text: value })]);
  }

  /* ---------- Mine ---------- */
  function renderMine() {
    var box = $('mineList'); clear(box);
    var list = db.bookings.filter(function (b) { return b.mine && b.date >= today; })
      .sort(function (a, b) { return a.date === b.date ? a.start - b.start : (a.date < b.date ? -1 : 1); });
    if (!list.length) {
      box.appendChild(el('div', { class: 'panel empty-state' }, [el('h3', { text: T('noneTitle') }), el('p', { class: 'muted', text: T('noneBody') })]));
      return;
    }
    list.forEach(function (b) {
      var s = SITES[b.site], sp = s.spaces.filter(function (x) { return x.id === b.space; })[0];
      var card = el('article', { class: 'panel bk' }, [
        el('div', null, [
          el('p', { class: 'muted small', text: T(b.site) + ' · ' + typeName(sp.type, b.site) }),
          el('h3', { text: spName(sp) }),
          el('p', { text: nice(b.date) + ' · ' + hm(b.start) + ' – ' + hm(b.end) }),
          b.note ? el('p', { class: 'muted', text: b.note }) : null,
          el('span', { class: 'pill' + (b.checkedIn ? ' ok' : ''), text: b.checkedIn ? T('checkedIn') : T('code', { c: b.code }) })
        ]),
        el('div', { class: 'bk-actions' }, [
          el('button', { type: 'button', class: 'btn', text: T('showPass'), onclick: function () { openPass(b); } }),
          el('button', { type: 'button', class: 'btn ghost', text: T('cancel'), onclick: function () { cancel(b); } })
        ])
      ]);
      box.appendChild(card);
    });
  }
  function cancel(b) {
    db.bookings = db.bookings.filter(function (x) { return x.id !== b.id; }); save();
    toast(T('toastCancel')); renderAll();
  }

  /* ---------- Pass ---------- */
  var passFor = null;
  function openPass(b) {
    passFor = b;
    var s = SITES[b.site], sp = s.spaces.filter(function (x) { return x.id === b.space; })[0];
    $('passTitle').textContent = spName(sp);
    $('passWhen').textContent = nice(b.date) + ' · ' + hm(b.start) + ' – ' + hm(b.end);
    $('passCode').textContent = b.code;
    drawPattern($('passQr'), b.code);
    var can = b.date === today && nowMin() >= b.start - 15 && nowMin() < b.end;
    var btn = $('checkInBtn');
    btn.disabled = b.checkedIn || !can;
    btn.textContent = b.checkedIn ? T('checkedIn') : can ? T('checkInNow') : T('checkInLater');
    $('passModal').hidden = false;
    $('passClose').focus();
  }
  function drawPattern(box, txt) {
    clear(box);
    var n = 21, s = svg('svg', { viewBox: '0 0 ' + n + ' ' + n, 'shape-rendering': 'crispEdges' });
    var h = 0; for (var i = 0; i < txt.length; i++) h = (h * 31 + txt.charCodeAt(i)) >>> 0;
    var r = rng(h || 7);
    function finder(x, y) {
      s.appendChild(svg('rect', { x: x, y: y, width: 7, height: 7 }));
      s.appendChild(svg('rect', { x: x + 1, y: y + 1, width: 5, height: 5, fill: '#fff' }));
      s.appendChild(svg('rect', { x: x + 2, y: y + 2, width: 3, height: 3 }));
    }
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      if (!inF && r() > 0.52) s.appendChild(svg('rect', { x: x, y: y, width: 1, height: 1 }));
    }
    finder(0, 0); finder(14, 0); finder(0, 14);
    box.appendChild(s);
  }
  function closePass() { $('passModal').hidden = true; passFor = null; }

  /* ---------- Toast ---------- */
  var tt;
  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('show'); }, 2600); }

  /* ---------- Wiring ---------- */
  function renderAll() {
    renderHeader(); renderDays();
    if (state.view === 'plan') { renderFilters(); renderPlan(); renderDetail(); }
    if (state.view === 'week') renderWeek();
    if (state.view === 'insights') renderInsights();
    if (state.view === 'mine') renderMine();
  }

  document.querySelectorAll('#modeSeg button').forEach(function (b) {
    b.addEventListener('click', function () {
      state.mode = b.getAttribute('data-mode'); state.selected = null; state.selStart = state.selEnd = null;
      state.typeOff = {}; state.amen = {}; state.cap = 1; renderAll();
    });
  });
  document.querySelectorAll('#tabs button').forEach(function (b) {
    b.addEventListener('click', function () { state.view = b.getAttribute('data-view'); renderAll(); });
  });
  $('capFilter').addEventListener('change', function () { state.cap = parseInt(this.value, 10) || 1; renderPlan(); });
  $('bookBtn').addEventListener('click', book);
  $('passClose').addEventListener('click', closePass);
  $('passModal').addEventListener('click', function (e) { if (e.target === this) closePass(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('passModal').hidden) closePass(); });
  $('checkInBtn').addEventListener('click', function () {
    if (!passFor) return;
    db.bookings.forEach(function (b) { if (b.id === passFor.id) b.checkedIn = true; });
    save(); toast(T('toastIn')); closePass(); renderAll();
  });
  $('resetBtn').addEventListener('click', function () {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
    db = seed(); state.selected = null; state.selStart = state.selEnd = null; toast(T('toastReset')); renderAll();
  });

  document.querySelectorAll('#langSeg button').forEach(function (b) {
    b.addEventListener('click', function () {
      LANG = b.getAttribute('data-lang');
      if (window.DemoKit) window.DemoKit.setLang(LANG);
      applyStatic(); renderAll();
    });
  });

  /* ---------- Guided tour ---------- */
  function goPlan() { if (state.view !== 'plan') { state.view = 'plan'; renderAll(); } }
  var tour = window.DemoKit ? new window.DemoKit.Tour({
    key: 'spacio',
    lang: function () { return LANG; },
    steps: [
      { target: null,
        title: { en: 'Welcome to Spacio', es: 'Bienvenido a Spacio' },
        body: { en: 'Spacio lets people book desks, meeting rooms and shared amenities. This is a demo with fictional data — feel free to try everything.', es: 'Spacio permite reservar escritorios, salas de juntas y amenidades compartidas. Es una demo con datos ficticios: prueba todo con confianza.' } },
      { target: '#modeSeg', before: goPlan,
        title: { en: 'Office or residence', es: 'Oficina o residencial' },
        body: { en: 'Switch between a corporate office and a residential building. Same system, two very different spaces.', es: 'Cambia entre una oficina corporativa y un edificio residencial. El mismo sistema para dos tipos de espacio muy distintos.' } },
      { target: '#days', before: goPlan,
        title: { en: 'Choose a day', es: 'Elige el día' },
        body: { en: 'Pick any of the next two weeks. The plan updates to show what is free that day.', es: 'Elige cualquier día de las próximas dos semanas. El plano se actualiza para mostrar qué está libre ese día.' } },
      { target: '#filtersPanel', before: goPlan,
        title: { en: 'Narrow it down', es: 'Filtra lo que necesitas' },
        body: { en: 'Filter by type, capacity or equipment. Spaces that do not match fade out on the plan.', es: 'Filtra por tipo, capacidad o equipamiento. Los espacios que no coinciden se atenúan en el plano.' } },
      { target: '#planWrap', before: goPlan,
        title: { en: 'Read the floor plan', es: 'Lee el plano' },
        body: { en: 'White is free, yellow is partly booked and gray is full. Click any space to open it.', es: 'Blanco es libre, amarillo está parcialmente reservado y gris está lleno. Haz clic en cualquier espacio para abrirlo.' } },
      { target: '#detail', before: goPlan,
        title: { en: 'Book in three clicks', es: 'Reserva en tres clics' },
        body: { en: 'Choose a start time, then an end time, type your name and press Book. Overlaps and over‑long bookings are blocked automatically.', es: 'Elige hora de inicio y de fin, escribe tu nombre y presiona Reservar. Los empalmes y las reservas demasiado largas se bloquean solos.' } },
      { target: '#tabs',
        title: { en: 'More views', es: 'Más vistas' },
        body: { en: 'Week shows occupancy at a glance, Insights shows usage statistics, and My bookings keeps your check‑in passes.', es: 'Semana muestra la ocupación de un vistazo, Estadísticas muestra el uso y Mis reservas guarda tus pases de check‑in.' } },
      { target: '.top-right',
        title: { en: 'Always at hand', es: 'Siempre a la mano' },
        body: { en: 'Replay this tour, switch language or reset the demo data here. Use the Portfolio button to go back.', es: 'Aquí puedes repetir este recorrido, cambiar el idioma o reiniciar los datos. Usa el botón Portafolio para regresar.' } }
    ]
  }) : null;
  $('tourBtn').addEventListener('click', function () { if (tour) tour.start(); });

  applyStatic();
  renderAll();
  if (tour && !tour.seen()) setTimeout(function () { tour.start(); }, 400);
})();
