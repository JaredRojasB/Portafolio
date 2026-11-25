/* Inventra — asset management demo.
   Portfolio mockup: fictional data stored only in this browser (localStorage).
   Security: user text is written with textContent only and sanitized before storage; CSV export neutralizes formulas. */
(function () {
  'use strict';
  var K = window.DemoKit, h = K.h, clear = K.clear, clean = K.clean;
  var STORE = K.store('inventra.demo.v1');

  var L = new K.I18n({
    en: {
      back: 'Portfolio', badge: 'Demo · fictional data', 'mode.company': 'Company', 'mode.home': 'Home', tour: 'Take the tour', reset: 'Reset demo',
      'tab.dash': 'Overview', 'tab.assets': 'Assets', 'tab.activity': 'Activity', people: 'People', rooms: 'Rooms',
      'd.byCat': 'Assets by category', 'd.byCatHint': 'Share in use', 'd.expiring': 'Warranties ending soon', 'd.status': 'By status', 'd.recent': 'Recent activity',
      'a.search': 'Search name, tag, serial or person', 'a.export': 'Export CSV', 'a.add': 'Add asset',
      'c.asset': 'Asset', 'c.cat': 'Category', 'c.status': 'Status', 'c.warranty': 'Warranty', 'c.value': 'Value', assignedTo: 'Assigned to', location: 'Location',
      'act.title': 'Everything that happened', close: 'Close', 'dr.label': 'Asset label', 'dr.labelHint': 'Stick it on the device. In this demo the pattern is decorative.', 'dr.history': 'History',
      'f.name': 'Name', 'f.namePh': 'e.g. MacBook Air 13"', 'f.brand': 'Brand / model', 'f.serial': 'Serial number', 'f.cost': 'Value (MXN)', 'f.bought': 'Purchase date',
      'f.warranty': 'Warranty ends', 'f.notes': 'Notes', 'f.note': 'Note (optional)', cancel: 'Cancel', save: 'Save', confirm: 'Confirm',
      'meta.company': 'Company mode · equipment handed to employees', 'meta.home': 'Home mode · appliances and devices by room',
      allCats: 'All categories', allStatus: 'All statuses',
      's.use': 'In use', 's.free': 'Available', 's.repair': 'In repair', 's.retired': 'Retired',
      k1: 'Total assets', k2: 'In use', k3: 'Warranties ending in 60 days', k4: 'In repair', k1s: 'Worth {v}', k2s: '{p}% of active assets', k3s: 'Plan renewals', k4s: 'Waiting for service',
      none: 'Nothing here yet.', noneExp: 'No warranties ending in the next 90 days.', expired: 'Expired {d}', endsIn: 'Ends in {n} days', noWarranty: 'No warranty',
      rows: '{n} of {t} assets', noRows: 'No assets match your filters.',
      kTag: 'Tag', kSerial: 'Serial', kBrand: 'Brand / model', kBought: 'Purchased', kWarranty: 'Warranty', kValue: 'Value', kHolder: 'Assigned to', kRoom: 'Location', kNotes: 'Notes',
      unassigned: 'Unassigned',
      aAssign: 'Assign', aReturn: 'Return', aRepair: 'Send to repair', aBack: 'Back from repair', aRetire: 'Retire', aRestore: 'Restore', aEdit: 'Edit', aDelete: 'Delete',
      assignTitle: 'Assign {n}', assignWho: 'Assign to', moveTitle: 'Move {n}', moveWho: 'Move to',
      'h.created': 'Registered', 'h.assigned': 'Assigned to {w}', 'h.moved': 'Moved to {w}', 'h.returned': 'Returned by {w}', 'h.repair': 'Sent to repair', 'h.repaired': 'Back from repair',
      'h.retired': 'Retired', 'h.restored': 'Restored', 'h.edited': 'Details updated',
      tAdded: 'Asset registered', tSaved: 'Changes saved', tDeleted: 'Asset deleted', tDone: 'Done', tReset: 'Demo data restored', tCsv: 'CSV downloaded',
      confirmDelete: 'Delete this asset? This only affects the demo data in your browser.',
      eName: 'Please enter a name.', eDates: 'Warranty must end after the purchase date.', eCost: 'Enter a valid value.',
      newTitle: 'New asset', editTitle: 'Edit asset', assets: '{n} assets', total: 'Total value',
      csvHead: ['Tag', 'Name', 'Category', 'Brand/model', 'Serial', 'Status', 'Assigned to', 'Purchased', 'Warranty ends', 'Value MXN']
    },
    es: {
      back: 'Portafolio', badge: 'Demo · datos ficticios', 'mode.company': 'Empresa', 'mode.home': 'Hogar', tour: 'Ver recorrido', reset: 'Reiniciar demo',
      'tab.dash': 'Resumen', 'tab.assets': 'Activos', 'tab.activity': 'Actividad', people: 'Personas', rooms: 'Espacios',
      'd.byCat': 'Activos por categoría', 'd.byCatHint': 'Porcentaje en uso', 'd.expiring': 'Garantías por vencer', 'd.status': 'Por estado', 'd.recent': 'Actividad reciente',
      'a.search': 'Busca nombre, etiqueta, serie o persona', 'a.export': 'Exportar CSV', 'a.add': 'Agregar activo',
      'c.asset': 'Activo', 'c.cat': 'Categoría', 'c.status': 'Estado', 'c.warranty': 'Garantía', 'c.value': 'Valor', assignedTo: 'Asignado a', location: 'Ubicación',
      'act.title': 'Todo lo que ha pasado', close: 'Cerrar', 'dr.label': 'Etiqueta del activo', 'dr.labelHint': 'Se pega en el equipo. En esta demo el patrón es decorativo.', 'dr.history': 'Historial',
      'f.name': 'Nombre', 'f.namePh': 'p. ej. MacBook Air 13"', 'f.brand': 'Marca / modelo', 'f.serial': 'Número de serie', 'f.cost': 'Valor (MXN)', 'f.bought': 'Fecha de compra',
      'f.warranty': 'Fin de garantía', 'f.notes': 'Notas', 'f.note': 'Nota (opcional)', cancel: 'Cancelar', save: 'Guardar', confirm: 'Confirmar',
      'meta.company': 'Modo empresa · equipo entregado a colaboradores', 'meta.home': 'Modo hogar · aparatos y dispositivos por espacio',
      allCats: 'Todas las categorías', allStatus: 'Todos los estados',
      's.use': 'En uso', 's.free': 'Disponible', 's.repair': 'En reparación', 's.retired': 'Dado de baja',
      k1: 'Activos totales', k2: 'En uso', k3: 'Garantías que vencen en 60 días', k4: 'En reparación', k1s: 'Valor {v}', k2s: '{p}% de los activos vigentes', k3s: 'Planea renovaciones', k4s: 'Esperando servicio',
      none: 'Aún no hay nada aquí.', noneExp: 'Ninguna garantía vence en los próximos 90 días.', expired: 'Venció {d}', endsIn: 'Vence en {n} días', noWarranty: 'Sin garantía',
      rows: '{n} de {t} activos', noRows: 'Ningún activo coincide con los filtros.',
      kTag: 'Etiqueta', kSerial: 'Serie', kBrand: 'Marca / modelo', kBought: 'Compra', kWarranty: 'Garantía', kValue: 'Valor', kHolder: 'Asignado a', kRoom: 'Ubicación', kNotes: 'Notas',
      unassigned: 'Sin asignar',
      aAssign: 'Asignar', aReturn: 'Devolver', aRepair: 'Enviar a reparación', aBack: 'Regresó de reparación', aRetire: 'Dar de baja', aRestore: 'Reactivar', aEdit: 'Editar', aDelete: 'Eliminar',
      assignTitle: 'Asignar {n}', assignWho: 'Asignar a', moveTitle: 'Mover {n}', moveWho: 'Mover a',
      'h.created': 'Registrado', 'h.assigned': 'Asignado a {w}', 'h.moved': 'Movido a {w}', 'h.returned': 'Devuelto por {w}', 'h.repair': 'Enviado a reparación', 'h.repaired': 'Regresó de reparación',
      'h.retired': 'Dado de baja', 'h.restored': 'Reactivado', 'h.edited': 'Datos actualizados',
      tAdded: 'Activo registrado', tSaved: 'Cambios guardados', tDeleted: 'Activo eliminado', tDone: 'Listo', tReset: 'Datos de la demo restaurados', tCsv: 'CSV descargado',
      confirmDelete: '¿Eliminar este activo? Solo afecta los datos de la demo en tu navegador.',
      eName: 'Escribe un nombre.', eDates: 'La garantía debe terminar después de la compra.', eCost: 'Escribe un valor válido.',
      newTitle: 'Nuevo activo', editTitle: 'Editar activo', assets: '{n} activos', total: 'Valor total',
      csvHead: ['Etiqueta', 'Nombre', 'Categoría', 'Marca/modelo', 'Serie', 'Estado', 'Asignado a', 'Compra', 'Fin de garantía', 'Valor MXN']
    }
  });
  var T = L.t;

  /* ---------- Fictional organizations ---------- */
  var ORGS = {
    company: {
      name: 'Northwind Studio', prefix: 'NW',
      cats: { laptop: ['Laptop', 'Laptop'], monitor: ['Monitor', 'Monitor'], phone: ['Phone', 'Teléfono'], periph: ['Peripheral', 'Periférico'], network: ['Network', 'Red'], av: ['Audio & video', 'Audio y video'] },
      holders: [
        ['p1', 'Alex Moreno', 'Design lead', 'Líder de diseño'], ['p2', 'Dana Ruiz', 'Developer', 'Desarrolladora'], ['p3', 'Iker Salas', 'Developer', 'Desarrollador'],
        ['p4', 'Lucía Peña', 'Accounting', 'Contabilidad'], ['p5', 'Mateo Cruz', 'Sales', 'Ventas'], ['p6', 'Sara Ibarra', 'Operations', 'Operaciones'],
        ['p7', 'Tomás Vega', 'Support', 'Soporte'], ['p8', 'Elena Ríos', 'Director', 'Dirección']
      ]
    },
    home: {
      name: 'Casa Alameda', prefix: 'HM',
      cats: { appliance: ['Appliance', 'Electrodoméstico'], tv: ['TV & audio', 'TV y audio'], computer: ['Computer', 'Computadora'], phone: ['Phone & tablet', 'Celular y tablet'], tool: ['Tools', 'Herramientas'], network: ['Network', 'Red'] },
      holders: [
        ['r1', 'Living room', 'Ground floor', 'Planta baja', 'Sala'], ['r2', 'Kitchen', 'Ground floor', 'Planta baja', 'Cocina'], ['r3', 'Main bedroom', 'Upper floor', 'Planta alta', 'Recámara principal'],
        ['r4', 'Home office', 'Upper floor', 'Planta alta', 'Oficina'], ['r5', 'Garage', 'Outside', 'Exterior', 'Cochera'], ['r6', 'Laundry', 'Outside', 'Exterior', 'Lavandería']
      ]
    }
  };
  function holderName(mode, id) {
    var hs = ORGS[mode].holders;
    for (var i = 0; i < hs.length; i++) if (hs[i][0] === id) return mode === 'home' && L.lang === 'es' ? hs[i][4] : hs[i][1];
    return null;
  }
  function holderRole(mode, hld) { return L.lang === 'es' ? hld[3] : hld[2]; }
  var NAME_ES = { 'Conference camera': 'Cámara de juntas', 'Projector': 'Proyector', 'Headset': 'Diadema', 'Wi‑Fi access point': 'Punto de acceso Wi‑Fi', 'Switch 24 ports': 'Switch de 24 puertos',
    'Smart TV 55"': 'Pantalla 55"', 'Soundbar': 'Barra de sonido', 'Streaming box': 'Reproductor de streaming', 'Refrigerator': 'Refrigerador', 'Microwave': 'Microondas', 'Dishwasher': 'Lavavajillas',
    'Washing machine': 'Lavadora', 'Desktop PC': 'PC de escritorio', 'Old laptop': 'Laptop anterior', 'Tablet': 'Tablet', 'Router mesh (3)': 'Router mesh (3)', 'Drill': 'Taladro',
    'Pressure washer': 'Hidrolavadora', 'Air conditioner': 'Aire acondicionado', 'MX Keys + MX Master': 'Teclado y mouse MX', 'Battery swelling reported': 'Batería inflada reportada',
    'Left speaker not working': 'No funciona la bocina izquierda', 'License renewal pending': 'Renovación de licencia pendiente', 'Extended warranty': 'Garantía extendida',
    'Not draining — technician scheduled': 'No desagua — técnico agendado' };
  function tx(s) { return L.lang === 'es' && NAME_ES[s] ? NAME_ES[s] : s; }
  function catName(mode, c) { var x = ORGS[mode].cats[c]; return x ? x[L.lang === 'es' ? 1 : 0] : c; }

  /* ---------- Dates ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function parse(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  var TODAY = iso(new Date());
  function daysTo(s) { return Math.round((parse(s) - parse(TODAY)) / 86400000); }
  function fmtDate(s) {
    if (!s) return '—';
    try { return parse(s).toLocaleDateString(L.lang === 'es' ? 'es-MX' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return s; }
  }
  function money(n) {
    try { return new Intl.NumberFormat(L.lang === 'es' ? 'es-MX' : 'en-US', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n || 0); }
    catch (e) { return '$' + Math.round(n || 0); }
  }

  /* ---------- Seed ---------- */
  function seed() {
    var r = K.rng(4417), base = new Date();
    function past(min, max) { return iso(addDays(base, -(min + Math.floor(r() * (max - min))))); }
    var out = [], n = { company: 0, home: 0 };
    function add(mode, name, cat, brand, cost, status, holder, ageMin, ageMax, wDays, notes) {
      n[mode]++;
      var bought = past(ageMin, ageMax);
      var warranty = wDays == null ? '' : iso(addDays(parse(bought), wDays));
      var id = mode[0] + n[mode];
      var serial = '';
      for (var i = 0; i < 10; i++) serial += 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'[Math.floor(r() * 34)];
      var a = { id: id, tag: ORGS[mode].prefix + '-' + pad(n[mode] < 100 ? 0 : 1) + pad(n[mode]), mode: mode, name: name, cat: cat, brand: brand, serial: serial,
        cost: cost, bought: bought, warranty: warranty, status: status, holder: holder, notes: notes || '', hist: [] };
      a.hist.push({ d: bought, a: 'created' });
      if (holder) a.hist.push({ d: iso(addDays(parse(bought), 2)), a: mode === 'home' ? 'moved' : 'assigned', w: holder });
      if (status === 'repair') a.hist.push({ d: past(2, 12), a: 'repair' });
      if (status === 'retired') a.hist.push({ d: past(10, 40), a: 'retired' });
      out.push(a);
    }
    var C = 'company';
    add(C, 'MacBook Pro 14"', 'laptop', 'Apple M3 Pro', 48999, 'use', 'p1', 200, 500, 365 * 3);
    add(C, 'ThinkPad T14', 'laptop', 'Lenovo Gen 4', 27499, 'use', 'p2', 300, 600, 365 * 2);
    add(C, 'ThinkPad T14', 'laptop', 'Lenovo Gen 4', 27499, 'use', 'p3', 300, 600, 365 * 2);
    add(C, 'Latitude 5440', 'laptop', 'Dell', 23999, 'use', 'p4', 650, 700, 730);
    add(C, 'Latitude 5440', 'laptop', 'Dell', 23999, 'use', 'p5', 690, 710, 730);
    add(C, 'MacBook Air 13"', 'laptop', 'Apple M2', 24999, 'use', 'p8', 100, 300, 365);
    add(C, 'EliteBook 840', 'laptop', 'HP G10', 25999, 'repair', null, 400, 500, 730, 'Battery swelling reported');
    add(C, 'Latitude 7420', 'laptop', 'Dell', 19999, 'free', null, 900, 1000, 1095);
    add(C, 'ThinkPad X1 Carbon', 'laptop', 'Lenovo Gen 7', 21999, 'retired', null, 1500, 1700, 1095);
    add(C, 'UltraSharp 27"', 'monitor', 'Dell U2723QE', 11499, 'use', 'p1', 200, 500, 1095);
    add(C, 'UltraSharp 27"', 'monitor', 'Dell U2723QE', 11499, 'use', 'p2', 300, 600, 1095);
    add(C, '24" IPS', 'monitor', 'LG 24MP60G', 2899, 'use', 'p3', 300, 600, 365);
    add(C, '24" IPS', 'monitor', 'LG 24MP60G', 2899, 'use', 'p4', 340, 355, 365);
    add(C, '24" IPS', 'monitor', 'LG 24MP60G', 2899, 'free', null, 330, 340, 365);
    add(C, 'iPhone 15', 'phone', 'Apple 128 GB', 17999, 'use', 'p5', 200, 300, 365);
    add(C, 'Galaxy A55', 'phone', 'Samsung', 8499, 'use', 'p6', 100, 200, 365);
    add(C, 'Galaxy A35', 'phone', 'Samsung', 6499, 'free', null, 50, 90, 365);
    add(C, 'MX Keys + MX Master', 'periph', 'Logitech combo', 3499, 'use', 'p1', 200, 400, 365);
    add(C, 'USB‑C Dock', 'periph', 'Dell WD19S', 4299, 'use', 'p2', 200, 400, 1095);
    add(C, 'USB‑C Dock', 'periph', 'Dell WD19S', 4299, 'use', 'p3', 200, 400, 1095);
    add(C, 'Headset', 'periph', 'Jabra Evolve2 50', 3999, 'use', 'p7', 100, 300, 730);
    add(C, 'Headset', 'periph', 'Jabra Evolve2 50', 3999, 'repair', null, 300, 340, 730, 'Left speaker not working');
    add(C, 'Wi‑Fi access point', 'network', 'Ubiquiti U6+', 3299, 'use', null, 400, 500, 730);
    add(C, 'Switch 24 ports', 'network', 'TP‑Link TL‑SG1024', 2899, 'use', null, 700, 720, 1095);
    add(C, 'Firewall', 'network', 'Fortinet FG‑40F', 14999, 'use', null, 700, 725, 365 * 2, 'License renewal pending');
    add(C, 'Conference camera', 'av', 'Logitech Rally Bar Mini', 39999, 'use', null, 300, 500, 730);
    add(C, 'Projector', 'av', 'Epson PowerLite', 12999, 'free', null, 900, 1000, 730);
    var H = 'home';
    add(H, 'Smart TV 55"', 'tv', 'Samsung QLED', 12999, 'use', 'r1', 300, 400, 365);
    add(H, 'Soundbar', 'tv', 'Sonos Beam', 9999, 'use', 'r1', 200, 300, 365);
    add(H, 'Streaming box', 'tv', 'Apple TV 4K', 3499, 'use', 'r3', 100, 200, 365);
    add(H, 'Refrigerator', 'appliance', 'LG InstaView', 28999, 'use', 'r2', 600, 700, 730, 'Extended warranty');
    add(H, 'Microwave', 'appliance', 'Panasonic', 2799, 'use', 'r2', 1000, 1100, 365);
    add(H, 'Dishwasher', 'appliance', 'Bosch Serie 4', 13999, 'repair', null, 800, 900, 730, 'Not draining — technician scheduled');
    add(H, 'Washing machine', 'appliance', 'Whirlpool 20 kg', 11999, 'use', 'r6', 350, 360, 365);
    add(H, 'Desktop PC', 'computer', 'Custom Ryzen 7', 21999, 'use', 'r4', 300, 500, 365);
    add(H, 'Laptop', 'computer', 'ASUS Zenbook 14', 18999, 'use', 'r4', 100, 200, 365);
    add(H, 'Old laptop', 'computer', 'HP Pavilion', 9999, 'retired', null, 2000, 2200, 365);
    add(H, 'Tablet', 'phone', 'iPad 10th gen', 8999, 'use', 'r3', 200, 300, 365);
    add(H, 'Router mesh (3)', 'network', 'TP‑Link Deco X50', 5499, 'use', 'r1', 300, 400, 1095);
    add(H, 'Drill', 'tool', 'DeWalt 20V', 3299, 'use', 'r5', 300, 700, 1095);
    add(H, 'Pressure washer', 'tool', 'Karcher K3', 3899, 'free', null, 500, 600, 730);
    add(H, 'Air conditioner', 'appliance', 'Mirage Inverter', 10999, 'use', 'r3', 700, 720, 730);
    return { v: 1, bookingFor: TODAY, assets: out, seq: { company: n.company, home: n.home } };
  }
  function validate(d) {
    if (!d || d.v !== 1 || !Array.isArray(d.assets)) return null;
    var S = { use: 1, free: 1, repair: 1, retired: 1 };
    d.assets = d.assets.filter(function (a) { return a && ORGS[a.mode] && S[a.status] && ORGS[a.mode].cats[a.cat]; }).map(function (a) {
      return { id: clean(a.id, 12), tag: clean(a.tag, 12), mode: a.mode, name: clean(a.name, 60), cat: a.cat, brand: clean(a.brand, 60), serial: clean(a.serial, 40),
        cost: Math.max(0, Math.min(1e7, +a.cost || 0)), bought: /^\d{4}-\d{2}-\d{2}$/.test(a.bought) ? a.bought : '', warranty: /^\d{4}-\d{2}-\d{2}$/.test(a.warranty) ? a.warranty : '',
        status: a.status, holder: holderName(a.mode, a.holder) ? a.holder : null, notes: clean(a.notes, 200),
        hist: (Array.isArray(a.hist) ? a.hist : []).slice(-50).map(function (x) { return { d: clean(x.d, 10), a: clean(x.a, 12), w: x.w ? clean(x.w, 6) : undefined, n: x.n ? clean(x.n, 80) : undefined }; }) };
    });
    d.seq = d.seq || { company: 100, home: 100 };
    return d;
  }
  var db = validate(STORE.load()) || seed();
  function save() { STORE.save(db); }

  /* ---------- State ---------- */
  var state = { mode: 'company', view: 'dash', q: '', cat: '', status: '', sort: 'name', dir: 1, open: null, editing: null, holderFilter: null };
  function $(id) { return document.getElementById(id); }
  function mine() { return db.assets.filter(function (a) { return a.mode === state.mode; }); }
  function byId(id) { for (var i = 0; i < db.assets.length; i++) if (db.assets[i].id === id) return db.assets[i]; return null; }
  var STATUS_PILL = { use: 'acc', free: 'ok', repair: 'warn', retired: '' };

  function statusPill(s) { return h('span', { class: 'pill ' + STATUS_PILL[s], text: T('s.' + s) }); }
  function warrantyText(a) {
    if (!a.warranty) return { t: T('noWarranty'), c: '' };
    var n = daysTo(a.warranty);
    if (n < 0) return { t: T('expired', { d: fmtDate(a.warranty) }), c: 'err' };
    if (n <= 60) return { t: T('endsIn', { n: n }), c: 'warn' };
    return { t: fmtDate(a.warranty), c: '' };
  }

  /* ---------- Header ---------- */
  function renderHeader() {
    $('orgName').textContent = ORGS[state.mode].name;
    $('orgMeta').textContent = T('meta.' + state.mode);
    $('tabPeople').textContent = state.mode === 'home' ? T('rooms') : T('people');
    $('thHolder').textContent = state.mode === 'home' ? T('location') : T('assignedTo');
    document.querySelectorAll('#modeSeg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-mode') === state.mode); });
    document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-view') === state.view); });
    document.querySelectorAll('.view').forEach(function (v) { v.classList.toggle('on', v.id === 'view-' + state.view); });
  }

  /* ---------- Overview ---------- */
  function renderDash() {
    var list = mine(), active = list.filter(function (a) { return a.status !== 'retired'; });
    var inUse = active.filter(function (a) { return a.status === 'use'; }).length;
    var exp = active.filter(function (a) { return a.warranty && daysTo(a.warranty) >= 0 && daysTo(a.warranty) <= 60; }).length;
    var rep = active.filter(function (a) { return a.status === 'repair'; }).length;
    var value = active.reduce(function (t, a) { return t + a.cost; }, 0);
    var k = $('kpis'); clear(k);
    [[T('k1'), active.length, T('k1s', { v: money(value) }), ''],
     [T('k2'), inUse, T('k2s', { p: active.length ? Math.round(inUse / active.length * 100) : 0 }), ''],
     [T('k3'), exp, T('k3s'), exp ? 'alert' : ''],
     [T('k4'), rep, T('k4s'), rep ? 'alert' : '']].forEach(function (x) {
      k.appendChild(h('div', { class: 'kpi ' + x[3] }, [h('span', { text: x[0] }), h('b', { text: String(x[1]) }), h('small', { text: x[2] })]));
    });

    var bc = $('byCat'); clear(bc);
    Object.keys(ORGS[state.mode].cats).forEach(function (c) {
      var of = active.filter(function (a) { return a.cat === c; });
      if (!of.length) return;
      var used = of.filter(function (a) { return a.status === 'use'; }).length;
      var fill = h('i'); fill.style.width = Math.round(used / of.length * 100) + '%';
      bc.appendChild(h('div', { class: 'bar', title: used + ' / ' + of.length }, [h('span', { text: catName(state.mode, c) }), h('span', { class: 'track' }, [fill]), h('b', { text: used + ' / ' + of.length })]));
    });

    var el = $('expList'); clear(el);
    var soon = list.filter(function (a) { return a.status !== 'retired' && a.warranty && daysTo(a.warranty) <= 90; })
      .sort(function (a, b) { return a.warranty < b.warranty ? -1 : 1; }).slice(0, 6);
    if (!soon.length) el.appendChild(h('p', { class: 'muted', text: T('noneExp') }));
    soon.forEach(function (a) {
      var w = warrantyText(a);
      el.appendChild(h('div', { class: 'li clickable', onclick: function () { openDrawer(a.id); } }, [
        h('div', null, [h('b', { text: tx(a.name) }), h('br'), h('small', { text: a.tag + ' · ' + a.brand })]),
        h('span', { class: 'pill ' + w.c, text: w.t })]));
    });

    var counts = { use: 0, free: 0, repair: 0, retired: 0 };
    list.forEach(function (a) { counts[a.status]++; });
    var strip = $('statusStrip'), leg = $('statusLegend'); clear(strip); clear(leg);
    var cls = { use: 's-use', free: 's-free', repair: 's-repair', retired: 's-retired' };
    Object.keys(counts).forEach(function (s) {
      var seg = h('i', { class: cls[s], title: T('s.' + s) + ': ' + counts[s] }); seg.style.width = (list.length ? counts[s] / list.length * 100 : 0) + '%';
      strip.appendChild(seg);
      leg.appendChild(h('span', null, [h('i', { class: cls[s] }), T('s.' + s) + ' · ' + counts[s]]));
    });

    var rl = $('recentList'); clear(rl);
    activity().slice(0, 6).forEach(function (e) { rl.appendChild(h('div', { class: 'li clickable', onclick: function () { openDrawer(e.asset.id); } }, [h('div', null, [h('b', { text: tx(e.asset.name) }), h('br'), h('small', { text: histText(e.ev, e.asset.mode) })]), h('small', { text: fmtDate(e.ev.d) })])); });
  }

  function histText(ev, mode) {
    var w = ev.w ? holderName(mode, ev.w) || '—' : '';
    var s = T('h.' + ev.a, { w: w });
    return ev.n ? s + ' — ' + ev.n : s;
  }
  function activity() {
    var all = [];
    mine().forEach(function (a) { a.hist.forEach(function (ev, i) { all.push({ asset: a, ev: ev, i: i }); }); });
    return all.sort(function (x, y) { return x.ev.d === y.ev.d ? y.i - x.i : (x.ev.d < y.ev.d ? 1 : -1); });
  }

  /* ---------- Assets table ---------- */
  function fillFilters() {
    var fc = $('fCat'), fs = $('fStatus'); clear(fc); clear(fs);
    fc.appendChild(h('option', { value: '', text: T('allCats') }));
    Object.keys(ORGS[state.mode].cats).forEach(function (c) { fc.appendChild(h('option', { value: c, text: catName(state.mode, c) })); });
    fc.value = state.cat;
    fs.appendChild(h('option', { value: '', text: T('allStatus') }));
    ['use', 'free', 'repair', 'retired'].forEach(function (s) { fs.appendChild(h('option', { value: s, text: T('s.' + s) })); });
    fs.value = state.status;
  }
  function filtered() {
    var q = state.q.toLowerCase();
    return mine().filter(function (a) {
      if (state.cat && a.cat !== state.cat) return false;
      if (state.status && a.status !== state.status) return false;
      if (state.holderFilter && a.holder !== state.holderFilter) return false;
      if (!q) return true;
      return [a.name, tx(a.name), a.tag, a.serial, a.brand, holderName(a.mode, a.holder) || ''].join(' ').toLowerCase().indexOf(q) !== -1;
    }).sort(function (a, b) {
      var k = state.sort, x, y;
      if (k === 'holder') { x = holderName(a.mode, a.holder) || '~'; y = holderName(b.mode, b.holder) || '~'; }
      else if (k === 'cost') { x = a.cost; y = b.cost; }
      else if (k === 'warranty') { x = a.warranty || '9999'; y = b.warranty || '9999'; }
      else if (k === 'cat') { x = catName(a.mode, a.cat); y = catName(b.mode, b.cat); }
      else if (k === 'status') { x = a.status; y = b.status; }
      else { x = a.name.toLowerCase(); y = b.name.toLowerCase(); }
      return (x < y ? -1 : x > y ? 1 : 0) * state.dir;
    });
  }
  function renderTable() {
    var tb = $('rows'); clear(tb);
    var list = filtered();
    if (!list.length) tb.appendChild(h('tr', null, [h('td', { colspan: '6', class: 'empty-row', text: T('noRows') })]));
    list.forEach(function (a) {
      var w = warrantyText(a);
      var initials = catName(a.mode, a.cat).slice(0, 2);
      tb.appendChild(h('tr', { class: state.open === a.id ? 'sel' : '', tabindex: '0',
        onclick: function () { openDrawer(a.id); },
        onkeydown: function (e) { if (e.key === 'Enter') openDrawer(a.id); } }, [
        h('td', null, [h('div', { class: 'asset-cell' }, [h('span', { class: 'cat-ico', text: initials }), h('div', { class: 'cell-main' }, [h('b', { text: tx(a.name) }), h('small', { class: 'mono', text: a.tag + ' · ' + a.brand })])])]),
        h('td', { text: catName(a.mode, a.cat) }),
        h('td', null, [statusPill(a.status)]),
        h('td', { text: holderName(a.mode, a.holder) || '—' }),
        h('td', null, [w.c ? h('span', { class: 'pill ' + w.c, text: w.t }) : h('span', { class: 'muted', text: w.t })]),
        h('td', { class: 'num', text: money(a.cost) })
      ]));
    });
    var tot = mine().length;
    $('rowCount').textContent = T('rows', { n: list.length, t: tot }) + (state.holderFilter ? ' · ' + holderName(state.mode, state.holderFilter) : '');
    document.querySelectorAll('th.sort').forEach(function (th) {
      var on = th.getAttribute('data-sort') === state.sort;
      th.setAttribute('aria-sort', on ? (state.dir > 0 ? 'ascending' : 'descending') : 'none');
      th.dataset.arrow = on ? (state.dir > 0 ? ' ↑' : ' ↓') : '';
    });
  }

  /* ---------- People / rooms ---------- */
  function renderPeople() {
    var g = $('peopleGrid'); clear(g);
    ORGS[state.mode].holders.forEach(function (hd) {
      var items = mine().filter(function (a) { return a.holder === hd[0] && a.status === 'use'; });
      var name = holderName(state.mode, hd[0]);
      var initials = name.split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2);
      var ul = h('ul');
      items.slice(0, 4).forEach(function (a) { ul.appendChild(h('li', null, [h('span', { text: tx(a.name) }), h('span', { class: 'muted mono', text: a.tag })])); });
      if (items.length > 4) ul.appendChild(h('li', { class: 'muted', text: '+' + (items.length - 4) }));
      if (!items.length) ul.appendChild(h('li', { class: 'muted', text: T('none') }));
      g.appendChild(h('article', { class: 'person', tabindex: '0', onclick: function () { state.holderFilter = hd[0]; state.view = 'assets'; renderAll(); } }, [
        h('div', { class: 'person-head' }, [h('span', { class: 'avatar', text: initials }), h('div', null, [h('b', { text: name }), h('br'), h('small', { class: 'muted', text: holderRole(state.mode, hd) })])]),
        ul,
        h('div', { class: 'tot' }, [h('span', { text: T('assets', { n: items.length }) }), h('b', { text: money(items.reduce(function (t, a) { return t + a.cost; }, 0)) })])
      ]));
    });
  }

  function renderActivity() {
    var box = $('actList'); clear(box);
    activity().slice(0, 60).forEach(function (e) {
      box.appendChild(h('div', { class: 'tl-item' }, [h('b', { text: tx(e.asset.name) + ' · ' + e.asset.tag }), h('span', { class: 'muted', text: histText(e.ev, e.asset.mode) + ' · ' + fmtDate(e.ev.d) })]));
    });
  }

  /* ---------- Drawer ---------- */
  function openDrawer(id) {
    state.open = id; renderDrawer();
    $('drawer').classList.add('open'); $('drawer').setAttribute('aria-hidden', 'false'); $('backdrop').hidden = false;
    if (state.view === 'assets') renderTable();
    setTimeout(function () { $('dClose').focus(); }, 50);
  }
  function closeDrawer() {
    state.open = null;
    $('drawer').classList.remove('open'); $('drawer').setAttribute('aria-hidden', 'true'); $('backdrop').hidden = true;
    if (state.view === 'assets') renderTable();
  }
  function renderDrawer() {
    var a = byId(state.open); if (!a) { closeDrawer(); return; }
    $('dTag').textContent = a.tag;
    $('dName').textContent = tx(a.name);
    var pills = $('dPills'); clear(pills);
    pills.appendChild(statusPill(a.status));
    pills.appendChild(h('span', { class: 'pill plain', text: catName(a.mode, a.cat) }));
    K.pattern($('dQr'), a.tag + a.serial);
    var kv = $('dKv'); clear(kv);
    var w = warrantyText(a);
    [[T('kBrand'), a.brand || '—'], [T('kSerial'), a.serial || '—'], [a.mode === 'home' ? T('kRoom') : T('kHolder'), holderName(a.mode, a.holder) || T('unassigned')],
     [T('kBought'), fmtDate(a.bought)], [T('kWarranty'), w.t], [T('kValue'), money(a.cost)], [T('kNotes'), tx(a.notes) || '—']].forEach(function (p) {
      kv.appendChild(h('dt', { text: p[0] })); kv.appendChild(h('dd', { text: p[1] }));
    });
    var hb = $('dHist'); clear(hb);
    a.hist.slice().reverse().forEach(function (ev) { hb.appendChild(h('div', { class: 'tl-item' }, [h('b', { text: histText(ev, a.mode) }), h('span', { class: 'muted', text: fmtDate(ev.d) })])); });
    var act = $('dActions'); clear(act);
    function btn(label, cls, fn) { act.appendChild(h('button', { type: 'button', class: 'btn sm ' + (cls || ''), text: label, onclick: fn })); }
    if (a.status === 'free') btn(T('aAssign'), '', function () { openAssign(a); });
    if (a.status === 'use') {
      if (a.mode === 'home') btn(T('aAssign'), '', function () { openAssign(a); });
      else btn(T('aReturn'), '', function () { change(a, 'free', 'returned', a.holder); });
    }
    if (a.status === 'use' || a.status === 'free') btn(T('aRepair'), 'ghost', function () { change(a, 'repair', 'repair'); });
    if (a.status === 'repair') btn(T('aBack'), '', function () { change(a, 'free', 'repaired'); });
    if (a.status !== 'retired') btn(T('aRetire'), 'ghost', function () { change(a, 'retired', 'retired'); });
    else btn(T('aRestore'), '', function () { change(a, 'free', 'restored'); });
    btn(T('aEdit'), 'ghost', function () { openForm(a); });
    btn(T('aDelete'), 'danger', function () {
      if (!window.confirm(T('confirmDelete'))) return;
      db.assets = db.assets.filter(function (x) { return x.id !== a.id; }); save(); closeDrawer(); K.toast(T('tDeleted')); renderAll();
    });
  }
  function change(a, status, ev, who) {
    var e = { d: TODAY, a: ev }; if (who) e.w = who;
    a.status = status;
    if (status !== 'use') a.holder = null;
    a.hist.push(e); save(); K.toast(T('tDone')); renderDrawer(); renderAll();
  }

  /* ---------- Assign ---------- */
  var assigning = null;
  function openAssign(a) {
    assigning = a;
    var home = a.mode === 'home';
    $('assignTitle').textContent = T(home ? 'moveTitle' : 'assignTitle', { n: tx(a.name) });
    $('assignLabel').textContent = T(home ? 'moveWho' : 'assignWho');
    var s = $('aWho'); clear(s);
    ORGS[a.mode].holders.forEach(function (hd) { if (hd[0] !== a.holder) s.appendChild(h('option', { value: hd[0], text: holderName(a.mode, hd[0]) })); });
    $('aNote').value = '';
    $('assignModal').hidden = false; s.focus();
  }
  function saveAssign() {
    var a = assigning; if (!a) return;
    var who = $('aWho').value; if (!holderName(a.mode, who)) return;
    var note = clean($('aNote').value, 80);
    a.status = 'use'; a.holder = who;
    var e = { d: TODAY, a: a.mode === 'home' ? 'moved' : 'assigned', w: who }; if (note) e.n = note;
    a.hist.push(e); save();
    $('assignModal').hidden = true; assigning = null; K.toast(T('tDone')); renderDrawer(); renderAll();
  }

  /* ---------- Add / edit form ---------- */
  function openForm(a) {
    state.editing = a ? a.id : null;
    $('formTitle').textContent = a ? T('editTitle') : T('newTitle');
    var sc = $('iCat'); clear(sc);
    Object.keys(ORGS[state.mode].cats).forEach(function (c) { sc.appendChild(h('option', { value: c, text: catName(state.mode, c) })); });
    $('iName').value = a ? a.name : ''; sc.value = a ? a.cat : Object.keys(ORGS[state.mode].cats)[0];
    $('iBrand').value = a ? a.brand : ''; $('iSerial').value = a ? a.serial : '';
    $('iCost').value = a ? a.cost : ''; $('iBought').value = a ? a.bought : TODAY;
    $('iWarranty').value = a ? a.warranty : iso(addDays(new Date(), 365)); $('iNotes').value = a ? a.notes : '';
    $('fErr').textContent = '';
    $('formModal').hidden = false; $('iName').focus();
  }
  function saveForm() {
    var name = clean($('iName').value, 60), cat = $('iCat').value, cost = +$('iCost').value || 0;
    var bought = $('iBought').value, warranty = $('iWarranty').value;
    if (name.length < 2) { $('fErr').textContent = T('eName'); return; }
    if (!ORGS[state.mode].cats[cat]) return;
    if (cost < 0 || cost > 1e7 || isNaN(cost)) { $('fErr').textContent = T('eCost'); return; }
    if (bought && warranty && warranty < bought) { $('fErr').textContent = T('eDates'); return; }
    var data = { name: name, cat: cat, brand: clean($('iBrand').value, 60), serial: clean($('iSerial').value, 40).toUpperCase(), cost: Math.round(cost),
      bought: /^\d{4}-\d{2}-\d{2}$/.test(bought) ? bought : '', warranty: /^\d{4}-\d{2}-\d{2}$/.test(warranty) ? warranty : '', notes: clean($('iNotes').value, 200) };
    var a;
    if (state.editing) {
      a = byId(state.editing); Object.keys(data).forEach(function (k) { a[k] = data[k]; });
      a.hist.push({ d: TODAY, a: 'edited' }); K.toast(T('tSaved'));
    } else {
      db.seq[state.mode] = (db.seq[state.mode] || 0) + 1;
      var n = db.seq[state.mode];
      a = { id: state.mode[0] + 'n' + Date.now().toString(36), tag: ORGS[state.mode].prefix + '-' + (n < 1000 ? ('000' + n).slice(-4) : n), mode: state.mode,
        status: 'free', holder: null, hist: [{ d: TODAY, a: 'created' }] };
      Object.keys(data).forEach(function (k) { a[k] = data[k]; });
      db.assets.push(a); K.toast(T('tAdded'));
    }
    save(); $('formModal').hidden = true; renderAll(); openDrawer(a.id);
  }

  /* ---------- CSV ---------- */
  function exportCsv() {
    var rows = [T('csvHead')];
    filtered().forEach(function (a) {
      rows.push([a.tag, tx(a.name), catName(a.mode, a.cat), a.brand, a.serial, T('s.' + a.status), holderName(a.mode, a.holder) || '', a.bought, a.warranty, a.cost]);
    });
    K.downloadCsv('inventra-' + state.mode + '-' + TODAY + '.csv', rows);
    K.toast(T('tCsv'));
  }

  /* ---------- Render all ---------- */
  function renderAll() {
    renderHeader();
    if (state.view === 'dash') renderDash();
    if (state.view === 'assets') { fillFilters(); renderTable(); }
    if (state.view === 'people') renderPeople();
    if (state.view === 'activity') renderActivity();
    if (state.open) renderDrawer();
  }

  /* ---------- Wiring ---------- */
  document.querySelectorAll('#modeSeg button').forEach(function (b) {
    b.addEventListener('click', function () {
      state.mode = b.getAttribute('data-mode'); state.cat = ''; state.status = ''; state.holderFilter = null; state.q = ''; $('q').value = '';
      closeDrawer(); renderAll();
    });
  });
  document.querySelectorAll('#tabs button').forEach(function (b) {
    b.addEventListener('click', function () { state.view = b.getAttribute('data-view'); if (state.view !== 'assets') state.holderFilter = null; renderAll(); });
  });
  $('q').addEventListener('input', function () { state.q = clean(this.value, 60); renderTable(); });
  $('fCat').addEventListener('change', function () { state.cat = this.value; renderTable(); });
  $('fStatus').addEventListener('change', function () { state.status = this.value; renderTable(); });
  document.querySelectorAll('th.sort').forEach(function (th) {
    th.addEventListener('click', function () {
      var k = th.getAttribute('data-sort');
      if (state.sort === k) state.dir = -state.dir; else { state.sort = k; state.dir = 1; }
      renderTable();
    });
  });
  $('addBtn').addEventListener('click', function () { openForm(null); });
  $('csvBtn').addEventListener('click', exportCsv);
  $('dClose').addEventListener('click', closeDrawer);
  $('backdrop').addEventListener('click', closeDrawer);
  $('fSave').addEventListener('click', saveForm);
  $('fCancel').addEventListener('click', function () { $('formModal').hidden = true; });
  $('fClose').addEventListener('click', function () { $('formModal').hidden = true; });
  $('aSave').addEventListener('click', saveAssign);
  $('aCancel').addEventListener('click', function () { $('assignModal').hidden = true; });
  $('aClose').addEventListener('click', function () { $('assignModal').hidden = true; });
  document.querySelectorAll('.modal').forEach(function (m) { m.addEventListener('click', function (e) { if (e.target === m) m.hidden = true; }); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || document.querySelector('.dk-tour')) return;
    var open = document.querySelector('.modal:not([hidden])');
    if (open) open.hidden = true; else if (state.open) closeDrawer();
  });
  $('resetBtn').addEventListener('click', function () { STORE.clear(); db = seed(); save(); closeDrawer(); K.toast(T('tReset')); renderAll(); });

  /* ---------- Tour ---------- */
  function go(view) { return function () { closeDrawer(); if (state.view !== view) { state.view = view; renderAll(); } }; }
  var tour = new K.Tour({
    key: 'inventra', lang: function () { return L.lang; },
    steps: [
      { target: null, title: { en: 'Welcome to Inventra', es: 'Bienvenido a Inventra' },
        body: { en: 'Inventra keeps track of equipment: what you own, who has it, what it is worth and when its warranty ends. Everything here is fictional — try it freely.', es: 'Inventra lleva el control del equipo: qué tienes, quién lo tiene, cuánto vale y cuándo vence su garantía. Todo es ficticio, pruébalo con confianza.' } },
      { target: '#modeSeg', before: go('dash'), title: { en: 'Company or home', es: 'Empresa u hogar' },
        body: { en: 'In Company mode equipment is handed to employees. In Home mode appliances and devices are organized by room.', es: 'En modo Empresa el equipo se entrega a colaboradores. En modo Hogar los aparatos se organizan por espacio de la casa.' } },
      { target: '#kpis', before: go('dash'), title: { en: 'Health at a glance', es: 'Todo de un vistazo' },
        body: { en: 'Totals, value, warranties about to end and devices in repair. Yellow numbers need attention.', es: 'Totales, valor, garantías por vencer y equipos en reparación. Los números en amarillo requieren atención.' } },
      { target: '#expPanel', before: go('dash'), title: { en: 'Never miss a warranty', es: 'Que no se te pase una garantía' },
        body: { en: 'Assets whose warranty ends soon appear here first. Click one to open it.', es: 'Los activos cuya garantía está por vencer aparecen aquí primero. Haz clic en uno para abrirlo.' } },
      { target: '#toolbar', before: go('assets'), title: { en: 'Find anything fast', es: 'Encuentra lo que sea rápido' },
        body: { en: 'Search by name, tag, serial or person, filter by category and status, and export what you see to CSV.', es: 'Busca por nombre, etiqueta, serie o persona, filtra por categoría y estado, y exporta lo que ves a CSV.' } },
      { target: '#addBtn', before: go('assets'), title: { en: 'Register new equipment', es: 'Registra equipo nuevo' },
        body: { en: 'Add an asset with its serial, value and warranty. It receives a tag automatically.', es: 'Agrega un activo con su serie, valor y garantía. Recibe una etiqueta automáticamente.' } },
      { target: '#rows', before: go('assets'), title: { en: 'Open any asset', es: 'Abre cualquier activo' },
        body: { en: 'Click a row to see its label, details and full history, and to assign, return, send to repair or retire it.', es: 'Haz clic en una fila para ver su etiqueta, datos e historial completo, y para asignarlo, devolverlo, mandarlo a reparación o darlo de baja.' } },
      { target: '#tabs', before: go('assets'), title: { en: 'People and activity', es: 'Personas y actividad' },
        body: { en: 'See what each person (or room) has, and a timeline of every movement.', es: 'Mira qué tiene cada persona (o espacio) y una línea de tiempo de cada movimiento.' } },
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
