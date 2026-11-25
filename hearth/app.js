/* Hearth — shared finances demo (household or small business partners).
   Portfolio mockup: fictional people and amounts stored only in this browser (localStorage).
   Security: user text written with textContent only and sanitized before storage; stored data validated on load. */
(function () {
  'use strict';
  var K = window.DemoKit, h = K.h, clear = K.clear, clean = K.clean;
  var STORE = K.store('hearth.demo.v1');
  var SVGNS = 'http://www.w3.org/2000/svg';

  var L = new K.I18n({
    en: {
      back: 'Portfolio', badge: 'Demo · fictional data', 'mode.home': 'Household', 'mode.biz': 'Small business', tour: 'Take the tour', reset: 'Reset demo',
      't.ov': 'This month', 't.spend': 'Spending', 't.goals': 'Goals', 't.debts': 'Debts',
      'o.split': 'Who pays what', 'o.prop': 'By income', 'o.half': '50 / 50', 'o.fixed': 'Fixed bills this month', 'o.budgets': 'Budgets',
      's.title': 'Transactions this month', 's.add': 'Add an expense', 's.what': 'What was it?', 's.amount': 'Amount (MXN)', 's.cat': 'Category', 's.who': 'Paid by', 's.date': 'Date', 's.save': 'Add expense',
      'd.note': 'Projections use a fixed annual interest rate and monthly payments. They are estimates for planning, not financial advice.',
      'title.home': 'Lía & Tomás', 'meta.home': 'Household · shared expenses for a couple', 'title.biz': 'Studio Norte', 'meta.biz': 'Small business · two partners sharing costs',
      income: 'Income', revenue: 'Revenue generated', k1: 'Income this month', k1b: 'Revenue this month', k2: 'Spent so far', k3: 'Left this month', k4: 'Saving rate', k2s: '{p}% of income', k3s: 'After fixed bills and spending', k4s: 'Target: 20%',
      propHint: 'Fixed bills are split in proportion to each person\'s income — fair when incomes differ.', halfHint: 'Fixed bills are split evenly between both.',
      pays: 'pays {a} of fixed bills', share: '{p}% share',
      spentOf: '{s} of {l}', left: '{a} left', over: '{a} over', allCats: 'All categories', noTx: 'No transactions in this category yet.', paidBy: 'paid by {n}',
      eWhat: 'Describe the expense.', eAmt: 'Enter an amount greater than zero.', eDate: 'Choose a date this month.', tAdded: 'Expense added', tDel: 'Expense removed', tGoal: '{a} added to {g}', tReset: 'Demo data restored', tDone: 'Goal reached!',
      saved: 'saved of {t}', toGo: '{a} to go', reached: 'Goal reached',
      balance: 'Balance', rate: 'Annual rate', payment: 'Monthly payment', payoff: 'Paid off in', months: '{n} months', never: 'Payment too low to ever pay it off', interest: 'Total interest',
      extra: 'Extra per month', saveLine: 'Paying {e} extra saves {m} months and {i} in interest.', noExtra: 'Move the slider to see the effect of paying a little extra.', withExtra: 'With extra', current: 'Current plan', now: 'now',
      cats: { groceries: 'Groceries', dining: 'Dining out', transport: 'Transport', home: 'Home', health: 'Health', fun: 'Fun', supplies: 'Supplies', marketing: 'Marketing', travel: 'Travel', equipment: 'Equipment', meals: 'Client meals', training: 'Training' }
    },
    es: {
      back: 'Portafolio', badge: 'Demo · datos ficticios', 'mode.home': 'Hogar', 'mode.biz': 'Pequeño negocio', tour: 'Ver recorrido', reset: 'Reiniciar demo',
      't.ov': 'Este mes', 't.spend': 'Gastos', 't.goals': 'Metas', 't.debts': 'Deudas',
      'o.split': 'Quién paga qué', 'o.prop': 'Por ingreso', 'o.half': '50 / 50', 'o.fixed': 'Gastos fijos del mes', 'o.budgets': 'Presupuestos',
      's.title': 'Movimientos del mes', 's.add': 'Agregar un gasto', 's.what': '¿En qué fue?', 's.amount': 'Monto (MXN)', 's.cat': 'Categoría', 's.who': 'Pagó', 's.date': 'Fecha', 's.save': 'Agregar gasto',
      'd.note': 'Las proyecciones usan una tasa anual fija y pagos mensuales. Son estimaciones para planear, no asesoría financiera.',
      'title.home': 'Lía y Tomás', 'meta.home': 'Hogar · gastos compartidos en pareja', 'title.biz': 'Studio Norte', 'meta.biz': 'Pequeño negocio · dos socios que comparten costos',
      income: 'Ingreso', revenue: 'Ingresos generados', k1: 'Ingresos del mes', k1b: 'Ingresos del mes', k2: 'Gastado hasta hoy', k3: 'Disponible del mes', k4: 'Tasa de ahorro', k2s: '{p}% del ingreso', k3s: 'Después de fijos y gastos', k4s: 'Meta: 20%',
      propHint: 'Los gastos fijos se reparten según el ingreso de cada quien — justo cuando los ingresos son distintos.', halfHint: 'Los gastos fijos se reparten por igual entre los dos.',
      pays: 'paga {a} de los fijos', share: '{p}% del total',
      spentOf: '{s} de {l}', left: 'quedan {a}', over: '{a} excedido', allCats: 'Todas las categorías', noTx: 'Aún no hay movimientos en esta categoría.', paidBy: 'pagó {n}',
      eWhat: 'Describe el gasto.', eAmt: 'Escribe un monto mayor a cero.', eDate: 'Elige una fecha de este mes.', tAdded: 'Gasto agregado', tDel: 'Gasto eliminado', tGoal: '{a} abonados a {g}', tReset: 'Datos de la demo restaurados', tDone: '¡Meta cumplida!',
      saved: 'ahorrados de {t}', toGo: 'faltan {a}', reached: 'Meta cumplida',
      balance: 'Saldo', rate: 'Tasa anual', payment: 'Pago mensual', payoff: 'Se liquida en', months: '{n} meses', never: 'El pago es muy bajo para liquidarla', interest: 'Intereses totales',
      extra: 'Extra al mes', saveLine: 'Pagando {e} extra te ahorras {m} meses y {i} de intereses.', noExtra: 'Mueve la barra para ver el efecto de pagar un poco más.', withExtra: 'Con extra', current: 'Plan actual', now: 'hoy',
      cats: { groceries: 'Súper', dining: 'Comer fuera', transport: 'Transporte', home: 'Casa', health: 'Salud', fun: 'Diversión', supplies: 'Insumos', marketing: 'Marketing', travel: 'Viajes', equipment: 'Equipo', meals: 'Comidas con clientes', training: 'Capacitación' }
    }
  });
  var T = L.t;
  function catName(c) { return T('cats')[c] || c; }

  /* ---------- Dates & money ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var NOW = new Date(), TODAY = NOW.getFullYear() + '-' + pad(NOW.getMonth() + 1) + '-' + pad(NOW.getDate()), YM = TODAY.slice(0, 7);
  function loc() { return L.lang === 'es' ? 'es-MX' : 'en-US'; }
  function money(n) { try { return new Intl.NumberFormat(loc(), { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n || 0); } catch (e) { return '$' + Math.round(n); } }
  function fmtDay(s) { var p = s.split('-'); try { return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString(loc(), { day: 'numeric', month: 'short' }); } catch (e) { return s; } }

  /* ---------- Seed ---------- */
  var ES = { 'Rent': 'Renta', 'Electricity': 'Luz', 'Internet': 'Internet', 'Streaming': 'Streaming', 'Car insurance': 'Seguro del auto', 'Office rent': 'Renta de oficina', 'Software subscriptions': 'Suscripciones de software',
    'Accountant': 'Contador', 'Internet & phone': 'Internet y teléfono', 'Emergency fund': 'Fondo de emergencia', 'Trip to Oaxaca': 'Viaje a Oaxaca', 'New laptop': 'Laptop nueva', 'Equipment fund': 'Fondo para equipo',
    'Tax reserve': 'Reserva para impuestos', '3 months of runway': '3 meses de operación', 'Credit card': 'Tarjeta de crédito', 'Car loan': 'Crédito del auto', 'Equipment loan': 'Crédito de equipo', 'Business credit line': 'Línea de crédito',
    'Weekly groceries': 'Súper de la semana', 'Gas': 'Gasolina', 'Dinner with friends': 'Cena con amigos', 'Pharmacy': 'Farmacia', 'Cinema': 'Cine', 'Cleaning supplies': 'Artículos de limpieza', 'Market': 'Mercado',
    'Uber': 'Uber', 'Coffee': 'Café', 'Paper & ink': 'Papel y tinta', 'Social media ads': 'Anuncios en redes', 'Client lunch': 'Comida con cliente', 'Bus to Monterrey': 'Autobús a Monterrey', 'Online course': 'Curso en línea',
    'External drive': 'Disco externo', 'Printing samples': 'Impresión de muestras', 'Hotel': 'Hotel' };
  function tx(s) { return L.lang === 'es' && ES[s] ? ES[s] : s; }
  function seed() {
    var r = K.rng(2468), day = NOW.getDate();
    function txs(list) {
      var out = [];
      list.forEach(function (x, i) {
        var d = Math.max(1, Math.min(day, 1 + Math.floor(r() * day)));
        out.push({ id: 't' + i, date: YM + '-' + pad(d), what: x[0], amt: Math.round(x[1] * (0.85 + r() * 0.3)), cat: x[2], who: r() > 0.5 ? 'a' : 'b' });
      });
      return out.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    }
    return { v: 1, seq: 100, modes: {
      home: { split: 'prop', members: [{ id: 'a', name: 'Lía', income: 32000 }, { id: 'b', name: 'Tomás', income: 24000 }],
        fixed: [['Rent', 14500], ['Electricity', 900], ['Internet', 650], ['Streaming', 330], ['Car insurance', 1100]],
        budgets: { groceries: 7000, dining: 2500, transport: 2800, home: 1500, health: 1200, fun: 1800 },
        tx: txs([['Weekly groceries', 1650, 'groceries'], ['Weekly groceries', 1720, 'groceries'], ['Market', 640, 'groceries'], ['Weekly groceries', 1580, 'groceries'], ['Gas', 900, 'transport'], ['Gas', 850, 'transport'],
          ['Uber', 240, 'transport'], ['Dinner with friends', 1150, 'dining'], ['Coffee', 190, 'dining'], ['Coffee', 160, 'dining'], ['Pharmacy', 420, 'health'], ['Cinema', 380, 'fun'], ['Cleaning supplies', 530, 'home']]),
        goals: [{ id: 'g1', name: 'Emergency fund', target: 60000, saved: 38500 }, { id: 'g2', name: 'Trip to Oaxaca', target: 18000, saved: 7200 }, { id: 'g3', name: 'New laptop', target: 22000, saved: 4000 }],
        debts: [{ id: 'd1', name: 'Credit card', bal: 18500, apr: 42, pay: 2500 }, { id: 'd2', name: 'Car loan', bal: 96000, apr: 13.5, pay: 4200 }] },
      biz: { split: 'prop', members: [{ id: 'a', name: 'Marina', income: 68000 }, { id: 'b', name: 'Raúl', income: 52000 }],
        fixed: [['Office rent', 12000], ['Software subscriptions', 3400], ['Accountant', 2500], ['Internet & phone', 900]],
        budgets: { supplies: 3000, marketing: 6000, travel: 5000, equipment: 4000, meals: 2500, training: 2000 },
        tx: txs([['Paper & ink', 780, 'supplies'], ['Social media ads', 2500, 'marketing'], ['Social media ads', 1800, 'marketing'], ['Client lunch', 950, 'meals'], ['Client lunch', 720, 'meals'], ['Bus to Monterrey', 1400, 'travel'],
          ['Hotel', 2300, 'travel'], ['Online course', 1600, 'training'], ['External drive', 1900, 'equipment'], ['Printing samples', 650, 'supplies']]),
        goals: [{ id: 'g1', name: 'Tax reserve', target: 45000, saved: 31000 }, { id: 'g2', name: 'Equipment fund', target: 60000, saved: 18000 }, { id: 'g3', name: '3 months of runway', target: 150000, saved: 72000 }],
        debts: [{ id: 'd1', name: 'Equipment loan', bal: 120000, apr: 16, pay: 6500 }, { id: 'd2', name: 'Business credit line', bal: 35000, apr: 28, pay: 4000 }] }
    } };
  }
  function validate(d) {
    if (!d || d.v !== 1 || !d.modes || !d.modes.home || !d.modes.biz) return null;
    var base = seed();
    ['home', 'biz'].forEach(function (m) {
      var x = d.modes[m], b = base.modes[m];
      x.split = x.split === 'half' ? 'half' : 'prop';
      x.members = b.members; x.fixed = b.fixed; x.budgets = b.budgets; x.debts = b.debts;
      x.tx = (Array.isArray(x.tx) ? x.tx : []).filter(function (t) { return t && b.budgets[t.cat] && /^\d{4}-\d{2}-\d{2}$/.test(t.date) && t.date.slice(0, 7) === YM; }).slice(0, 300).map(function (t) {
        return { id: clean(t.id, 12), date: t.date, what: clean(t.what, 50), amt: Math.max(0, Math.min(1e6, +t.amt || 0)), cat: t.cat, who: t.who === 'b' ? 'b' : 'a' };
      });
      x.goals = b.goals.map(function (g) { var s = (x.goals || []).filter(function (y) { return y && y.id === g.id; })[0]; return { id: g.id, name: g.name, target: g.target, saved: s ? Math.max(0, Math.min(g.target, +s.saved || 0)) : g.saved }; });
    });
    d.seq = +d.seq || 500;
    return d;
  }
  var db = validate(STORE.load()) || seed();
  function save() { STORE.save(db); }

  var state = { mode: 'home', view: 'ov', fCat: '', extra: {} };
  function $(id) { return document.getElementById(id); }
  function M() { return db.modes[state.mode]; }
  function member(id) { return M().members.filter(function (m) { return m.id === id; })[0]; }
  function sumFixed() { return M().fixed.reduce(function (t, f) { return t + f[1]; }, 0); }
  function sumTx(cat) { return M().tx.filter(function (t) { return !cat || t.cat === cat; }).reduce(function (s, t) { return s + t.amt; }, 0); }
  function income() { return M().members.reduce(function (t, m) { return t + m.income; }, 0); }

  function renderHeader() {
    $('title').textContent = T('title.' + state.mode); $('meta').textContent = T('meta.' + state.mode);
    document.querySelectorAll('#modeSeg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-mode') === state.mode); });
    document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-view') === state.view); });
    document.querySelectorAll('.view').forEach(function (v) { v.classList.toggle('on', v.id === 'view-' + state.view); });
    document.querySelectorAll('#splitSeg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-split') === M().split); });
  }

  /* ---------- Overview ---------- */
  function renderOv() {
    var inc = income(), spent = sumFixed() + sumTx(), left = inc - spent;
    var k = $('kpis'); clear(k);
    [[state.mode === 'biz' ? T('k1b') : T('k1'), money(inc), M().members.map(function (m) { return m.name + ' ' + money(m.income); }).join(' · '), ''],
     [T('k2'), money(spent), T('k2s', { p: Math.round(spent / inc * 100) }), ''],
     [T('k3'), money(left), T('k3s'), left < 0 ? 'alert' : ''],
     [T('k4'), Math.max(0, Math.round(left / inc * 100)) + '%', T('k4s'), left / inc < 0.2 ? 'alert' : '']].forEach(function (x) {
      k.appendChild(h('div', { class: 'kpi ' + x[3] }, [h('span', { text: x[0] }), h('b', { text: x[1] }), h('small', { text: x[2] })]));
    });
    var fx = sumFixed(), ms = $('members'); clear(ms);
    $('splitHint').textContent = M().split === 'prop' ? T('propHint') : T('halfHint');
    var shares = M().members.map(function (m) { return M().split === 'prop' ? m.income / inc : 0.5; });
    M().members.forEach(function (m, i) {
      ms.appendChild(h('div', { class: 'member' }, [
        h('div', { class: 'row' }, [h('span', { class: 'av ' + m.id, text: m.name[0] }), h('div', null, [h('b', { text: m.name }), h('small', { text: (state.mode === 'biz' ? T('revenue') : T('income')) + ' ' + money(m.income) })])]),
        h('div', { class: 'big', text: money(fx * shares[i]) }), h('span', { class: 'pct', text: T('share', { p: Math.round(shares[i] * 100) }) })]));
    });
    var bar = h('div', { class: 'splitbar' });
    M().members.forEach(function (m, i) { var seg = h('i', { class: m.id }); seg.style.width = (shares[i] * 100) + '%'; bar.appendChild(seg); });
    ms.appendChild(bar); bar.style.gridColumn = '1 / -1';
    var fl = $('fixed'); clear(fl);
    M().fixed.forEach(function (f) { fl.appendChild(h('div', { class: 'li' }, [h('span', { text: tx(f[0]) }), h('b', { text: money(f[1]) })])); });
    fl.appendChild(h('div', { class: 'li' }, [h('b', { text: 'Total' }), h('b', { text: money(fx) })]));
    var bd = $('budgets'); clear(bd);
    Object.keys(M().budgets).forEach(function (c) {
      var lim = M().budgets[c], sp = sumTx(c), frac = sp / lim, cls = frac > 1 ? 'over' : frac > 0.8 ? 'warn' : '';
      var fill = h('i'); fill.style.width = Math.min(100, frac * 100) + '%';
      bd.appendChild(h('div', { class: 'bud ' + cls }, [h('div', { class: 'row-between' }, [h('b', { text: catName(c) }), h('small', { text: T('spentOf', { s: money(sp), l: money(lim) }) })]),
        h('span', { class: 'track' }, [fill]), h('small', { class: 'st', text: frac > 1 ? T('over', { a: money(sp - lim) }) : T('left', { a: money(lim - sp) }) })]));
    });
  }

  /* ---------- Spending ---------- */
  function fillSelects() {
    var f = $('fCat'), c = $('iCat'), w = $('iWho'); clear(f); clear(c); clear(w);
    f.appendChild(h('option', { value: '', text: T('allCats') }));
    Object.keys(M().budgets).forEach(function (k) { f.appendChild(h('option', { value: k, text: catName(k) })); c.appendChild(h('option', { value: k, text: catName(k) })); });
    f.value = state.fCat;
    M().members.forEach(function (m) { w.appendChild(h('option', { value: m.id, text: m.name })); });
    $('iDate').value = TODAY; $('iDate').min = YM + '-01'; $('iDate').max = TODAY;
  }
  function renderSpend() {
    fillSelects();
    var box = $('tx'); clear(box);
    var list = M().tx.filter(function (t) { return !state.fCat || t.cat === state.fCat; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    if (!list.length) box.appendChild(h('p', { class: 'muted', text: T('noTx') }));
    list.forEach(function (t) {
      box.appendChild(h('div', { class: 'tx' }, [h('span', { class: 'cat-dot', text: catName(t.cat).slice(0, 2) }),
        h('div', null, [h('b', { text: tx(t.what) }), h('small', { text: catName(t.cat) + ' · ' + fmtDay(t.date) + ' · ' + T('paidBy', { n: member(t.who).name }) })]),
        h('span', { class: 'amt', text: money(t.amt) }),
        h('button', { type: 'button', class: 'rm', 'aria-label': 'Remove', text: '×', onclick: function () { M().tx = M().tx.filter(function (x) { return x !== t; }); save(); K.toast(T('tDel')); renderSpend(); } })]));
    });
  }
  function addTx() {
    var what = clean($('iWhat').value, 50), amt = Math.round((+$('iAmt').value || 0) * 100) / 100, date = $('iDate').value, cat = $('iCat').value, who = $('iWho').value === 'b' ? 'b' : 'a';
    if (what.length < 2) { $('addErr').textContent = T('eWhat'); return; }
    if (!(amt > 0) || amt > 1e6) { $('addErr').textContent = T('eAmt'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date.slice(0, 7) !== YM || date > TODAY) { $('addErr').textContent = T('eDate'); return; }
    if (!M().budgets[cat]) return;
    db.seq++; M().tx.push({ id: 't' + db.seq, date: date, what: what, amt: amt, cat: cat, who: who }); save();
    $('iWhat').value = ''; $('iAmt').value = ''; $('addErr').textContent = ''; K.toast(T('tAdded')); renderSpend(); $('iWhat').focus();
  }

  /* ---------- Goals ---------- */
  function ring(frac) {
    var r = 36, c = 2 * Math.PI * r, g = document.createElementNS(SVGNS, 'svg');
    g.setAttribute('viewBox', '0 0 84 84'); g.setAttribute('class', 'ring');
    function el(tag, a) { var e = document.createElementNS(SVGNS, tag); Object.keys(a).forEach(function (k) { e.setAttribute(k, a[k]); }); return e; }
    g.appendChild(el('circle', { cx: 42, cy: 42, r: r, class: 'bg' }));
    g.appendChild(el('circle', { cx: 42, cy: 42, r: r, class: 'fg', 'stroke-dasharray': c, 'stroke-dashoffset': c * (1 - frac), transform: 'rotate(-90 42 42)' }));
    var t = el('text', { x: 42, y: 48, 'text-anchor': 'middle' }); t.textContent = Math.round(frac * 100) + '%'; g.appendChild(t);
    return g;
  }
  function renderGoals() {
    var box = $('goals'); clear(box);
    M().goals.forEach(function (g) {
      var frac = Math.min(1, g.saved / g.target), done = frac >= 1;
      var c = h('div', { class: 'contrib' });
      [500, 1000, 2000].forEach(function (a) {
        var b = h('button', { type: 'button', class: 'btn ghost sm', text: '+ ' + money(a), onclick: function () {
          g.saved = Math.min(g.target, g.saved + a); save(); K.toast(g.saved >= g.target ? T('tDone') : T('tGoal', { a: money(a), g: tx(g.name) })); renderGoals();
        } });
        if (done) b.disabled = true; c.appendChild(b);
      });
      box.appendChild(h('article', { class: 'goal' }, [h('h3', { text: tx(g.name) }),
        h('div', { class: 'ring-row' }, [ring(frac), h('div', { class: 'nums' }, [h('b', { text: money(g.saved) }), h('small', { text: T('saved', { t: money(g.target) }) }), h('br'),
          h('span', { class: 'pill ' + (done ? 'ok' : 'acc'), text: done ? T('reached') : T('toGo', { a: money(g.target - g.saved) }) })])]), c]));
    });
  }

  /* ---------- Debts ---------- */
  function project(bal, apr, pay) {
    var r = apr / 1200, pts = [bal], interest = 0, n = 0;
    while (bal > 0.5 && n < 600) { var i = bal * r; interest += i; bal = bal + i - pay; n++; if (n === 1 && bal >= pts[0]) return { n: Infinity, interest: Infinity, pts: pts }; pts.push(Math.max(0, bal)); }
    return { n: n >= 600 ? Infinity : n, interest: interest, pts: pts };
  }
  function spark(a, b, bal) {
    var W = 300, H = 110, P = 14, max = Math.max(a.pts.length, b.pts.length) - 1 || 1;
    var g = document.createElementNS(SVGNS, 'svg'); g.setAttribute('viewBox', '0 0 ' + W + ' ' + H); g.setAttribute('class', 'spark'); g.setAttribute('preserveAspectRatio', 'none');
    function line(pts, cls) {
      var d = pts.map(function (v, i) { return (P + i / max * (W - 2 * P)).toFixed(1) + ',' + (P + (1 - v / bal) * (H - 2 * P)).toFixed(1); }).join(' ');
      var pl = document.createElementNS(SVGNS, 'polyline'); pl.setAttribute('points', d); pl.setAttribute('class', cls); g.appendChild(pl);
    }
    line(a.pts, 'base'); if (b !== a) line(b.pts, 'extra');
    return g;
  }
  function renderDebts() {
    var box = $('debts'); clear(box);
    M().debts.forEach(function (d) {
      var key = state.mode + d.id;
      var payoffB = h('b'), intB = h('b'), sparkBox = h('div'), lbl = h('b'), msg = h('p');
      var slider = h('input', { type: 'range', min: '0', max: String(Math.max(2000, Math.round(d.pay / 500) * 500)), step: '250', value: String(state.extra[key] || 0), 'aria-label': T('extra') });
      function update() {
        var extra = +slider.value; state.extra[key] = extra;
        var base = project(d.bal, d.apr, d.pay), withX = extra ? project(d.bal, d.apr, d.pay + extra) : base;
        payoffB.textContent = isFinite(withX.n) ? T('months', { n: withX.n }) : T('never');
        intB.textContent = isFinite(withX.interest) ? money(withX.interest) : '—';
        lbl.textContent = money(extra);
        clear(sparkBox); sparkBox.appendChild(spark(base, withX, d.bal));
        msg.className = extra ? 'save-line' : 'muted small';
        msg.textContent = extra && isFinite(base.n) ? T('saveLine', { e: money(extra), m: base.n - withX.n, i: money(base.interest - withX.interest) }) : T('noExtra');
      }
      slider.addEventListener('input', update);
      var lgA = h('i'), lgB = h('i'); lgA.style.background = '#9aa0a6'; lgB.style.background = '#9c7a2c';
      box.appendChild(h('article', { class: 'debt' }, [h('h3', { text: tx(d.name) }),
        h('div', { class: 'facts' }, [h('div', null, [h('span', { text: T('balance') }), h('b', { text: money(d.bal) })]), h('div', null, [h('span', { text: T('rate') }), h('b', { text: d.apr + '%' })]),
          h('div', null, [h('span', { text: T('payment') }), h('b', { text: money(d.pay) })]), h('div', null, [h('span', { text: T('payoff') }), payoffB]),
          h('div', null, [h('span', { text: T('interest') }), intB])]),
        sparkBox,
        h('div', { class: 'legend-s' }, [h('span', null, [lgA, T('current')]), h('span', null, [lgB, T('withExtra')])]),
        h('div', { class: 'extra-row' }, [h('span', { text: T('extra') }), slider, lbl]), msg]));
      update();
    });
  }

  function renderAll() {
    renderHeader();
    if (state.view === 'ov') renderOv();
    if (state.view === 'spend') renderSpend();
    if (state.view === 'goals') renderGoals();
    if (state.view === 'debts') renderDebts();
  }

  document.querySelectorAll('#modeSeg button').forEach(function (b) { b.addEventListener('click', function () { state.mode = b.getAttribute('data-mode'); state.fCat = ''; renderAll(); }); });
  document.querySelectorAll('#tabs button').forEach(function (b) { b.addEventListener('click', function () { state.view = b.getAttribute('data-view'); renderAll(); }); });
  document.querySelectorAll('#splitSeg button').forEach(function (b) { b.addEventListener('click', function () { M().split = b.getAttribute('data-split') === 'half' ? 'half' : 'prop'; save(); renderAll(); }); });
  $('fCat').addEventListener('change', function () { state.fCat = this.value; renderSpend(); });
  $('addBtn').addEventListener('click', addTx);
  $('resetBtn').addEventListener('click', function () { STORE.clear(); db = seed(); save(); state.extra = {}; K.toast(T('tReset')); renderAll(); });

  function go(v) { return function () { if (state.view !== v) { state.view = v; renderAll(); } }; }
  var tour = new K.Tour({
    key: 'hearth', lang: function () { return L.lang; },
    steps: [
      { target: null, title: { en: 'Welcome to Hearth', es: 'Bienvenido a Hearth' },
        body: { en: 'Shared money, made clear — for a couple sharing a home or two partners sharing a business. Everything is fictional.', es: 'El dinero compartido, claro — para una pareja que comparte casa o dos socios que comparten negocio. Todo es ficticio.' } },
      { target: '#kpis', before: go('ov'), title: { en: 'The month at a glance', es: 'El mes de un vistazo' },
        body: { en: 'Income, what has been spent, what is left and the saving rate against a 20% target.', es: 'Ingresos, lo gastado, lo disponible y la tasa de ahorro contra una meta de 20%.' } },
      { target: '#splitPanel', before: go('ov'), title: { en: 'A fair split', es: 'Un reparto justo' },
        body: { en: 'Split fixed bills by income or 50/50 and see exactly how much each person pays.', es: 'Reparte los gastos fijos por ingreso o 50/50 y ve exactamente cuánto paga cada quien.' } },
      { target: '#budgetPanel', before: go('ov'), title: { en: 'Budgets that warn you', es: 'Presupuestos que avisan' },
        body: { en: 'Each category turns yellow near its limit and red when it goes over.', es: 'Cada categoría se pone amarilla cerca del límite y roja cuando se pasa.' } },
      { target: '#addPanel', before: go('spend'), title: { en: 'Log spending in seconds', es: 'Registra gastos en segundos' },
        body: { en: 'Add an expense, choose who paid and watch the budgets update.', es: 'Agrega un gasto, elige quién pagó y mira cómo se actualizan los presupuestos.' } },
      { target: '#tabs', before: go('spend'), title: { en: 'Goals and debts', es: 'Metas y deudas' },
        body: { en: 'Contribute to savings goals and, in Debts, slide an extra monthly payment to see how many months and how much interest you save.', es: 'Abona a tus metas de ahorro y, en Deudas, mueve un pago extra mensual para ver cuántos meses e intereses te ahorras.' } },
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
