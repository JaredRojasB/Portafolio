/* Vitalis — clinical lab front desk demo.
   Portfolio mockup: fictional patients, catalog and prices, stored only in this browser (localStorage).
   Security: user text written with textContent only and sanitized before storage; stored data validated on load. */
(function () {
  'use strict';
  var K = window.DemoKit, h = K.h, clear = K.clear, clean = K.clean;
  var STORE = K.store('vitalis.demo.v1');

  var L = new K.I18n({
    en: {
      back: 'Portfolio', badge: 'Demo · fictional patients', tour: 'Take the tour', reset: 'Reset demo', title: 'Vitalis Lab — Front desk',
      'tab.new': 'New order', 'tab.work': 'Worklist', 'tab.pts': 'Patients', 'tab.cat': 'Catalog', 'tab.sum': 'Daily summary',
      'n.patient': '1 · Patient', 'n.newPt': '+ New patient', 'n.ptSearch': 'Search by name or phone', 'n.change': 'Change',
      'n.studies': '2 · Studies', 'n.stSearch': 'Type a code, name or keyword — e.g. BH, glucose, thyroid', 'n.pay': '3 · Payment', 'n.discount': 'Discount',
      'd.0': 'None', 'd.10': 'Senior citizen · 10%', 'd.15': 'Company agreement · 15%', 'n.method': 'Payment', 'p.cash': 'Cash', 'p.card': 'Card', 'p.transfer': 'Transfer', 'p.pending': 'Pay on pickup',
      'n.create': 'Create order', 'f.name': 'Full name', 'f.birth': 'Birth date', 'f.sex': 'Sex', 'sex.F': 'Female', 'sex.M': 'Male', 'f.phone': 'Phone', 'f.doctor': 'Referring doctor (optional)',
      'f.savePt': 'Save patient', cancel: 'Cancel',
      'c.patient': 'Patient', 'c.age': 'Age', 'c.phone': 'Phone', 'c.visits': 'Visits', 'c.last': 'Last visit', 'c.code': 'Code', 'c.study': 'Study', 'c.area': 'Area', 'c.tat': 'Results in', 'c.prep': 'Preparation', 'c.price': 'Price',
      'cat.note': 'Prices are fictional and for demonstration only.', 's.status': 'Today by status', 's.top': 'Most requested this week',
      'dr.history': 'Visit history', 'dr.newOrder': 'New order for this patient', 'rc.addr': 'Demo clinic · fictional address', 'rc.foot': 'Keep this receipt to pick up your results.', 'rc.print': 'Print', 'rc.done': 'Done',
      today: 'Today is {d}', years: '{n} y', noMatch: 'No matches. Try another word or create a new patient.', noStudy: 'No studies match. Try a code like BH or a word like "sugar".',
      lastVisit: 'Last visit: {d} · {n} studies', firstVisit: 'First visit — welcome!', emptyCart: 'Add studies by searching above.',
      prepT: 'Preparation needed', subtotal: 'Subtotal', discount: 'Discount', total: 'Total', items: '{n} studies',
      ePt: 'Choose or register a patient first.', eSt: 'Add at least one study.', eName: 'Enter the full name (first and last).', eBirth: 'Enter a valid birth date.', ePhone: 'Enter a 10‑digit phone number.',
      tPt: 'Patient saved', tOrder: 'Order {f} created', tStep: '{f}: {s}', tReset: 'Demo data restored', already: 'Already added',
      rcTitle: 'Order {f}', rcPatient: 'Patient', rcDate: 'Date', rcReady: 'Results ready', rcPay: 'Payment', paid: 'Paid', toPay: 'To pay on pickup',
      'st.all': 'All', 'st.reg': 'Registered', 'st.sample': 'Sample taken', 'st.proc': 'In process', 'st.ready': 'Ready', 'st.done': 'Delivered',
      'nx.reg': 'Take sample', 'nx.sample': 'Start processing', 'nx.proc': 'Mark ready', 'nx.ready': 'Deliver', receipt: 'Receipt', collect: 'Collect {a}',
      dayToday: 'Today', noOrders: 'No orders here.', pts: '{n} patients',
      k1: 'Visits today', k2: 'Collected today', k3: 'Pending to collect', k4: 'Ready to deliver', k1s: '{n} studies', k2s: 'Cash, card and transfer', k3s: 'Pay on pickup', k4s: 'Call or notify',
      kName: 'Name', kBirth: 'Birth date', kSex: 'Sex', kPhone: 'Phone', kDoctor: 'Doctor', kSince: 'Patient since', hours: '{n} h', days: '{n} days', sameDay: 'Same day',
      areas: { hema: 'Hematology', chem: 'Chemistry', uro: 'Urinalysis', horm: 'Hormones', immu: 'Immunology', micro: 'Microbiology', pkg: 'Packages' },
      preps: { fast8: 'Fasting 8 h', fast12: 'Fasting 12 h', first: 'First morning urine', none: '—', abst: '3 days without antibiotics', collect3: '3 samples, alternate days' }
    },
    es: {
      back: 'Portafolio', badge: 'Demo · pacientes ficticios', tour: 'Ver recorrido', reset: 'Reiniciar demo', title: 'Laboratorio Vitalis — Recepción',
      'tab.new': 'Nueva orden', 'tab.work': 'Lista de trabajo', 'tab.pts': 'Pacientes', 'tab.cat': 'Catálogo', 'tab.sum': 'Resumen del día',
      'n.patient': '1 · Paciente', 'n.newPt': '+ Nuevo paciente', 'n.ptSearch': 'Busca por nombre o teléfono', 'n.change': 'Cambiar',
      'n.studies': '2 · Estudios', 'n.stSearch': 'Escribe clave, nombre o palabra — p. ej. BH, glucosa, tiroides', 'n.pay': '3 · Pago', 'n.discount': 'Descuento',
      'd.0': 'Ninguno', 'd.10': 'Adulto mayor · 10%', 'd.15': 'Convenio empresa · 15%', 'n.method': 'Pago', 'p.cash': 'Efectivo', 'p.card': 'Tarjeta', 'p.transfer': 'Transferencia', 'p.pending': 'Paga al recoger',
      'n.create': 'Crear orden', 'f.name': 'Nombre completo', 'f.birth': 'Fecha de nacimiento', 'f.sex': 'Sexo', 'sex.F': 'Femenino', 'sex.M': 'Masculino', 'f.phone': 'Teléfono', 'f.doctor': 'Médico que refiere (opcional)',
      'f.savePt': 'Guardar paciente', cancel: 'Cancelar',
      'c.patient': 'Paciente', 'c.age': 'Edad', 'c.phone': 'Teléfono', 'c.visits': 'Visitas', 'c.last': 'Última visita', 'c.code': 'Clave', 'c.study': 'Estudio', 'c.area': 'Área', 'c.tat': 'Resultados en', 'c.prep': 'Preparación', 'c.price': 'Precio',
      'cat.note': 'Los precios son ficticios y solo para demostración.', 's.status': 'Hoy por estado', 's.top': 'Más solicitados esta semana',
      'dr.history': 'Historial de visitas', 'dr.newOrder': 'Nueva orden para este paciente', 'rc.addr': 'Clínica demo · dirección ficticia', 'rc.foot': 'Conserva este comprobante para recoger tus resultados.', 'rc.print': 'Imprimir', 'rc.done': 'Listo',
      today: 'Hoy es {d}', years: '{n} años', noMatch: 'Sin coincidencias. Prueba otra palabra o registra un paciente nuevo.', noStudy: 'Ningún estudio coincide. Prueba una clave como BH o una palabra como "azúcar".',
      lastVisit: 'Última visita: {d} · {n} estudios', firstVisit: 'Primera visita — ¡bienvenido!', emptyCart: 'Agrega estudios buscándolos arriba.',
      prepT: 'Requiere preparación', subtotal: 'Subtotal', discount: 'Descuento', total: 'Total', items: '{n} estudios',
      ePt: 'Primero elige o registra un paciente.', eSt: 'Agrega al menos un estudio.', eName: 'Escribe el nombre completo (nombre y apellido).', eBirth: 'Escribe una fecha de nacimiento válida.', ePhone: 'Escribe un teléfono de 10 dígitos.',
      tPt: 'Paciente guardado', tOrder: 'Orden {f} creada', tStep: '{f}: {s}', tReset: 'Datos de la demo restaurados', already: 'Ya está agregado',
      rcTitle: 'Orden {f}', rcPatient: 'Paciente', rcDate: 'Fecha', rcReady: 'Resultados listos', rcPay: 'Pago', paid: 'Pagado', toPay: 'Por pagar al recoger',
      'st.all': 'Todas', 'st.reg': 'Registrada', 'st.sample': 'Muestra tomada', 'st.proc': 'En proceso', 'st.ready': 'Lista', 'st.done': 'Entregada',
      'nx.reg': 'Tomar muestra', 'nx.sample': 'Procesar', 'nx.proc': 'Marcar lista', 'nx.ready': 'Entregar', receipt: 'Comprobante', collect: 'Cobrar {a}',
      dayToday: 'Hoy', noOrders: 'No hay órdenes aquí.', pts: '{n} pacientes',
      k1: 'Visitas de hoy', k2: 'Cobrado hoy', k3: 'Pendiente de cobro', k4: 'Listas para entregar', k1s: '{n} estudios', k2s: 'Efectivo, tarjeta y transferencia', k3s: 'Pagan al recoger', k4s: 'Llamar o avisar',
      kName: 'Nombre', kBirth: 'Nacimiento', kSex: 'Sexo', kPhone: 'Teléfono', kDoctor: 'Médico', kSince: 'Paciente desde', hours: '{n} h', days: '{n} días', sameDay: 'Mismo día',
      areas: { hema: 'Hematología', chem: 'Química clínica', uro: 'Uroanálisis', horm: 'Hormonas', immu: 'Inmunología', micro: 'Microbiología', pkg: 'Paquetes' },
      preps: { fast8: 'Ayuno de 8 h', fast12: 'Ayuno de 12 h', first: 'Primera orina de la mañana', none: '—', abst: '3 días sin antibióticos', collect3: '3 muestras, días alternos' }
    }
  });
  var T = L.t;

  /* ---------- Catalog (fictional prices) ---------- */
  // code, en, es, area, price, tat(hours), prep, keywords
  var CAT = [
    ['BH', 'Complete blood count', 'Biometría hemática', 'hema', 190, 4, 'none', 'cbc blood sangre anemia hemoglobina hemoglobin plaquetas platelets leucocitos'],
    ['VSG', 'Erythrocyte sedimentation rate', 'Velocidad de sedimentación', 'hema', 120, 4, 'none', 'esr inflamacion inflammation'],
    ['TP', 'Prothrombin time', 'Tiempo de protrombina', 'hema', 210, 6, 'none', 'coagulacion coagulation pt inr'],
    ['TTP', 'Partial thromboplastin time', 'Tiempo de tromboplastina parcial', 'hema', 210, 6, 'none', 'coagulacion coagulation aptt'],
    ['GRH', 'Blood type and Rh', 'Grupo sanguíneo y Rh', 'hema', 140, 2, 'none', 'tipo de sangre blood group'],
    ['GLU', 'Glucose', 'Glucosa', 'chem', 95, 3, 'fast8', 'azucar sugar diabetes'],
    ['HBA1C', 'Glycated hemoglobin A1c', 'Hemoglobina glucosilada', 'chem', 360, 24, 'none', 'diabetes azucar sugar a1c'],
    ['QS3', 'Blood chemistry (3)', 'Química sanguínea 3', 'chem', 260, 6, 'fast8', 'glucosa urea creatinina chemistry'],
    ['QS6', 'Blood chemistry (6)', 'Química sanguínea 6', 'chem', 420, 6, 'fast12', 'glucosa urea creatinina acido urico colesterol trigliceridos'],
    ['PL', 'Lipid panel', 'Perfil de lípidos', 'chem', 390, 6, 'fast12', 'colesterol cholesterol trigliceridos triglycerides hdl ldl'],
    ['PFH', 'Liver function tests', 'Pruebas de función hepática', 'chem', 480, 24, 'fast8', 'higado liver hepatico bilirrubina'],
    ['CREA', 'Creatinine', 'Creatinina', 'chem', 110, 4, 'none', 'rinon kidney renal'],
    ['AU', 'Uric acid', 'Ácido úrico', 'chem', 110, 4, 'fast8', 'gota gout'],
    ['ES', 'Serum electrolytes', 'Electrolitos séricos', 'chem', 340, 6, 'none', 'sodio potasio cloro sodium potassium'],
    ['PCR', 'C‑reactive protein', 'Proteína C reactiva', 'immu', 230, 6, 'none', 'inflamacion inflammation infection infeccion'],
    ['EGO', 'Urinalysis', 'Examen general de orina', 'uro', 120, 3, 'first', 'orina urine'],
    ['UROC', 'Urine culture', 'Urocultivo', 'micro', 380, 72, 'abst', 'orina urine infeccion infection cultivo'],
    ['CPS3', 'Stool test for parasites (x3)', 'Coproparasitoscópico seriado', 'micro', 260, 72, 'collect3', 'parasitos parasites heces stool'],
    ['EXF', 'Throat culture', 'Exudado faríngeo', 'micro', 350, 72, 'abst', 'garganta throat anginas'],
    ['TSH', 'Thyroid‑stimulating hormone', 'Hormona estimulante de tiroides', 'horm', 320, 24, 'none', 'tiroides thyroid'],
    ['PT4', 'Thyroid panel', 'Perfil tiroideo', 'horm', 690, 24, 'none', 'tiroides thyroid t3 t4'],
    ['HCG', 'Pregnancy test (blood)', 'Prueba de embarazo en sangre', 'horm', 260, 4, 'none', 'embarazo pregnancy hcg'],
    ['PSA', 'Prostate‑specific antigen', 'Antígeno prostático', 'horm', 380, 24, 'none', 'prostata prostate'],
    ['VITD', 'Vitamin D', 'Vitamina D', 'horm', 720, 48, 'none', 'vitamina vitamin d'],
    ['FERR', 'Ferritin', 'Ferritina', 'horm', 360, 24, 'none', 'hierro iron anemia'],
    ['INS', 'Insulin', 'Insulina', 'horm', 410, 24, 'fast8', 'diabetes resistencia resistance'],
    ['VDRL', 'Syphilis screening (VDRL)', 'VDRL', 'immu', 150, 24, 'none', 'sifilis syphilis prenupcial'],
    ['HIV', 'HIV screening', 'Prueba de VIH', 'immu', 290, 24, 'none', 'vih sida'],
    ['CHK1', 'Check‑up: CBC + chem 6 + urinalysis', 'Check‑up: BH + QS6 + EGO', 'pkg', 590, 6, 'fast12', 'paquete package chequeo general'],
    ['CHK2', 'Check‑up plus: + lipids + TSH', 'Check‑up plus: + lípidos + TSH', 'pkg', 990, 24, 'fast12', 'paquete package chequeo completo']
  ];
  var BY = {}; CAT.forEach(function (c) { BY[c[0]] = c; });
  function stName(c) { return L.lang === 'es' ? c[2] : c[1]; }
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function tat(hrs) { return hrs <= 8 ? T('sameDay') + ' · ' + T('hours', { n: hrs }) : hrs < 48 ? T('hours', { n: hrs }) : T('days', { n: Math.round(hrs / 24) }); }
  function searchStudies(q) {
    q = norm(q).trim(); if (!q) return [];
    var words = q.split(/\s+/);
    return CAT.map(function (c) {
      var code = norm(c[0]), hay = norm(c[1] + ' ' + c[2] + ' ' + c[7]);
      var score = 0;
      if (code === q) score += 100; else if (code.indexOf(q) === 0) score += 50;
      words.forEach(function (w) { if (hay.indexOf(w) !== -1) score += 10; if ((' ' + hay).indexOf(' ' + w) !== -1) score += 5; });
      return [score, c];
    }).filter(function (x) { return x[0] > 0; }).sort(function (a, b) { return b[0] - a[0]; }).slice(0, 8).map(function (x) { return x[1]; });
  }

  /* ---------- Dates & money ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return iso(d); }
  var TODAY = iso(new Date());
  function loc() { return L.lang === 'es' ? 'es-MX' : 'en-US'; }
  function fmtDate(s, long) { try { return parse(s).toLocaleDateString(loc(), long ? { weekday: 'long', day: 'numeric', month: 'long' } : { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return s; } }
  function money(n) { try { return new Intl.NumberFormat(loc(), { style: 'currency', currency: 'MXN' }).format(n || 0); } catch (e) { return '$' + n; } }
  function age(b) { var d = parse(b), t = new Date(), a = t.getFullYear() - d.getFullYear(); if (t.getMonth() < d.getMonth() || (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())) a--; return a; }
  function initials(n) { return n.split(' ').filter(Boolean).map(function (p) { return p[0]; }).slice(0, 2).join('').toUpperCase(); }
  var STEPS = ['reg', 'sample', 'proc', 'ready', 'done'];

  /* ---------- Seed ---------- */
  function seed() {
    var r = K.rng(5521);
    var names = [['Mariana López Ortega', 'F', '1988-04-12'], ['Jorge Ramírez Díaz', 'M', '1959-09-30'], ['Sofía Hernández Paz', 'F', '2001-01-21'], ['Luis Fernando Mora', 'M', '1976-06-08'],
      ['Ana Cristina Villa', 'F', '1993-11-02'], ['Roberto Cárdenas', 'M', '1948-02-17'], ['Daniela Ochoa Ruiz', 'F', '1999-07-25'], ['Héctor Navarro', 'M', '1983-03-14'],
      ['Patricia Esparza', 'F', '1965-12-05'], ['Emilio Torres Lara', 'M', '2010-05-19'], ['Valeria Salcedo', 'F', '1990-08-29'], ['Arturo Medina Gil', 'M', '1971-10-11'],
      ['Gabriela Fuentes', 'F', '1955-01-30'], ['Diego Alvarado', 'M', '1996-04-03']];
    var docs = ['', '', 'Dra. Paola Ríos', 'Dr. Manuel Cortés', 'Dra. Inés Vázquez'];
    var pts = names.map(function (n, i) {
      var ph = '33'; for (var k = 0; k < 8; k++) ph += Math.floor(r() * 10);
      return { id: 'pt' + (i + 1), name: n[0], sex: n[1], birth: n[2], phone: ph, doctor: docs[Math.floor(r() * docs.length)], since: addDays(TODAY, -Math.floor(60 + r() * 900)) };
    });
    var combos = [['BH', 'QS6', 'EGO'], ['GLU', 'HBA1C'], ['PL'], ['CHK1'], ['TSH'], ['PT4', 'BH'], ['EGO', 'UROC'], ['HCG'], ['PSA', 'QS3'], ['CHK2'], ['BH', 'PCR', 'VSG'], ['VITD', 'FERR'], ['CPS3'], ['GLU', 'PL', 'AU']];
    var orders = [], folio = 2400;
    function make(pt, day, items, status) {
      folio++;
      var sub = items.reduce(function (t, c) { return t + BY[c][4]; }, 0), disc = age(pt.birth) >= 60 ? 10 : (r() > 0.85 ? 15 : 0);
      var pay = status === 'done' || r() > 0.2 ? ['cash', 'card', 'card', 'transfer'][Math.floor(r() * 4)] : 'pending';
      orders.push({ id: 'o' + folio, folio: 'VT-' + folio, pt: pt.id, day: day, time: pad(7 + Math.floor(r() * 6)) + ':' + pad(Math.floor(r() * 4) * 15), items: items, disc: disc,
        total: Math.round(sub * (1 - disc / 100) * 100) / 100, pay: pay, status: status });
    }
    for (var d = -9; d < 0; d++) {
      var n = 2 + Math.floor(r() * 4);
      for (var j = 0; j < n; j++) make(pts[Math.floor(r() * pts.length)], addDays(TODAY, d), combos[Math.floor(r() * combos.length)], d < -2 ? 'done' : (r() > 0.4 ? 'done' : 'ready'));
    }
    ['reg', 'reg', 'sample', 'sample', 'proc', 'proc', 'ready', 'done'].forEach(function (s, i) { make(pts[i], TODAY, combos[(i * 3) % combos.length], s); });
    orders.sort(function (a, b) { return (a.day + a.time) < (b.day + b.time) ? -1 : 1; });
    return { v: 1, pts: pts, orders: orders, folio: folio, ptSeq: pts.length };
  }
  function validate(d) {
    if (!d || d.v !== 1 || !Array.isArray(d.pts) || !Array.isArray(d.orders)) return null;
    var isDate = function (s) { return /^\d{4}-\d{2}-\d{2}$/.test(s); };
    d.pts = d.pts.filter(function (p) { return p && isDate(p.birth); }).map(function (p) {
      return { id: clean(p.id, 12), name: clean(p.name, 60), sex: p.sex === 'M' ? 'M' : 'F', birth: p.birth, phone: String(p.phone || '').replace(/\D/g, '').slice(0, 10), doctor: clean(p.doctor, 60), since: isDate(p.since) ? p.since : TODAY };
    });
    var ids = {}; d.pts.forEach(function (p) { ids[p.id] = 1; });
    d.orders = d.orders.filter(function (o) { return o && ids[o.pt] && isDate(o.day) && STEPS.indexOf(o.status) >= 0 && Array.isArray(o.items); }).map(function (o) {
      return { id: clean(o.id, 12), folio: clean(o.folio, 12), pt: o.pt, day: o.day, time: /^\d{2}:\d{2}$/.test(o.time) ? o.time : '09:00', items: o.items.filter(function (c) { return BY[c]; }).slice(0, 30),
        disc: [0, 10, 15].indexOf(+o.disc) >= 0 ? +o.disc : 0, total: Math.max(0, +o.total || 0), pay: ['cash', 'card', 'transfer', 'pending'].indexOf(o.pay) >= 0 ? o.pay : 'pending', status: o.status };
    });
    d.folio = +d.folio || 3000; d.ptSeq = +d.ptSeq || 100;
    return d;
  }
  var db = validate(STORE.load()) || seed();
  function save() { STORE.save(db); }
  function ptById(id) { for (var i = 0; i < db.pts.length; i++) if (db.pts[i].id === id) return db.pts[i]; return null; }
  function ordersOf(id) { return db.orders.filter(function (o) { return o.pt === id; }).sort(function (a, b) { return (a.day + a.time) < (b.day + b.time) ? 1 : -1; }); }

  /* ---------- State ---------- */
  var state = { view: 'new', pt: null, cart: [], workStatus: 'all', workDay: TODAY, open: null, catArea: '' };
  function $(id) { return document.getElementById(id); }
  function renderHeader() {
    $('todayLine').textContent = T('today', { d: fmtDate(TODAY, true) });
    document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-view') === state.view); });
    document.querySelectorAll('.view').forEach(function (v) { v.classList.toggle('on', v.id === 'view-' + state.view); });
    $('workCount').textContent = String(db.orders.filter(function (o) { return o.day === TODAY && o.status !== 'done'; }).length);
  }

  /* ---------- New order: patient ---------- */
  function ptSub(p) { return T('years', { n: age(p.birth) }) + ' · ' + T('sex.' + p.sex) + ' · ' + p.phone; }
  function renderPtResults() {
    var q = norm($('ptQ').value).trim(), box = $('ptResults'); clear(box);
    if (!q) return;
    var qd = q.replace(/\D/g, '');
    var list = db.pts.filter(function (p) { return norm(p.name).indexOf(q) !== -1 || (qd.length >= 3 && p.phone.indexOf(qd) !== -1); }).slice(0, 6);
    if (!list.length) { box.appendChild(h('p', { class: 'muted small', text: T('noMatch') })); return; }
    list.forEach(function (p) {
      box.appendChild(h('div', { class: 'li', tabindex: '0', onclick: function () { choosePt(p.id); }, onkeydown: function (e) { if (e.key === 'Enter') choosePt(p.id); } },
        [h('div', null, [h('b', { text: p.name }), h('br'), h('small', { text: ptSub(p) })])]));
    });
  }
  function choosePt(id) {
    state.pt = id; $('ptQ').value = ''; clear($('ptResults'));
    renderPt(); renderOrder();
  }
  function renderPt() {
    var p = state.pt && ptById(state.pt);
    $('ptPicker').hidden = !!p || !$('ptForm').hidden; $('ptChosen').hidden = !p;
    if (!p) return;
    $('ptAv').textContent = initials(p.name); $('ptName').textContent = p.name; $('ptMeta').textContent = ptSub(p);
    var last = ordersOf(p.id)[0];
    $('ptLast').textContent = last ? T('lastVisit', { d: fmtDate(last.day), n: last.items.length }) : T('firstVisit');
  }
  function openPtForm() {
    $('ptForm').hidden = false; $('ptPicker').hidden = true; $('ptChosen').hidden = true;
    var typed = clean($('ptQ').value, 60);
    $('fName').value = /\d/.test(typed) ? '' : typed; $('fBirth').value = ''; $('fSex').value = 'F'; $('fPhone').value = /\d/.test(typed) ? typed.replace(/\D/g, '') : ''; $('fDoctor').value = '';
    $('ptErr').textContent = ''; $('fName').focus();
  }
  function savePt() {
    var name = clean($('fName').value, 60).replace(/\s+/g, ' '), birth = $('fBirth').value, phone = $('fPhone').value.replace(/\D/g, '');
    if (name.split(' ').length < 2 || name.length < 5) { $('ptErr').textContent = T('eName'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || birth > TODAY || birth < '1900-01-01') { $('ptErr').textContent = T('eBirth'); return; }
    if (phone.length !== 10) { $('ptErr').textContent = T('ePhone'); return; }
    db.ptSeq++;
    var p = { id: 'pt' + db.ptSeq, name: name, sex: $('fSex').value === 'M' ? 'M' : 'F', birth: birth, phone: phone, doctor: clean($('fDoctor').value, 60), since: TODAY };
    db.pts.push(p); save();
    $('ptForm').hidden = true; K.toast(T('tPt')); choosePt(p.id);
  }

  /* ---------- New order: studies & totals ---------- */
  function renderStResults() {
    var box = $('stResults'); clear(box);
    var q = $('stQ').value; if (!norm(q).trim()) return;
    var list = searchStudies(q);
    if (!list.length) { box.appendChild(h('p', { class: 'muted small', text: T('noStudy') })); return; }
    list.forEach(function (c, i) {
      var inCart = state.cart.indexOf(c[0]) >= 0;
      box.appendChild(h('div', { class: 'li', tabindex: '0', 'data-i': String(i), onclick: function () { addStudy(c[0]); }, onkeydown: function (e) { if (e.key === 'Enter') addStudy(c[0]); } }, [
        h('div', null, [h('span', { class: 'code', text: c[0] }), h('b', { text: stName(c) }), h('br'), h('small', { class: 'muted', text: T('areas')[c[3]] + ' · ' + tat(c[5]) + (inCart ? ' · ' + T('already') : '') })]),
        h('b', { text: money(c[4]) })]));
    });
  }
  function addStudy(code) {
    if (state.cart.indexOf(code) >= 0) { K.toast(T('already')); return; }
    state.cart.push(code); $('stQ').value = ''; clear($('stResults')); $('stQ').focus(); renderOrder();
  }
  function calc(items, disc) {
    var sub = items.reduce(function (t, c) { return t + BY[c][4]; }, 0);
    var d = Math.round(sub * disc) / 100;
    return { sub: sub, disc: d, total: Math.round((sub - d) * 100) / 100 };
  }
  function prepList(items) {
    var seen = {}, out = [];
    items.forEach(function (c) { var p = BY[c][6]; if (p !== 'none' && !seen[p]) { seen[p] = 1; out.push(T('preps')[p]); } });
    if (out.indexOf(T('preps').fast12) >= 0) out = out.filter(function (x) { return x !== T('preps').fast8; });
    return out;
  }
  function renderOrder() {
    var cart = $('cart'); clear(cart);
    if (!state.cart.length) cart.appendChild(h('div', { class: 'cart-empty', text: T('emptyCart') }));
    state.cart.forEach(function (code) {
      var c = BY[code];
      cart.appendChild(h('div', { class: 'cart-item' }, [h('span', { class: 'code', text: c[0] }), h('div', null, [h('span', { text: stName(c) }), h('small', { text: tat(c[5]) })]),
        h('b', { text: money(c[4]) }), h('button', { type: 'button', class: 'rm', 'aria-label': 'Remove', text: '×', onclick: function () { state.cart = state.cart.filter(function (x) { return x !== code; }); renderOrder(); } })]));
    });
    var pr = prepList(state.cart), pb = $('prep'); clear(pb); pb.hidden = !pr.length;
    if (pr.length) { pb.appendChild(h('b', { text: T('prepT') })); pb.appendChild(document.createTextNode(pr.join(' · '))); }
    var t = calc(state.cart, +$('disc').value), tb = $('totals'); clear(tb);
    tb.appendChild(h('div', null, [h('span', { text: T('subtotal') + ' · ' + T('items', { n: state.cart.length }) }), h('span', { text: money(t.sub) })]));
    if (t.disc) tb.appendChild(h('div', null, [h('span', { text: T('discount') }), h('span', { text: '− ' + money(t.disc) })]));
    tb.appendChild(h('div', { class: 'grand' }, [h('span', { text: T('total') }), h('span', { text: money(t.total) })]));
    $('createBtn').disabled = !state.pt || !state.cart.length;
    $('orderErr').textContent = '';
  }
  function createOrder() {
    if (!state.pt) { $('orderErr').textContent = T('ePt'); return; }
    if (!state.cart.length) { $('orderErr').textContent = T('eSt'); return; }
    var disc = [0, 10, 15].indexOf(+$('disc').value) >= 0 ? +$('disc').value : 0;
    var pay = ['cash', 'card', 'transfer', 'pending'].indexOf($('pay').value) >= 0 ? $('pay').value : 'cash';
    db.folio++;
    var now = new Date();
    var o = { id: 'o' + db.folio, folio: 'VT-' + db.folio, pt: state.pt, day: TODAY, time: pad(now.getHours()) + ':' + pad(now.getMinutes()), items: state.cart.slice(), disc: disc, total: calc(state.cart, disc).total, pay: pay, status: 'reg' };
    db.orders.push(o); save();
    K.toast(T('tOrder', { f: o.folio }));
    state.cart = []; state.pt = null; $('disc').value = '0'; $('pay').value = 'cash';
    renderPt(); renderOrder(); renderHeader(); showReceipt(o);
  }

  /* ---------- Receipt ---------- */
  function showReceipt(o) {
    var p = ptById(o.pt), t = calc(o.items, o.disc);
    $('rcTitle').textContent = T('rcTitle', { f: o.folio });
    var kv = $('rcKv'); clear(kv);
    var maxT = Math.max.apply(null, o.items.map(function (c) { return BY[c][5]; }));
    var ready = new Date(parse(o.day).getTime() + (parseInt(o.time, 10) + maxT) * 3600000);
    [[T('rcPatient'), p.name + ' · ' + T('years', { n: age(p.birth) })], [T('rcDate'), fmtDate(o.day) + ' · ' + o.time],
     [T('rcReady'), ready.toLocaleString(loc(), { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })],
     [T('rcPay'), o.pay === 'pending' ? T('toPay') : T('paid') + ' · ' + T('p.' + o.pay)]].forEach(function (x) { kv.appendChild(h('dt', { text: x[0] })); kv.appendChild(h('dd', { text: x[1] })); });
    var rows = $('rcRows'); clear(rows);
    o.items.forEach(function (c) { rows.appendChild(h('tr', null, [h('td', { class: 'mono', text: c }), h('td', { text: stName(BY[c]) }), h('td', { class: 'num', text: money(BY[c][4]) })])); });
    var tb = $('rcTotals'); clear(tb);
    tb.appendChild(h('div', null, [h('span', { text: T('subtotal') }), h('span', { text: money(t.sub) })]));
    if (t.disc) tb.appendChild(h('div', null, [h('span', { text: T('discount') + ' ' + o.disc + '%' }), h('span', { text: '− ' + money(t.disc) })]));
    tb.appendChild(h('div', { class: 'grand' }, [h('span', { text: T('total') }), h('span', { text: money(t.total) })]));
    var pr = prepList(o.items), pb = $('rcPrep'); clear(pb); pb.hidden = !pr.length;
    if (pr.length) { pb.appendChild(h('b', { text: T('prepT') })); pb.appendChild(document.createTextNode(pr.join(' · '))); }
    $('rcModal').hidden = false; $('rcDone').focus();
  }

  /* ---------- Worklist ---------- */
  function renderWork() {
    var days = []; for (var i = 0; i < 7; i++) days.push(addDays(TODAY, -i));
    var sel = $('workDay'); clear(sel);
    days.forEach(function (d, i) { sel.appendChild(h('option', { value: d, text: i === 0 ? T('dayToday') + ' · ' + fmtDate(d) : fmtDate(d) })); });
    sel.value = state.workDay;
    var dayOrders = db.orders.filter(function (o) { return o.day === state.workDay; });
    var ch = $('workChips'); clear(ch);
    ['all'].concat(STEPS).forEach(function (s) {
      var n = dayOrders.filter(function (o) { return s === 'all' || o.status === s; }).length;
      ch.appendChild(h('button', { type: 'button', class: 'chip' + (state.workStatus === s ? ' on' : ''), text: T('st.' + s) + ' · ' + n, onclick: function () { state.workStatus = s; renderWork(); } }));
    });
    var box = $('workList'); clear(box);
    var list = dayOrders.filter(function (o) { return state.workStatus === 'all' || o.status === state.workStatus; })
      .sort(function (a, b) { return STEPS.indexOf(a.status) - STEPS.indexOf(b.status) || (a.time < b.time ? -1 : 1); });
    if (!list.length) box.appendChild(h('p', { class: 'muted', text: T('noOrders') }));
    list.forEach(function (o) {
      var p = ptById(o.pt), idx = STEPS.indexOf(o.status);
      var steps = h('div', { class: 'steps', 'aria-label': T('st.' + o.status) });
      STEPS.forEach(function (_, k) { steps.appendChild(h('i', { class: k <= idx ? 'on' : '' })); });
      var acts = h('div', { class: 'order-acts' });
      var pill = h('span', { class: 'pill ' + (o.status === 'ready' ? 'ok' : o.status === 'done' ? '' : o.status === 'reg' ? 'warn' : 'acc'), text: T('st.' + o.status) });
      acts.appendChild(pill);
      if (o.status !== 'done') acts.appendChild(h('button', { type: 'button', class: 'btn sm', text: T('nx.' + o.status), onclick: function () { advance(o); } }));
      if (o.pay === 'pending') acts.appendChild(h('button', { type: 'button', class: 'btn ghost sm', text: T('collect', { a: money(o.total) }), onclick: function () { o.pay = 'cash'; save(); K.toast(T('paid')); renderWork(); } }));
      acts.appendChild(h('button', { type: 'button', class: 'link', text: T('receipt'), onclick: function () { showReceipt(o); } }));
      box.appendChild(h('article', { class: 'order' }, [
        h('div', { class: 'folio' }, [o.folio, h('small', { text: o.time })]),
        h('div', null, [h('b', { class: 'clickable', text: p.name, onclick: function () { openPt(p.id); } }), h('div', { class: 'studies', text: o.items.map(function (c) { return c + ' ' + stName(BY[c]); }).join(' · ') }), steps]),
        acts
      ]));
    });
  }
  function advance(o) {
    var i = STEPS.indexOf(o.status); if (i < 0 || i >= STEPS.length - 1) return;
    o.status = STEPS[i + 1]; save(); K.toast(T('tStep', { f: o.folio, s: T('st.' + o.status) })); renderWork(); renderHeader();
  }

  /* ---------- Patients ---------- */
  function renderPts() {
    var q = norm($('ptsQ').value).trim(), qd = q.replace(/\D/g, '');
    var list = db.pts.filter(function (p) { return !q || norm(p.name).indexOf(q) !== -1 || (qd.length >= 3 && p.phone.indexOf(qd) !== -1); })
      .sort(function (a, b) { return a.name < b.name ? -1 : 1; });
    var tb = $('ptsRows'); clear(tb);
    list.forEach(function (p) {
      var os = ordersOf(p.id);
      tb.appendChild(h('tr', { tabindex: '0', onclick: function () { openPt(p.id); }, onkeydown: function (e) { if (e.key === 'Enter') openPt(p.id); } }, [
        h('td', null, [h('div', { class: 'cell-main' }, [h('b', { text: p.name }), h('small', { text: T('sex.' + p.sex) + (p.doctor ? ' · ' + p.doctor : '') })])]),
        h('td', { text: T('years', { n: age(p.birth) }) }), h('td', { class: 'mono', text: p.phone }), h('td', { text: String(os.length) }), h('td', { text: os[0] ? fmtDate(os[0].day) : '—' })
      ]));
    });
    $('ptsCount').textContent = T('pts', { n: list.length });
  }
  function openPt(id) {
    var p = ptById(id); if (!p) return;
    state.open = id;
    $('drMeta').textContent = T('years', { n: age(p.birth) }) + ' · ' + T('sex.' + p.sex);
    $('drName').textContent = p.name;
    var kv = $('drKv'); clear(kv);
    [[T('kBirth'), fmtDate(p.birth)], [T('kPhone'), p.phone], [T('kDoctor'), p.doctor || '—'], [T('kSince'), fmtDate(p.since)]].forEach(function (x) { kv.appendChild(h('dt', { text: x[0] })); kv.appendChild(h('dd', { text: x[1] })); });
    var hb = $('drHist'); clear(hb);
    ordersOf(id).forEach(function (o) {
      hb.appendChild(h('div', { class: 'tl-item' }, [h('b', { text: fmtDate(o.day) + ' · ' + o.folio + ' · ' + money(o.total) }), h('span', { class: 'muted', text: o.items.map(function (c) { return stName(BY[c]); }).join(', ') + ' · ' + T('st.' + o.status) })]));
    });
    if (!hb.firstChild) hb.appendChild(h('p', { class: 'muted', text: T('firstVisit') }));
    $('drawer').classList.add('open'); $('drawer').setAttribute('aria-hidden', 'false'); $('backdrop').hidden = false;
  }
  function closePt() { state.open = null; $('drawer').classList.remove('open'); $('drawer').setAttribute('aria-hidden', 'true'); $('backdrop').hidden = true; }

  /* ---------- Catalog ---------- */
  function renderCat() {
    var ch = $('catChips'); clear(ch);
    [''].concat(Object.keys(T('areas'))).forEach(function (a) {
      ch.appendChild(h('button', { type: 'button', class: 'chip' + (state.catArea === a ? ' on' : ''), text: a ? T('areas')[a] : T('st.all'), onclick: function () { state.catArea = a; renderCat(); } }));
    });
    var q = $('catQ').value, list = norm(q).trim() ? searchStudies(q).concat([]) : CAT.slice();
    if (norm(q).trim()) list = CAT.filter(function (c) { return searchStudies(q).indexOf(c) >= 0 || norm(c[0] + c[1] + c[2] + c[7]).indexOf(norm(q).trim()) >= 0; });
    var tb = $('catRows'); clear(tb);
    list.filter(function (c) { return !state.catArea || c[3] === state.catArea; }).forEach(function (c) {
      tb.appendChild(h('tr', { onclick: function () { state.view = 'new'; renderAll(); addStudy(c[0]); } }, [
        h('td', { class: 'mono', text: c[0] }), h('td', { text: stName(c) }), h('td', { text: T('areas')[c[3]] }), h('td', { text: tat(c[5]) }),
        h('td', { text: T('preps')[c[6]] }), h('td', { class: 'num', text: money(c[4]) })]));
    });
  }

  /* ---------- Summary ---------- */
  function renderSum() {
    var today = db.orders.filter(function (o) { return o.day === TODAY; });
    var collected = today.filter(function (o) { return o.pay !== 'pending'; }).reduce(function (t, o) { return t + o.total; }, 0);
    var pendingAll = db.orders.filter(function (o) { return o.pay === 'pending'; });
    var ready = db.orders.filter(function (o) { return o.status === 'ready'; });
    var k = $('kpis'); clear(k);
    [[T('k1'), String(today.length), T('k1s', { n: today.reduce(function (t, o) { return t + o.items.length; }, 0) }), ''],
     [T('k2'), money(collected), T('k2s'), ''],
     [T('k3'), money(pendingAll.reduce(function (t, o) { return t + o.total; }, 0)), T('k3s') + ' · ' + pendingAll.length, pendingAll.length ? 'alert' : ''],
     [T('k4'), String(ready.length), T('k4s'), ready.length ? 'alert' : '']].forEach(function (x) {
      k.appendChild(h('div', { class: 'kpi ' + x[3] }, [h('span', { text: x[0] }), h('b', { text: x[1] }), h('small', { text: x[2] })]));
    });
    var ss = $('sumStatus'); clear(ss);
    STEPS.forEach(function (s) { var n = today.filter(function (o) { return o.status === s; }).length; ss.appendChild(bar(T('st.' + s), today.length ? n / today.length : 0, String(n))); });
    var cnt = {}, from = addDays(TODAY, -6);
    db.orders.filter(function (o) { return o.day >= from; }).forEach(function (o) { o.items.forEach(function (c) { cnt[c] = (cnt[c] || 0) + 1; }); });
    var top = Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a]; }).slice(0, 7), max = top.length ? cnt[top[0]] : 1;
    var st = $('sumTop'); clear(st);
    top.forEach(function (c) { st.appendChild(bar(c + ' · ' + stName(BY[c]), cnt[c] / max, String(cnt[c]))); });
  }
  function bar(label, frac, val) {
    var fill = h('i'); fill.style.width = Math.round(frac * 100) + '%';
    return h('div', { class: 'bar' }, [h('span', { text: label }), h('span', { class: 'track' }, [fill]), h('b', { text: val })]);
  }

  /* ---------- Render ---------- */
  function renderAll() {
    renderHeader();
    if (state.view === 'new') { renderPt(); renderStResults(); renderOrder(); }
    if (state.view === 'work') renderWork();
    if (state.view === 'pts') renderPts();
    if (state.view === 'cat') renderCat();
    if (state.view === 'sum') renderSum();
    if (state.open) openPt(state.open);
  }

  document.querySelectorAll('#tabs button').forEach(function (b) { b.addEventListener('click', function () { state.view = b.getAttribute('data-view'); renderAll(); }); });
  $('ptQ').addEventListener('input', renderPtResults);
  $('ptQ').addEventListener('keydown', function (e) { if (e.key === 'Enter') { var f = $('ptResults').querySelector('.li'); if (f) f.click(); } });
  $('newPtBtn').addEventListener('click', openPtForm);
  $('ptSave').addEventListener('click', savePt);
  $('ptCancel').addEventListener('click', function () { $('ptForm').hidden = true; renderPt(); });
  $('ptChange').addEventListener('click', function () { state.pt = null; renderPt(); renderOrder(); $('ptQ').focus(); });
  $('stQ').addEventListener('input', renderStResults);
  $('stQ').addEventListener('keydown', function (e) { if (e.key === 'Enter') { var f = $('stResults').querySelector('.li'); if (f) f.click(); } });
  $('disc').addEventListener('change', renderOrder);
  $('createBtn').addEventListener('click', createOrder);
  $('workDay').addEventListener('change', function () { state.workDay = this.value; renderWork(); });
  $('ptsQ').addEventListener('input', renderPts);
  $('catQ').addEventListener('input', renderCat);
  $('drClose').addEventListener('click', closePt);
  $('backdrop').addEventListener('click', closePt);
  $('drNew').addEventListener('click', function () { var id = state.open; closePt(); state.view = 'new'; state.pt = id; renderAll(); });
  $('rcDone').addEventListener('click', function () { $('rcModal').hidden = true; });
  $('rcClose').addEventListener('click', function () { $('rcModal').hidden = true; });
  $('rcPrint').addEventListener('click', function () { window.print(); });
  $('rcModal').addEventListener('click', function (e) { if (e.target === this) this.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !document.querySelector('.dk-tour')) { $('rcModal').hidden = true; if (state.open) closePt(); } });
  $('resetBtn').addEventListener('click', function () { STORE.clear(); db = seed(); save(); state.pt = null; state.cart = []; closePt(); K.toast(T('tReset')); renderAll(); });

  function go(view) { return function () { closePt(); if (state.view !== view) { state.view = view; renderAll(); } }; }
  var tour = new K.Tour({
    key: 'vitalis', lang: function () { return L.lang; },
    steps: [
      { target: null, title: { en: 'Welcome to Vitalis', es: 'Bienvenido a Vitalis' },
        body: { en: 'Front desk software for a clinical lab: register patients, build orders from a study catalog and follow every sample until results are delivered. Patients and prices are fictional.', es: 'Software de recepción para laboratorio clínico: registra pacientes, arma órdenes desde un catálogo de estudios y sigue cada muestra hasta entregar resultados. Pacientes y precios son ficticios.' } },
      { target: '#patientPanel', before: go('new'), title: { en: 'Find or register the patient', es: 'Busca o registra al paciente' },
        body: { en: 'Search by name or phone. If they are new, register them with birth date and phone — the age is calculated automatically.', es: 'Busca por nombre o teléfono. Si es nuevo, regístralo con fecha de nacimiento y teléfono — la edad se calcula sola.' } },
      { target: '#studyPanel', before: go('new'), title: { en: 'Smart study search', es: 'Búsqueda inteligente de estudios' },
        body: { en: 'Type a code like BH or QS6, a name, or a plain word like "sugar", "thyroid" or "orina". Preparation needs such as fasting are gathered automatically.', es: 'Escribe una clave como BH o QS6, un nombre o una palabra como "azúcar", "tiroides" o "urine". Las indicaciones como el ayuno se juntan automáticamente.' } },
      { target: '#payPanel', before: go('new'), title: { en: 'Discounts and payment', es: 'Descuentos y pago' },
        body: { en: 'Apply a discount, choose how the patient pays (or pays on pickup) and create the order. A printable receipt with the results time is generated.', es: 'Aplica un descuento, elige cómo paga el paciente (o si paga al recoger) y crea la orden. Se genera un comprobante imprimible con la hora de resultados.' } },
      { target: '#workBar', before: go('work'), title: { en: 'Follow every sample', es: 'Sigue cada muestra' },
        body: { en: 'The worklist moves each order through registered, sample taken, in process, ready and delivered. Collect pending payments from here too.', es: 'La lista de trabajo lleva cada orden por registrada, muestra tomada, en proceso, lista y entregada. Aquí también cobras lo pendiente.' } },
      { target: '#tabs', before: go('work'), title: { en: 'Patients, catalog and summary', es: 'Pacientes, catálogo y resumen' },
        body: { en: 'Open any patient to see every visit. The catalog lists studies with preparation and turnaround. The daily summary is for the manager.', es: 'Abre cualquier paciente para ver todas sus visitas. El catálogo lista estudios con preparación y tiempo de entrega. El resumen del día es para el encargado.' } },
      { target: '.top-right', title: { en: 'Always at hand', es: 'Siempre a la mano' },
        body: { en: 'Replay this tour, switch language or reset the demo. The Portfolio button takes you back.', es: 'Repite este recorrido, cambia el idioma o reinicia la demo. El botón Portafolio te regresa.' } }
    ]
  });
  $('tourBtn').addEventListener('click', function () { tour.start(); });

  L.bind(function () { renderAll(); });
  save();
  renderAll();
  if (!tour.seen()) setTimeout(function () { tour.start(); }, 400);
})();
