/* Settle — payables and renewals demo.
   Portfolio mockup: fictional data stored only in this browser (localStorage).
   Security: user text written with textContent only and sanitized before storage; CSV export neutralizes formulas. */
(function () {
  'use strict';
  var K = window.DemoKit, h = K.h, clear = K.clear, clean = K.clean;
  var STORE = K.store('settle.demo.v1');

  var L = new K.I18n({
    en: {
      back: 'Portfolio', badge: 'Demo · fictional data', 'mode.biz': 'Business', 'mode.home': 'Household', tour: 'Take the tour', reset: 'Reset demo',
      'tab.dash': 'Overview', 'tab.pay': 'Payments', 'tab.ren': 'Renewals', 'tab.rep': 'Reports',
      'd.next': "What's coming", 'd.ren': 'Renewals in the next 60 days', 'p.add': 'Add payment', 'p.search': 'Search vendor or concept', 'p.export': 'Export CSV',
      'c.vendor': 'Vendor / concept', 'c.due': 'Due', 'c.status': 'Status', 'c.amount': 'Amount', project: 'Project', account: 'Account',
      'r.hint': 'Insurance, certificates, licenses and subscriptions that must be renewed on time.', 'r.add': 'Add renewal',
      'rep.month': 'Last 6 months', byProject: 'Spending by project (paid, last 6 months)', byAccount: 'Spending by account (paid, last 6 months)',
      'f.vendor': 'Vendor', 'f.concept': 'Concept', 'f.amount': 'Amount (MXN)', 'f.due': 'Due date', 'f.repeat': 'Repeats', 'f.once': 'One time', 'f.monthly': 'Monthly',
      'f.paidOn': 'Paid on', 'f.method': 'Method', 'f.ref': 'Reference (optional)', 'm.transfer': 'Bank transfer', 'm.card': 'Card', 'm.cash': 'Cash', 'm.check': 'Check',
      'f.rname': 'Name', 'f.rkind': 'Type', 'f.expires': 'Expires', 'f.cost': 'Renewal cost (MXN)', 'f.every': 'Renews every',
      'k.insurance': 'Insurance', 'k.cert': 'Certificate', 'k.license': 'License', 'k.sub': 'Subscription', 'k.permit': 'Permit',
      'e.12': '12 months', 'e.24': '2 years', 'e.48': '4 years', 'e.1': 'Month',
      cancel: 'Cancel', save: 'Save', markPaid: 'Mark as paid',
      'meta.biz': 'Business mode · suppliers, payroll and permits by project', 'meta.home': 'Household mode · bills, insurance and subscriptions by account',
      allGroups: 'All', 'st.all': 'All', 'st.pending': 'Pending', 'st.late': 'Overdue', 'st.paid': 'Paid',
      soon: 'Due soon', late: 'Overdue', pending: 'Pending', paid: 'Paid', today: 'Today', tomorrow: 'Tomorrow', inDays: 'in {n} days', ago: '{n} days ago',
      k1: 'Overdue', k2: 'Due in the next 7 days', k3: 'Paid this month', k4: 'Renewals in 30 days', k1s: '{n} payments', k2s: '{n} payments', k3s: '{n} payments', k4s: 'Do not let them lapse',
      b0: 'Overdue', b1: 'Next 7 days', b2: 'Next 30 days', b3: 'Later (up to 60 days)', nothing: 'Nothing pending here. Nice.',
      rowsSum: '{n} payments · pending {p} · paid {q}', noRows: 'No payments match your filters.', repeats: 'Monthly',
      newPay: 'New payment', editPay: 'Edit payment', paidTitle: 'Mark as paid', newRen: 'New renewal',
      edit: 'Edit', del: 'Delete', pay: 'Pay', undo: 'Undo', renew: 'Renew', expired: 'Expired', daysLeft: 'days left', daysAgo: 'days ago', expires: 'Expires {d}', renewCost: 'Renewal {c}',
      tSaved: 'Saved', tPaid: 'Marked as paid', tNext: 'Next month created automatically', tDel: 'Deleted', tUndo: 'Payment reopened', tRenew: 'Renewed until {d} · payment recorded', tReset: 'Demo data restored', tCsv: 'CSV downloaded',
      eVendor: 'Enter the vendor.', eAmount: 'Enter an amount greater than zero.', eDate: 'Choose a date.', eName: 'Enter a name.',
      confirmDel: 'Delete this item? This only affects the demo data in your browser.', paidLegend: 'Paid', pendLegend: 'Pending', renewalOf: 'Renewal: {n}',
      csvHead: ['Vendor', 'Concept', 'Group', 'Due', 'Status', 'Amount MXN', 'Paid on', 'Method', 'Reference']
    },
    es: {
      back: 'Portafolio', badge: 'Demo · datos ficticios', 'mode.biz': 'Empresa', 'mode.home': 'Hogar', tour: 'Ver recorrido', reset: 'Reiniciar demo',
      'tab.dash': 'Resumen', 'tab.pay': 'Pagos', 'tab.ren': 'Renovaciones', 'tab.rep': 'Reportes',
      'd.next': 'Lo que viene', 'd.ren': 'Renovaciones en los próximos 60 días', 'p.add': 'Agregar pago', 'p.search': 'Busca proveedor o concepto', 'p.export': 'Exportar CSV',
      'c.vendor': 'Proveedor / concepto', 'c.due': 'Vence', 'c.status': 'Estado', 'c.amount': 'Monto', project: 'Proyecto', account: 'Cuenta',
      'r.hint': 'Seguros, certificados, licencias y suscripciones que hay que renovar a tiempo.', 'r.add': 'Agregar renovación',
      'rep.month': 'Últimos 6 meses', byProject: 'Gasto por proyecto (pagado, últimos 6 meses)', byAccount: 'Gasto por cuenta (pagado, últimos 6 meses)',
      'f.vendor': 'Proveedor', 'f.concept': 'Concepto', 'f.amount': 'Monto (MXN)', 'f.due': 'Fecha de vencimiento', 'f.repeat': 'Se repite', 'f.once': 'Una vez', 'f.monthly': 'Cada mes',
      'f.paidOn': 'Pagado el', 'f.method': 'Forma de pago', 'f.ref': 'Referencia (opcional)', 'm.transfer': 'Transferencia', 'm.card': 'Tarjeta', 'm.cash': 'Efectivo', 'm.check': 'Cheque',
      'f.rname': 'Nombre', 'f.rkind': 'Tipo', 'f.expires': 'Vence', 'f.cost': 'Costo de renovación (MXN)', 'f.every': 'Se renueva cada',
      'k.insurance': 'Seguro', 'k.cert': 'Certificado', 'k.license': 'Licencia', 'k.sub': 'Suscripción', 'k.permit': 'Permiso',
      'e.12': '12 meses', 'e.24': '2 años', 'e.48': '4 años', 'e.1': 'Mes',
      cancel: 'Cancelar', save: 'Guardar', markPaid: 'Marcar como pagado',
      'meta.biz': 'Modo empresa · proveedores, nómina y permisos por proyecto', 'meta.home': 'Modo hogar · recibos, seguros y suscripciones por cuenta',
      allGroups: 'Todos', 'st.all': 'Todos', 'st.pending': 'Pendientes', 'st.late': 'Vencidos', 'st.paid': 'Pagados',
      soon: 'Por vencer', late: 'Vencido', pending: 'Pendiente', paid: 'Pagado', today: 'Hoy', tomorrow: 'Mañana', inDays: 'en {n} días', ago: 'hace {n} días',
      k1: 'Vencido', k2: 'Vence en los próximos 7 días', k3: 'Pagado este mes', k4: 'Renovaciones en 30 días', k1s: '{n} pagos', k2s: '{n} pagos', k3s: '{n} pagos', k4s: 'Que no se te pasen',
      b0: 'Vencidos', b1: 'Próximos 7 días', b2: 'Próximos 30 días', b3: 'Después (hasta 60 días)', nothing: 'Nada pendiente aquí.',
      rowsSum: '{n} pagos · pendiente {p} · pagado {q}', noRows: 'Ningún pago coincide con los filtros.', repeats: 'Mensual',
      newPay: 'Nuevo pago', editPay: 'Editar pago', paidTitle: 'Marcar como pagado', newRen: 'Nueva renovación',
      edit: 'Editar', del: 'Eliminar', pay: 'Pagar', undo: 'Deshacer', renew: 'Renovar', expired: 'Vencido', daysLeft: 'días restantes', daysAgo: 'días vencido', expires: 'Vence {d}', renewCost: 'Renovación {c}',
      tSaved: 'Guardado', tPaid: 'Marcado como pagado', tNext: 'Se creó automáticamente el del próximo mes', tDel: 'Eliminado', tUndo: 'Pago reabierto', tRenew: 'Renovado hasta {d} · pago registrado', tReset: 'Datos de la demo restaurados', tCsv: 'CSV descargado',
      eVendor: 'Escribe el proveedor.', eAmount: 'Escribe un monto mayor a cero.', eDate: 'Elige una fecha.', eName: 'Escribe un nombre.',
      confirmDel: '¿Eliminar este registro? Solo afecta los datos de la demo en tu navegador.', paidLegend: 'Pagado', pendLegend: 'Pendiente', renewalOf: 'Renovación: {n}',
      csvHead: ['Proveedor', 'Concepto', 'Grupo', 'Vence', 'Estado', 'Monto MXN', 'Pagado el', 'Forma de pago', 'Referencia']
    }
  });
  var T = L.t;

  var ORGS = {
    biz: { name: 'Obra Norte Construction', nameEs: 'Constructora Obra Norte', group: 'project', groups: [['g1', 'Torre Alameda', 'Torre Alameda'], ['g2', 'Casa Lomas', 'Casa Lomas'], ['g3', 'Main office', 'Oficina central']] },
    home: { name: 'The Ruiz household', nameEs: 'Hogar Ruiz', group: 'account', groups: [['h1', 'Home', 'Casa'], ['h2', 'Car', 'Auto'], ['h3', 'Family', 'Familia'], ['h4', 'Personal', 'Personal']] }
  };
  function orgName(m) { return L.lang === 'es' && ORGS[m].nameEs ? ORGS[m].nameEs : ORGS[m].name; }
  function groupName(m, g) { var gs = ORGS[m].groups; for (var i = 0; i < gs.length; i++) if (gs[i][0] === g) return gs[i][L.lang === 'es' ? 2 : 1]; return '—'; }

  /* ---------- Dates & money ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return iso(d); }
  function addMonths(s, n) { var d = parse(s), day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + n); var last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(day, last)); return iso(d); }
  var TODAY = iso(new Date());
  function diff(s) { return Math.round((parse(s) - parse(TODAY)) / 86400000); }
  function loc() { return L.lang === 'es' ? 'es-MX' : 'en-US'; }
  function fmtDate(s) { try { return parse(s).toLocaleDateString(loc(), { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return s; } }
  function money(n) { try { return new Intl.NumberFormat(loc(), { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n || 0); } catch (e) { return '$' + Math.round(n); } }
  function rel(s) { var n = diff(s); return n === 0 ? T('today') : n === 1 ? T('tomorrow') : n > 0 ? T('inDays', { n: n }) : T('ago', { n: -n }); }

  /* ---------- Seed ---------- */
  function seed() {
    var r = K.rng(9031), pays = [], rens = [], id = 0;
    function P(mode, vendor, concept, group, amount, due, repeat) {
      pays.push({ id: 'p' + (++id), mode: mode, vendor: vendor, concept: concept, group: group, amount: amount, due: due, status: 'pending', paidOn: '', method: '', ref: '', repeat: repeat ? 1 : 0 });
      return pays[pays.length - 1];
    }
    function payIt(p, lateDays) { p.status = 'paid'; p.paidOn = addDays(p.due, lateDays || 0); p.method = ['transfer', 'transfer', 'card', 'check'][Math.floor(r() * 4)]; p.ref = 'REF' + Math.floor(100000 + r() * 899999); }
    var monthly = {
      biz: [['Payroll — site crew', 'Weekly payroll (month total)', 'g1', 186000, 5], ['Payroll — site crew', 'Weekly payroll (month total)', 'g2', 92000, 5], ['Office rent', 'Main office lease', 'g3', 38000, 1],
            ['Grúas del Norte', 'Crane rental', 'g1', 54000, 12], ['Internet & phones', 'Business plan', 'g3', 3200, 18], ['Social security fees', 'Employer contributions', 'g3', 41000, 17]],
      home: [['Mortgage', 'Monthly installment', 'h1', 14500, 5], ['Electricity', 'Bimonthly bill (avg.)', 'h1', 1150, 20], ['Internet', 'Fiber 500 Mb', 'h1', 699, 12],
             ['Car loan', 'Monthly installment', 'h2', 6800, 15], ['School tuition', 'Monthly fee', 'h3', 5900, 10], ['Gym', 'Membership', 'h4', 899, 3], ['Streaming', 'Video + music bundle', 'h4', 459, 22]]
    };
    var base = parse(TODAY); base.setDate(1);
    Object.keys(monthly).forEach(function (m) {
      monthly[m].forEach(function (x) {
        for (var k = -5; k <= 1; k++) {
          var due = iso(new Date(base.getFullYear(), base.getMonth() + k, x[4]));
          var p = P(m, x[0], x[1], x[2], Math.round(x[3] * (0.95 + r() * 0.1)), due, k === 1 || diff(due) >= 0);
          if (diff(due) < -2 || (diff(due) < 0 && r() > 0.3)) payIt(p, Math.floor(r() * 3) - 1);
        }
      });
    });
    // One-off supplier invoices
    [['Aceros Rivera', 'Rebar 3/8" — 12 t', 'g1', 214500, -9], ['Concretos Altamira', 'Ready‑mix concrete 60 m³', 'g1', 168000, 3], ['Ferretería La Fragua', 'Tools and hardware', 'g2', 18450, -3],
     ['Electro Instalaciones Vega', 'Electrical works — phase 2', 'g2', 96000, 6], ['Vidrios del Valle', 'Windows — 4th floor', 'g1', 132000, 19], ['Despacho Lomelí', 'Structural review', 'g2', 28000, 26],
     ['Papelería Central', 'Office supplies', 'g3', 2350, -20], ['Aceros Rivera', 'Steel beams', 'g1', 305000, -40], ['Concretos Altamira', 'Ready‑mix concrete 40 m³', 'g2', 112000, -55]].forEach(function (x) {
      var p = P('biz', x[0], x[1], x[2], x[3], addDays(TODAY, x[4]), 0);
      if (x[4] < -15) payIt(p, 2);
    });
    [['Plumber', 'Water heater repair', 'h1', 1800, 2], ['Pediatrician', 'Check‑up', 'h3', 950, -4], ['Car service', '30,000 km maintenance', 'h2', 4200, 9], ['Credit card', 'Statement balance', 'h4', 8730, 4]].forEach(function (x) {
      P('home', x[0], x[1], x[2], x[3], addDays(TODAY, x[4]), 0);
    });
    function R(mode, name, kind, days, cost, every) { rens.push({ id: 'r' + (++id), mode: mode, name: name, kind: kind, exp: addDays(TODAY, days), cost: cost, every: every }); }
    R('biz', 'Vehicle insurance — pickup truck', 'insurance', 12, 18900, 12);
    R('biz', 'Tax digital signature certificate', 'cert', 27, 0, 48);
    R('biz', 'Accounting software license', 'license', 46, 9800, 12);
    R('biz', 'Building permit — Torre Alameda', 'permit', 120, 35000, 12);
    R('biz', 'Liability insurance', 'insurance', -3, 42000, 12);
    R('biz', 'Domain and hosting', 'sub', 210, 2400, 12);
    R('home', 'Car insurance', 'insurance', 8, 11200, 12);
    R('home', 'Home insurance', 'insurance', 95, 6400, 12);
    R('home', 'Passport — Ana', 'permit', 52, 1700, 72);
    R('home', 'Driver\'s license', 'permit', 300, 1100, 36);
    R('home', 'Cloud storage 2 TB', 'sub', 19, 1990, 12);
    return { v: 1, pays: pays, rens: rens, seq: id };
  }
  function validate(d) {
    if (!d || d.v !== 1 || !Array.isArray(d.pays) || !Array.isArray(d.rens)) return null;
    var isDate = function (s) { return /^\d{4}-\d{2}-\d{2}$/.test(s); };
    d.pays = d.pays.filter(function (p) { return p && ORGS[p.mode] && isDate(p.due) && (p.status === 'pending' || p.status === 'paid'); }).map(function (p) {
      return { id: clean(p.id, 16), mode: p.mode, vendor: clean(p.vendor, 60), concept: clean(p.concept, 80), group: clean(p.group, 4), amount: Math.max(0, Math.min(1e8, +p.amount || 0)),
        due: p.due, status: p.status, paidOn: isDate(p.paidOn) ? p.paidOn : '', method: ['transfer', 'card', 'cash', 'check'].indexOf(p.method) >= 0 ? p.method : '', ref: clean(p.ref, 40), repeat: p.repeat ? 1 : 0 };
    });
    d.rens = d.rens.filter(function (x) { return x && ORGS[x.mode] && isDate(x.exp); }).map(function (x) {
      return { id: clean(x.id, 16), mode: x.mode, name: clean(x.name, 60), kind: ['insurance', 'cert', 'license', 'sub', 'permit'].indexOf(x.kind) >= 0 ? x.kind : 'sub',
        exp: x.exp, cost: Math.max(0, Math.min(1e8, +x.cost || 0)), every: Math.max(1, Math.min(120, +x.every || 12)) };
    });
    d.seq = +d.seq || 1000;
    return d;
  }
  var db = validate(STORE.load()) || seed();
  function save() { STORE.save(db); }

  /* ---------- Translated seed text ---------- */
  var ES = { 'Payroll — site crew': 'Nómina — cuadrilla de obra', 'Weekly payroll (month total)': 'Nómina semanal (total del mes)', 'Office rent': 'Renta de oficina', 'Main office lease': 'Arrendamiento oficina central',
    'Crane rental': 'Renta de grúa', 'Internet & phones': 'Internet y telefonía', 'Business plan': 'Plan empresarial', 'Social security fees': 'Cuotas de seguridad social', 'Employer contributions': 'Aportaciones patronales',
    'Mortgage': 'Hipoteca', 'Monthly installment': 'Mensualidad', 'Electricity': 'Luz', 'Bimonthly bill (avg.)': 'Recibo bimestral (prom.)', 'Car loan': 'Crédito del auto', 'School tuition': 'Colegiatura',
    'Monthly fee': 'Cuota mensual', 'Gym': 'Gimnasio', 'Membership': 'Membresía', 'Video + music bundle': 'Paquete video + música', 'Rebar 3/8" — 12 t': 'Varilla 3/8" — 12 t',
    'Ready‑mix concrete 60 m³': 'Concreto premezclado 60 m³', 'Ready‑mix concrete 40 m³': 'Concreto premezclado 40 m³', 'Tools and hardware': 'Herramienta y ferretería', 'Electrical works — phase 2': 'Instalación eléctrica — fase 2',
    'Windows — 4th floor': 'Ventanas — piso 4', 'Structural review': 'Revisión estructural', 'Office supplies': 'Papelería de oficina', 'Steel beams': 'Vigas de acero', 'Plumber': 'Plomero',
    'Water heater repair': 'Reparación de boiler', 'Pediatrician': 'Pediatra', 'Check‑up': 'Consulta', 'Car service': 'Servicio del auto', '30,000 km maintenance': 'Servicio de 30,000 km',
    'Credit card': 'Tarjeta de crédito', 'Statement balance': 'Saldo del estado de cuenta', 'Vehicle insurance — pickup truck': 'Seguro vehicular — camioneta', 'Tax digital signature certificate': 'Certificado de firma digital fiscal',
    'Accounting software license': 'Licencia de software contable', 'Building permit — Torre Alameda': 'Licencia de construcción — Torre Alameda', 'Liability insurance': 'Seguro de responsabilidad civil',
    'Domain and hosting': 'Dominio y hosting', 'Car insurance': 'Seguro del auto', 'Home insurance': 'Seguro de casa', 'Passport — Ana': 'Pasaporte — Ana', 'Driver\'s license': 'Licencia de manejo', 'Cloud storage 2 TB': 'Almacenamiento en la nube 2 TB' };
  function tx(s) { if (L.lang !== 'es') return s; if (ES[s]) return ES[s]; var m = /^Renewal: (.*)$/.exec(s); return m ? 'Renovación: ' + tx(m[1]) : s; }

  /* ---------- State ---------- */
  var state = { mode: 'biz', view: 'dash', q: '', group: '', status: 'pending', editing: null, paying: null };
  function $(id) { return document.getElementById(id); }
  function mine() { return db.pays.filter(function (p) { return p.mode === state.mode; }); }
  function rensMine() { return db.rens.filter(function (x) { return x.mode === state.mode; }); }
  function isLate(p) { return p.status === 'pending' && diff(p.due) < 0; }
  function statusPill(p) {
    if (p.status === 'paid') return h('span', { class: 'pill ok', text: T('paid') });
    if (isLate(p)) return h('span', { class: 'pill err', text: T('late') });
    if (diff(p.due) <= 7) return h('span', { class: 'pill warn', text: T('soon') });
    return h('span', { class: 'pill', text: T('pending') });
  }
  function sum(list) { return list.reduce(function (t, p) { return t + p.amount; }, 0); }

  function renderHeader() {
    $('orgName').textContent = orgName(state.mode);
    $('orgMeta').textContent = T('meta.' + state.mode);
    var gl = T(ORGS[state.mode].group);
    $('thGroup').textContent = gl; $('lGroup').textContent = gl;
    $('repGroupTitle').textContent = ORGS[state.mode].group === 'project' ? T('byProject') : T('byAccount');
    document.querySelectorAll('#modeSeg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-mode') === state.mode); });
    document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-view') === state.view); });
    document.querySelectorAll('.view').forEach(function (v) { v.classList.toggle('on', v.id === 'view-' + state.view); });
  }

  /* ---------- Overview ---------- */
  function payLine(p) {
    var d = parse(p.due);
    return h('div', { class: 'pay-li' + (isLate(p) ? ' late' : '') }, [
      h('div', { class: 'datebox' }, [h('b', { text: String(d.getDate()) }), h('small', { text: d.toLocaleDateString(loc(), { month: 'short' }) })]),
      h('div', { class: 'cell-main' }, [h('b', { text: tx(p.vendor) }), h('small', { text: tx(p.concept) + ' · ' + groupName(p.mode, p.group) + ' · ' + rel(p.due) })]),
      h('span', { class: 'amt', text: money(p.amount) }),
      h('button', { type: 'button', class: 'icon-btn', text: T('pay'), onclick: function () { openPaid(p); } })
    ]);
  }
  function renderDash() {
    var list = mine(), pend = list.filter(function (p) { return p.status === 'pending'; });
    var late = pend.filter(isLate), week = pend.filter(function (p) { var n = diff(p.due); return n >= 0 && n <= 7; });
    var ym = TODAY.slice(0, 7), paidM = list.filter(function (p) { return p.status === 'paid' && p.paidOn.slice(0, 7) === ym; });
    var ren30 = rensMine().filter(function (x) { return diff(x.exp) <= 30; });
    var k = $('kpis'); clear(k);
    [[T('k1'), money(sum(late)), T('k1s', { n: late.length }), late.length ? 'alert bad' : ''], [T('k2'), money(sum(week)), T('k2s', { n: week.length }), week.length ? 'alert' : ''],
     [T('k3'), money(sum(paidM)), T('k3s', { n: paidM.length }), ''], [T('k4'), String(ren30.length), T('k4s'), ren30.length ? 'alert' : '']].forEach(function (x) {
      k.appendChild(h('div', { class: 'kpi ' + x[3] }, [h('span', { text: x[0] }), h('b', { text: x[1] }), h('small', { text: x[2] })]));
    });
    var bx = $('buckets'); clear(bx);
    var groups = [[T('b0'), function (n) { return n < 0; }, 'late'], [T('b1'), function (n) { return n >= 0 && n <= 7; }, ''], [T('b2'), function (n) { return n > 7 && n <= 30; }, ''], [T('b3'), function (n) { return n > 30 && n <= 60; }, '']];
    var any = false;
    groups.forEach(function (g) {
      var items = pend.filter(function (p) { return g[1](diff(p.due)); }).sort(function (a, b) { return a.due < b.due ? -1 : 1; });
      if (!items.length) return; any = true;
      var box = h('div', { class: 'bucket ' + g[2] }, [h('div', { class: 'bucket-head' }, [h('b', { text: g[0] + ' · ' + items.length }), h('span', { text: money(sum(items)) })])]);
      items.slice(0, 6).forEach(function (p) { box.appendChild(payLine(p)); });
      bx.appendChild(box);
    });
    if (!any) bx.appendChild(h('p', { class: 'muted', text: T('nothing') }));
    var rs = $('renSoon'); clear(rs);
    var soon = rensMine().filter(function (x) { return diff(x.exp) <= 60; }).sort(function (a, b) { return a.exp < b.exp ? -1 : 1; });
    if (!soon.length) rs.appendChild(h('p', { class: 'muted', text: T('nothing') }));
    soon.forEach(function (x) {
      var n = diff(x.exp);
      rs.appendChild(h('div', { class: 'li' }, [h('div', null, [h('b', { text: tx(x.name) }), h('br'), h('small', { text: T('k.' + x.kind) + ' · ' + T('expires', { d: fmtDate(x.exp) }) })]),
        h('span', { class: 'pill ' + (n < 0 ? 'err' : n <= 30 ? 'warn' : ''), text: n < 0 ? T('expired') : rel(x.exp) })]));
    });
  }

  /* ---------- Payments ---------- */
  function fillFilters() {
    var g = $('fGroup'); clear(g);
    g.appendChild(h('option', { value: '', text: T(ORGS[state.mode].group) + ': ' + T('allGroups') }));
    ORGS[state.mode].groups.forEach(function (x) { g.appendChild(h('option', { value: x[0], text: groupName(state.mode, x[0]) })); });
    g.value = state.group;
    var c = $('fStatus'); clear(c);
    ['pending', 'late', 'paid', 'all'].forEach(function (s) {
      c.appendChild(h('button', { type: 'button', class: 'chip' + (state.status === s ? ' on' : ''), text: T('st.' + s), onclick: function () { state.status = s; fillFilters(); renderTable(); } }));
    });
  }
  function filtered() {
    var q = state.q.toLowerCase();
    return mine().filter(function (p) {
      if (state.group && p.group !== state.group) return false;
      if (state.status === 'pending' && p.status !== 'pending') return false;
      if (state.status === 'late' && !isLate(p)) return false;
      if (state.status === 'paid' && p.status !== 'paid') return false;
      return !q || [p.vendor, p.concept, tx(p.vendor), tx(p.concept), p.ref].join(' ').toLowerCase().indexOf(q) !== -1;
    }).sort(function (a, b) { return state.status === 'paid' ? (a.due < b.due ? 1 : -1) : (a.due < b.due ? -1 : 1); });
  }
  function renderTable() {
    var tb = $('rows'), list = filtered(); clear(tb);
    if (!list.length) tb.appendChild(h('tr', null, [h('td', { colspan: '6', class: 'empty-row', text: T('noRows') })]));
    list.forEach(function (p) {
      var acts = h('div', { class: 'acts' });
      if (p.status === 'pending') acts.appendChild(h('button', { type: 'button', class: 'icon-btn', text: T('pay'), onclick: function (e) { e.stopPropagation(); openPaid(p); } }));
      else acts.appendChild(h('button', { type: 'button', class: 'icon-btn', text: T('undo'), onclick: function (e) { e.stopPropagation(); p.status = 'pending'; p.paidOn = ''; p.method = ''; p.ref = ''; save(); K.toast(T('tUndo')); renderAll(); } }));
      acts.appendChild(h('button', { type: 'button', class: 'icon-btn', text: T('edit'), onclick: function (e) { e.stopPropagation(); openPay(p); } }));
      acts.appendChild(h('button', { type: 'button', class: 'icon-btn del', text: T('del'), onclick: function (e) { e.stopPropagation(); if (window.confirm(T('confirmDel'))) { db.pays = db.pays.filter(function (x) { return x !== p; }); save(); K.toast(T('tDel')); renderAll(); } } }));
      var sub = tx(p.concept) + (p.repeat ? ' · ' + T('repeats') : '') + (p.status === 'paid' ? ' · ' + T('m.' + p.method) + ' ' + fmtDate(p.paidOn) + (p.ref ? ' · ' + p.ref : '') : '');
      tb.appendChild(h('tr', { onclick: function () { if (p.status === 'pending') openPaid(p); } }, [
        h('td', null, [h('div', { class: 'cell-main' }, [h('b', { text: tx(p.vendor) }), h('small', { text: sub })])]),
        h('td', { text: groupName(p.mode, p.group) }),
        h('td', null, [h('span', { text: fmtDate(p.due) }), h('br'), h('small', { class: 'muted', text: p.status === 'paid' ? '' : rel(p.due) })]),
        h('td', null, [statusPill(p)]), h('td', { class: 'num', text: money(p.amount) }), h('td', null, [acts])
      ]));
    });
    $('rowSum').textContent = T('rowsSum', { n: list.length, p: money(sum(list.filter(function (p) { return p.status === 'pending'; }))), q: money(sum(list.filter(function (p) { return p.status === 'paid'; }))) });
  }

  /* ---------- Renewals ---------- */
  function renderRen() {
    var g = $('renGrid'); clear(g);
    rensMine().sort(function (a, b) { return a.exp < b.exp ? -1 : 1; }).forEach(function (x) {
      var n = diff(x.exp), total = x.every * 30.4, frac = Math.max(0, Math.min(1, n / total));
      var cls = n < 0 ? 'late' : n <= 30 ? 'warn' : '';
      var fill = h('i'); fill.style.width = Math.round((1 - frac) * 100) + '%';
      g.appendChild(h('article', { class: 'ren ' + cls }, [
        h('div', { class: 'row-between' }, [h('span', { class: 'pill plain acc', text: T('k.' + x.kind) }), h('button', { type: 'button', class: 'icon-btn del', text: T('del'), onclick: function () { if (window.confirm(T('confirmDel'))) { db.rens = db.rens.filter(function (y) { return y !== x; }); save(); K.toast(T('tDel')); renderAll(); } } })]),
        h('h3', { text: tx(x.name) }),
        h('div', { class: 'days' }, [String(Math.abs(n)), h('small', { text: n < 0 ? T('daysAgo') : T('daysLeft') })]),
        h('span', { class: 'track' }, [fill]),
        h('div', { class: 'ren-foot' }, [h('small', { class: 'muted', text: T('expires', { d: fmtDate(x.exp) }) + (x.cost ? ' · ' + T('renewCost', { c: money(x.cost) }) : '') }),
          h('button', { type: 'button', class: 'btn sm', text: T('renew'), onclick: function () { renew(x); } })])
      ]));
    });
  }
  function renew(x) {
    var from = diff(x.exp) < 0 ? TODAY : x.exp;
    x.exp = addMonths(from, x.every);
    if (x.cost) {
      db.seq++;
      db.pays.push({ id: 'p' + db.seq, mode: x.mode, vendor: 'Renewal: ' + x.name, concept: T('k.' + x.kind), group: ORGS[x.mode].groups[ORGS[x.mode].groups.length - 1][0],
        amount: x.cost, due: TODAY, status: 'paid', paidOn: TODAY, method: 'transfer', ref: '', repeat: 0 });
    }
    save(); K.toast(T('tRenew', { d: fmtDate(x.exp) })); renderAll();
  }

  /* ---------- Reports ---------- */
  function renderRep() {
    var list = mine(), start = addMonths(TODAY.slice(0, 7) + '-01', -5);
    var bg = $('repGroup'); clear(bg);
    var paid6 = list.filter(function (p) { return p.status === 'paid' && p.paidOn >= start; });
    var by = {}; paid6.forEach(function (p) { by[p.group] = (by[p.group] || 0) + p.amount; });
    var max = Math.max.apply(null, Object.keys(by).map(function (k) { return by[k]; }).concat([1]));
    ORGS[state.mode].groups.forEach(function (g) {
      var v = by[g[0]] || 0, fill = h('i'); fill.style.width = Math.round(v / max * 100) + '%';
      bg.appendChild(h('div', { class: 'bar wide' }, [h('span', { text: groupName(state.mode, g[0]) }), h('span', { class: 'track' }, [fill]), h('b', { text: money(v) })]));
    });
    var cols = $('repMonths'); clear(cols);
    var months = []; for (var i = 0; i < 6; i++) months.push(addMonths(start, i).slice(0, 7));
    var data = months.map(function (m) {
      var inM = list.filter(function (p) { return p.due.slice(0, 7) === m; });
      return { m: m, paid: sum(inM.filter(function (p) { return p.status === 'paid'; })), pend: sum(inM.filter(function (p) { return p.status === 'pending'; })) };
    });
    var top = Math.max.apply(null, data.map(function (d) { return d.paid + d.pend; }).concat([1]));
    data.forEach(function (d) {
      var st = h('div', { class: 'stk', title: money(d.paid) + ' / ' + money(d.pend) });
      var a = h('i', { class: 'paid' }); a.style.height = (d.paid / top * 170) + 'px';
      var b = h('i', { class: 'pend' }); b.style.height = (d.pend / top * 170) + 'px';
      st.appendChild(a); st.appendChild(b); st.style.height = ((d.paid + d.pend) / top * 170) + 'px';
      cols.appendChild(h('div', { class: 'col' }, [st, h('small', { text: parse(d.m + '-01').toLocaleDateString(loc(), { month: 'short' }) })]));
    });
    var lg = $('repLegend'); clear(lg);
    lg.appendChild(h('span', null, [h('i', { class: 'paid' }), T('paidLegend')]));
    lg.appendChild(h('span', null, [h('i', { class: 'pend' }), T('pendLegend')]));
    lg.querySelector('.paid').style.background = 'var(--accent)'; lg.querySelector('.pend').style.background = '#c9d8dc';
  }

  /* ---------- Forms ---------- */
  function show(id) { $(id).hidden = false; }
  function hide(id) { $(id).hidden = true; }
  function openPay(p) {
    state.editing = p ? p.id : null;
    $('payTitle').textContent = p ? T('editPay') : T('newPay');
    var g = $('iGroup'); clear(g);
    ORGS[state.mode].groups.forEach(function (x) { g.appendChild(h('option', { value: x[0], text: groupName(state.mode, x[0]) })); });
    $('iVendor').value = p ? tx(p.vendor) : ''; $('iConcept').value = p ? tx(p.concept) : ''; g.value = p ? p.group : ORGS[state.mode].groups[0][0];
    $('iAmount').value = p ? p.amount : ''; $('iDue').value = p ? p.due : addDays(TODAY, 7); $('iRepeat').value = p && p.repeat ? '1' : '0';
    $('payErr').textContent = ''; show('payModal'); $('iVendor').focus();
  }
  function savePay() {
    var vendor = clean($('iVendor').value, 60), amount = Math.round((+$('iAmount').value || 0) * 100) / 100, due = $('iDue').value, group = $('iGroup').value;
    if (vendor.length < 2) { $('payErr').textContent = T('eVendor'); return; }
    if (!(amount > 0) || amount > 1e8) { $('payErr').textContent = T('eAmount'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) { $('payErr').textContent = T('eDate'); return; }
    if (!ORGS[state.mode].groups.some(function (g) { return g[0] === group; })) return;
    var data = { vendor: vendor, concept: clean($('iConcept').value, 80), group: group, amount: amount, due: due, repeat: $('iRepeat').value === '1' ? 1 : 0 };
    if (state.editing) { var p = db.pays.filter(function (x) { return x.id === state.editing; })[0]; Object.keys(data).forEach(function (k) { p[k] = data[k]; }); }
    else { db.seq++; var n = { id: 'p' + db.seq, mode: state.mode, status: 'pending', paidOn: '', method: '', ref: '' }; Object.keys(data).forEach(function (k) { n[k] = data[k]; }); db.pays.push(n); }
    save(); hide('payModal'); K.toast(T('tSaved')); renderAll();
  }
  function openPaid(p) {
    state.paying = p;
    $('paidTitle').textContent = T('paidTitle');
    $('paidSub').textContent = tx(p.vendor) + ' · ' + tx(p.concept) + ' · ' + money(p.amount);
    $('iPaidOn').value = TODAY; $('iMethod').value = 'transfer'; $('iRef').value = '';
    show('paidModal'); $('paidSave').focus();
  }
  function savePaid() {
    var p = state.paying; if (!p) return;
    p.status = 'paid'; p.paidOn = /^\d{4}-\d{2}-\d{2}$/.test($('iPaidOn').value) ? $('iPaidOn').value : TODAY;
    p.method = ['transfer', 'card', 'cash', 'check'].indexOf($('iMethod').value) >= 0 ? $('iMethod').value : 'transfer';
    p.ref = clean($('iRef').value, 40).toUpperCase();
    var msg = T('tPaid');
    if (p.repeat) {
      var nextDue = addMonths(p.due, 1);
      var exists = db.pays.some(function (x) { return x.mode === p.mode && x.vendor === p.vendor && x.group === p.group && x.due === nextDue; });
      if (!exists) { db.seq++; db.pays.push({ id: 'p' + db.seq, mode: p.mode, vendor: p.vendor, concept: p.concept, group: p.group, amount: p.amount, due: nextDue, status: 'pending', paidOn: '', method: '', ref: '', repeat: 1 }); msg = T('tNext'); }
    }
    save(); hide('paidModal'); state.paying = null; K.toast(msg); renderAll();
  }
  function openRen() {
    $('renTitle').textContent = T('newRen');
    $('rName').value = ''; $('rKind').value = 'insurance'; $('rExp').value = addDays(TODAY, 30); $('rCost').value = ''; $('rEvery').value = '12'; $('renErr').textContent = '';
    show('renModal'); $('rName').focus();
  }
  function saveRen() {
    var name = clean($('rName').value, 60), exp = $('rExp').value;
    if (name.length < 2) { $('renErr').textContent = T('eName'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(exp)) { $('renErr').textContent = T('eDate'); return; }
    db.seq++;
    db.rens.push({ id: 'r' + db.seq, mode: state.mode, name: name, kind: ['insurance', 'cert', 'license', 'sub', 'permit'].indexOf($('rKind').value) >= 0 ? $('rKind').value : 'sub',
      exp: exp, cost: Math.max(0, Math.min(1e8, +$('rCost').value || 0)), every: Math.max(1, Math.min(120, +$('rEvery').value || 12)) });
    save(); hide('renModal'); K.toast(T('tSaved')); renderAll();
  }
  function exportCsv() {
    var rows = [T('csvHead')];
    filtered().forEach(function (p) { rows.push([tx(p.vendor), tx(p.concept), groupName(p.mode, p.group), p.due, p.status === 'paid' ? T('paid') : isLate(p) ? T('late') : T('pending'), p.amount, p.paidOn, p.method ? T('m.' + p.method) : '', p.ref]); });
    K.downloadCsv('settle-' + state.mode + '-' + TODAY + '.csv', rows); K.toast(T('tCsv'));
  }

  function renderAll() {
    renderHeader();
    if (state.view === 'dash') renderDash();
    if (state.view === 'pay') { fillFilters(); renderTable(); }
    if (state.view === 'ren') renderRen();
    if (state.view === 'rep') renderRep();
  }

  document.querySelectorAll('#modeSeg button').forEach(function (b) { b.addEventListener('click', function () { state.mode = b.getAttribute('data-mode'); state.group = ''; renderAll(); }); });
  document.querySelectorAll('#tabs button').forEach(function (b) { b.addEventListener('click', function () { state.view = b.getAttribute('data-view'); renderAll(); }); });
  $('q').addEventListener('input', function () { state.q = clean(this.value, 60); renderTable(); });
  $('fGroup').addEventListener('change', function () { state.group = this.value; renderTable(); });
  $('addBtn').addEventListener('click', function () { openPay(null); });
  $('addBtn2').addEventListener('click', function () { openPay(null); });
  $('addRen').addEventListener('click', openRen);
  $('paySave').addEventListener('click', savePay);
  $('paidSave').addEventListener('click', savePaid);
  $('renSave').addEventListener('click', saveRen);
  $('csvBtn').addEventListener('click', exportCsv);
  document.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { hide(b.getAttribute('data-close')); }); });
  document.querySelectorAll('.modal').forEach(function (m) { m.addEventListener('click', function (e) { if (e.target === m) m.hidden = true; }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !document.querySelector('.dk-tour')) document.querySelectorAll('.modal').forEach(function (m) { m.hidden = true; }); });
  $('resetBtn').addEventListener('click', function () { STORE.clear(); db = seed(); save(); K.toast(T('tReset')); renderAll(); });

  function go(view) { return function () { if (state.view !== view) { state.view = view; renderAll(); } }; }
  var tour = new K.Tour({
    key: 'settle', lang: function () { return L.lang; },
    steps: [
      { target: null, title: { en: 'Welcome to Settle', es: 'Bienvenido a Settle' },
        body: { en: 'Every payment that is due, in one calm place: suppliers, payroll, bills and the renewals nobody should forget. All data is fictional.', es: 'Todos los pagos pendientes en un solo lugar: proveedores, nómina, recibos y las renovaciones que no se deben olvidar. Todos los datos son ficticios.' } },
      { target: '#modeSeg', before: go('dash'), title: { en: 'Business or household', es: 'Empresa u hogar' },
        body: { en: 'Business mode groups payments by construction project. Household mode groups them by account: home, car, family and personal.', es: 'El modo empresa agrupa los pagos por proyecto de obra. El modo hogar los agrupa por cuenta: casa, auto, familia y personal.' } },
      { target: '#kpis', before: go('dash'), title: { en: 'Money at a glance', es: 'El dinero de un vistazo' },
        body: { en: 'How much is overdue, what is due this week, what was paid this month and how many renewals are close.', es: 'Cuánto está vencido, qué vence esta semana, cuánto se pagó este mes y cuántas renovaciones están cerca.' } },
      { target: '#timelinePanel', before: go('dash'), title: { en: 'What is coming', es: 'Lo que viene' },
        body: { en: 'Pending payments grouped by urgency. Press Pay to record the date, method and reference. Monthly items create next month\'s payment automatically.', es: 'Pagos pendientes agrupados por urgencia. Presiona Pagar para registrar fecha, forma de pago y referencia. Los mensuales crean solos el pago del próximo mes.' } },
      { target: '#payBar', before: go('pay'), title: { en: 'Every payment', es: 'Todos los pagos' },
        body: { en: 'Search, filter by project or status, edit, undo and export exactly what you see to CSV for accounting.', es: 'Busca, filtra por proyecto o estado, edita, deshaz y exporta a CSV justo lo que ves para contabilidad.' } },
      { target: '#renGrid', before: go('ren'), title: { en: 'Renewals that cannot lapse', es: 'Renovaciones que no pueden vencer' },
        body: { en: 'Insurance, digital certificates, licenses and permits with a countdown. Renew moves the date forward and records the payment.', es: 'Seguros, certificados digitales, licencias y permisos con cuenta regresiva. Renovar recorre la fecha y registra el pago.' } },
      { target: '#tabs', before: go('rep'), title: { en: 'Reports', es: 'Reportes' },
        body: { en: 'Spending by project or account and the last six months paid versus pending.', es: 'Gasto por proyecto o cuenta y los últimos seis meses, pagado contra pendiente.' } },
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
