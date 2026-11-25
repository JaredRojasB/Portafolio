/* Mercato — e-commerce demo (storefront + owner dashboard).
   Portfolio mockup: fictional shop and products; no payment is processed and no card data is ever requested.
   Security: user text written with textContent only and sanitized before storage; stored data validated on load. */
(function () {
  'use strict';
  var K = window.DemoKit, h = K.h, clear = K.clear, clean = K.clean;
  var STORE = K.store('mercato.demo.v1');
  var SVGNS = 'http://www.w3.org/2000/svg';

  var L = new K.I18n({
    en: {
      back: 'Portfolio', badge: 'Demo · no real purchases', 'mode.shop': 'Storefront', 'mode.admin': 'Owner dashboard', tour: 'Take the tour',
      'hs.kicker': 'Plant shop · Guadalajara', 'hs.title': 'Bring the garden home.', 'hs.sub': 'Indoor plants, herbs, pots and everything to care for them. Free delivery on orders over $999.',
      'hs.coupon': 'Try coupon DEMO10 for 10% off', 's.search': 'Search plants, pots, tools…', 'sort.pop': 'Most popular', 'sort.low': 'Price: low to high', 'sort.high': 'Price: high to low', 'sort.name': 'Name',
      'a.title': 'Store dashboard', 'a.sub': 'Orders placed in the storefront appear here instantly.', 't.ov': 'Overview', 't.orders': 'Orders', 't.stock': 'Inventory',
      'a.week': 'Sales, last 7 days', 'a.top': 'Best sellers', 'c.order': 'Order', 'c.customer': 'Customer', 'c.items': 'Items', 'c.delivery': 'Delivery', 'c.total': 'Total', 'c.status': 'Status',
      'inv.title': 'Inventory', 'inv.hint': 'Stock below 5 units is flagged. Changes show in the storefront immediately.', 'c.product': 'Product', 'c.cat': 'Category', 'c.price': 'Price', 'c.stock': 'Stock', 'c.sold': 'Sold',
      add: 'Add to cart', 'cart.title': 'Your cart', 'cart.coupon': 'Coupon code', 'cart.apply': 'Apply', 'cart.checkout': 'Checkout',
      'co.title': 'Checkout', 'co.note': 'This is a demo: no payment is processed and no card details are ever requested.', 'co.name': 'Full name', 'co.email': 'Email', 'co.delivery': 'Delivery',
      'co.ship': 'Home delivery', 'co.pickup': 'Pick up in store (free)', 'co.addr': 'Address', 'co.pay': 'Payment method', 'co.card': 'Card (simulated)', 'co.transfer': 'Bank transfer', 'co.cod': 'Pay on delivery',
      'co.place': 'Place order', cancel: 'Cancel', 'ok.admin': 'See it in the dashboard', 'ok.keep': 'Keep shopping',
      cats: { all: 'All', indoor: 'Indoor plants', herbs: 'Herbs & outdoor', pots: 'Pots', care: 'Care & tools' },
      inStock: '{n} in stock', low: 'Only {n} left', out: 'Sold out', best: 'Best seller', added: 'Added to cart', noResults: 'Nothing matches your search.',
      emptyCart: 'Your cart is empty.', subtotal: 'Subtotal', discount: 'Coupon DEMO10', shipping: 'Shipping', free: 'Free', total: 'Total', freeHint: 'Add {a} more for free delivery',
      couponOk: 'Coupon applied: 10% off.', couponBad: 'That coupon is not valid. Try DEMO10.', remove: 'Remove', maxStock: 'No more stock available',
      eName: 'Enter your full name.', eEmail: 'Enter a valid email.', eAddr: 'Enter a delivery address.', eStock: 'Some items are no longer available in that quantity.',
      okTitle: 'Order {n} confirmed', okBody: 'Thanks, {c}! This is a demo, so nothing will be charged or shipped.',
      light: 'Light', water: 'Water', size: 'Size', care: 'Care', lightLow: 'Low to medium', lightBright: 'Bright, indirect', lightSun: 'Full sun', waterLow: 'Every 2–3 weeks', waterMid: 'Weekly', waterHigh: 'Twice a week',
      easy: 'Easy', medium: 'Medium',
      'st.all': 'All', 'st.new': 'New', 'st.packed': 'Packed', 'st.shipped': 'Shipped', 'st.delivered': 'Delivered', 'nx.new': 'Pack', 'nx.packed': 'Ship', 'nx.shipped': 'Deliver',
      pickup: 'Pickup', ship: 'Delivery', k1: 'Sales today', k2: 'Orders this week', k3: 'Average ticket', k4: 'Low stock', k1s: '{n} orders', k2s: '{n} still to ship', k3s: 'Last 7 days', k4s: 'Products under 5 units',
      tStatus: '{n}: {s}', tStock: 'Stock updated', units: '{n} units', items: '{n} items', reset: 'Reset demo', tReset: 'Demo data restored', noOrders: 'No orders here.'
    },
    es: {
      back: 'Portafolio', badge: 'Demo · sin compras reales', 'mode.shop': 'Tienda', 'mode.admin': 'Panel del dueño', tour: 'Ver recorrido',
      'hs.kicker': 'Vivero · Guadalajara', 'hs.title': 'Lleva el jardín a casa.', 'hs.sub': 'Plantas de interior, hierbas, macetas y todo para cuidarlas. Envío gratis en compras mayores a $999.',
      'hs.coupon': 'Prueba el cupón DEMO10 con 10% de descuento', 's.search': 'Busca plantas, macetas, herramientas…', 'sort.pop': 'Más populares', 'sort.low': 'Precio: menor a mayor', 'sort.high': 'Precio: mayor a menor', 'sort.name': 'Nombre',
      'a.title': 'Panel de la tienda', 'a.sub': 'Los pedidos hechos en la tienda aparecen aquí al instante.', 't.ov': 'Resumen', 't.orders': 'Pedidos', 't.stock': 'Inventario',
      'a.week': 'Ventas de los últimos 7 días', 'a.top': 'Más vendidos', 'c.order': 'Pedido', 'c.customer': 'Cliente', 'c.items': 'Artículos', 'c.delivery': 'Entrega', 'c.total': 'Total', 'c.status': 'Estado',
      'inv.title': 'Inventario', 'inv.hint': 'Se marca el inventario menor a 5 piezas. Los cambios se ven en la tienda al instante.', 'c.product': 'Producto', 'c.cat': 'Categoría', 'c.price': 'Precio', 'c.stock': 'Existencias', 'c.sold': 'Vendidos',
      add: 'Agregar al carrito', 'cart.title': 'Tu carrito', 'cart.coupon': 'Código de cupón', 'cart.apply': 'Aplicar', 'cart.checkout': 'Pagar',
      'co.title': 'Finalizar compra', 'co.note': 'Es una demo: no se procesa ningún pago y nunca se piden datos de tarjeta.', 'co.name': 'Nombre completo', 'co.email': 'Correo', 'co.delivery': 'Entrega',
      'co.ship': 'Envío a domicilio', 'co.pickup': 'Recoger en tienda (gratis)', 'co.addr': 'Dirección', 'co.pay': 'Forma de pago', 'co.card': 'Tarjeta (simulado)', 'co.transfer': 'Transferencia', 'co.cod': 'Pago contra entrega',
      'co.place': 'Confirmar pedido', cancel: 'Cancelar', 'ok.admin': 'Verlo en el panel', 'ok.keep': 'Seguir comprando',
      cats: { all: 'Todo', indoor: 'Plantas de interior', herbs: 'Hierbas y exterior', pots: 'Macetas', care: 'Cuidado y herramientas' },
      inStock: '{n} disponibles', low: 'Solo quedan {n}', out: 'Agotado', best: 'Más vendido', added: 'Agregado al carrito', noResults: 'Nada coincide con tu búsqueda.',
      emptyCart: 'Tu carrito está vacío.', subtotal: 'Subtotal', discount: 'Cupón DEMO10', shipping: 'Envío', free: 'Gratis', total: 'Total', freeHint: 'Agrega {a} más para envío gratis',
      couponOk: 'Cupón aplicado: 10% de descuento.', couponBad: 'Ese cupón no es válido. Prueba DEMO10.', remove: 'Quitar', maxStock: 'No hay más existencias',
      eName: 'Escribe tu nombre completo.', eEmail: 'Escribe un correo válido.', eAddr: 'Escribe la dirección de entrega.', eStock: 'Algunos artículos ya no están disponibles en esa cantidad.',
      okTitle: 'Pedido {n} confirmado', okBody: '¡Gracias, {c}! Es una demo, así que no se cobrará ni se enviará nada.',
      light: 'Luz', water: 'Riego', size: 'Tamaño', care: 'Cuidado', lightLow: 'Baja a media', lightBright: 'Brillante e indirecta', lightSun: 'Sol directo', waterLow: 'Cada 2–3 semanas', waterMid: 'Semanal', waterHigh: 'Dos veces por semana',
      easy: 'Fácil', medium: 'Media',
      'st.all': 'Todos', 'st.new': 'Nuevo', 'st.packed': 'Empacado', 'st.shipped': 'Enviado', 'st.delivered': 'Entregado', 'nx.new': 'Empacar', 'nx.packed': 'Enviar', 'nx.shipped': 'Entregar',
      pickup: 'Recoge', ship: 'Envío', k1: 'Ventas de hoy', k2: 'Pedidos de la semana', k3: 'Ticket promedio', k4: 'Inventario bajo', k1s: '{n} pedidos', k2s: '{n} por enviar', k3s: 'Últimos 7 días', k4s: 'Productos con menos de 5',
      tStatus: '{n}: {s}', tStock: 'Inventario actualizado', units: '{n} piezas', items: '{n} artículos', reset: 'Reiniciar demo', tReset: 'Datos de la demo restaurados', noOrders: 'No hay pedidos aquí.'
    }
  });
  var T = L.t;

  /* ---------- Catalog: id, en, es, cat, price, art, colors[bg, pot, leaf], light, water, care, size ---------- */
  var P = [
    ['monstera', 'Monstera deliciosa', 'Monstera deliciosa', 'indoor', 649, 'leafy', ['#eaf1e7', '#d9d4cc', '#3f7d4f'], 'lightBright', 'waterMid', 'easy', '60 cm', 'A sculptural classic with split leaves that grows fast in bright rooms.', 'Un clásico escultural de hojas abiertas que crece rápido en espacios luminosos.'],
    ['pothos', 'Golden pothos', 'Pothos dorado', 'indoor', 249, 'trail', ['#eef2e4', '#f1ede6', '#6e9b3c'], 'lightLow', 'waterMid', 'easy', '25 cm', 'Trailing and forgiving — perfect for shelves and first‑time plant owners.', 'Colgante y noble — ideal para repisas y para quien empieza con plantas.'],
    ['snake', 'Snake plant', 'Lengua de suegra', 'indoor', 329, 'tall', ['#eef0ea', '#2f3a36', '#4f7a55'], 'lightLow', 'waterLow', 'easy', '45 cm', 'Upright leaves, very little water and happy almost anywhere.', 'Hojas verticales, muy poco riego y feliz casi en cualquier lugar.'],
    ['fig', 'Fiddle leaf fig', 'Ficus lyrata', 'indoor', 890, 'tree', ['#eaf0e8', '#e6dccd', '#2f6b45'], 'lightBright', 'waterMid', 'medium', '90 cm', 'A statement tree with large violin‑shaped leaves for bright corners.', 'Un árbol protagonista de hojas grandes en forma de violín para esquinas luminosas.'],
    ['lily', 'Peace lily', 'Cuna de Moisés', 'indoor', 389, 'flower', ['#eef1ee', '#ffffff', '#3d7a52'], 'lightLow', 'waterHigh', 'easy', '40 cm', 'Glossy leaves and white blooms; it droops to tell you when it is thirsty.', 'Hojas brillantes y flores blancas; se agacha para avisarte que tiene sed.'],
    ['zz', 'ZZ plant', 'Zamioculca', 'indoor', 459, 'tall', ['#ecf0e6', '#d6cfc4', '#2c6a3a'], 'lightLow', 'waterLow', 'easy', '50 cm', 'Almost indestructible, with glossy leaves that thrive on neglect.', 'Casi indestructible, de hojas brillantes que prosperan con poco cuidado.'],
    ['succ', 'Succulent trio', 'Trío de suculentas', 'indoor', 279, 'succ', ['#f2efe9', '#c9a27a', '#7aa37a'], 'lightSun', 'waterLow', 'easy', '3 × 8 cm', 'Three small succulents in terracotta, made for sunny windowsills.', 'Tres suculentas pequeñas en barro, hechas para ventanas soleadas.'],
    ['cactus', 'Golden barrel cactus', 'Biznaga dorada', 'indoor', 199, 'cactus', ['#f3efe6', '#c48a5a', '#5f8f4e'], 'lightSun', 'waterLow', 'easy', '15 cm', 'A round Mexican native with golden spines.', 'Una biznaga mexicana redonda de espinas doradas.'],
    ['lavender', 'Lavender', 'Lavanda', 'herbs', 159, 'lav', ['#efecf4', '#c9a27a', '#6f8f5f'], 'lightSun', 'waterMid', 'easy', '30 cm', 'Fragrant purple spikes for balconies and gardens.', 'Espigas moradas y aromáticas para balcones y jardines.'],
    ['rosemary', 'Rosemary', 'Romero', 'herbs', 119, 'herb', ['#edf1ea', '#c9a27a', '#4e7a52'], 'lightSun', 'waterMid', 'easy', '25 cm', 'Kitchen herb with needle leaves and a woody scent.', 'Hierba de cocina de hojas finas y aroma amaderado.'],
    ['basil', 'Basil', 'Albahaca', 'herbs', 89, 'herb', ['#eef3e7', '#c9a27a', '#5c9a3f'], 'lightSun', 'waterHigh', 'easy', '20 cm', 'Sweet basil for pasta, pesto and salads.', 'Albahaca dulce para pastas, pesto y ensaladas.'],
    ['potS', 'Ceramic pot · small', 'Maceta de cerámica · chica', 'pots', 179, 'pot', ['#eeece7', '#fbfaf7', '#000'], '', '', '', '12 cm', 'Matte glazed ceramic with drainage hole and saucer.', 'Cerámica mate con orificio de drenaje y plato.'],
    ['potL', 'Ceramic pot · large', 'Maceta de cerámica · grande', 'pots', 449, 'pot', ['#eceae6', '#2f3a36', '#000'], '', '', '', '28 cm', 'A large charcoal planter for floor plants.', 'Maceta grande color carbón para plantas de piso.'],
    ['terra', 'Terracotta set (3)', 'Juego de barro (3)', 'pots', 239, 'pot', ['#f5ede4', '#c4774f', '#000'], '', '', '', '10/14/18 cm', 'Handmade clay pots that let roots breathe.', 'Macetas de barro hechas a mano que dejan respirar la raíz.'],
    ['soil', 'Potting mix 10 L', 'Sustrato 10 L', 'care', 129, 'bag', ['#efebe5', '#6b5440', '#000'], '', '', '', '10 L', 'Airy mix with coco fiber and perlite for indoor plants.', 'Mezcla aireada con fibra de coco y perlita para plantas de interior.'],
    ['fert', 'Liquid fertilizer', 'Fertilizante líquido', 'care', 149, 'bottle', ['#ecf1ea', '#3f7d4f', '#000'], '', '', '', '500 ml', 'Gentle monthly feed for leafy and flowering plants.', 'Nutrición suave mensual para plantas de hoja y de flor.'],
    ['can', 'Watering can', 'Regadera', 'care', 299, 'can', ['#eef0f2', '#4b3d66', '#000'], '', '', '', '1.5 L', 'Long thin spout to water precisely without spills.', 'Pico largo y delgado para regar con precisión sin derrames.'],
    ['shears', 'Pruning shears', 'Tijeras de poda', 'care', 259, 'shears', ['#f1efec', '#1c1c1e', '#000'], '', '', '', '20 cm', 'Sharp steel blades for clean cuts on stems and herbs.', 'Navajas de acero afiladas para cortes limpios en tallos y hierbas.']
  ];
  var BY = {}; P.forEach(function (p) { BY[p[0]] = p; });
  function pName(p) { return L.lang === 'es' ? p[2] : p[1]; }
  function pDesc(p) { return L.lang === 'es' ? p[13] : p[12]; }

  /* ---------- Illustrations ---------- */
  function s(tag, a) { var e = document.createElementNS(SVGNS, tag); Object.keys(a).forEach(function (k) { e.setAttribute(k, a[k]); }); return e; }
  function art(p) {
    var kind = p[5], c = p[6], g = s('svg', { viewBox: '0 0 100 100', 'aria-hidden': 'true' });
    function pot(big) {
      if (big) { g.appendChild(s('rect', { x: 24, y: 40, width: 52, height: 8, rx: 3, fill: c[1], stroke: 'rgba(0,0,0,.12)' })); g.appendChild(s('path', { d: 'M28 48 H72 L66 90 H34 Z', fill: c[1], stroke: 'rgba(0,0,0,.12)' })); g.appendChild(s('path', { d: 'M30 56 H70', stroke: 'rgba(0,0,0,.08)', 'stroke-width': 3 })); return; }
      g.appendChild(s('rect', { x: 30, y: 60, width: 40, height: 7, rx: 2, fill: c[1], stroke: 'rgba(0,0,0,.08)' }));
      g.appendChild(s('path', { d: 'M33 67 H67 L62 92 H38 Z', fill: c[1], stroke: 'rgba(0,0,0,.08)' }));
    }
    function leaf(cx, cy, rx, ry, rot, col) { g.appendChild(s('ellipse', { cx: cx, cy: cy, rx: rx, ry: ry, transform: 'rotate(' + rot + ' ' + cx + ' ' + cy + ')', fill: col || c[2] })); }
    if (kind === 'leafy') { [[36, 38, 14, 9, -35], [62, 34, 15, 10, 30], [50, 24, 12, 9, 0], [40, 50, 12, 7, -15], [60, 50, 12, 7, 20]].forEach(function (l) { leaf.apply(null, l); }); g.appendChild(s('path', { d: 'M50 26 V60 M38 40 L50 58 M62 36 L50 58', stroke: '#2e5e3b', 'stroke-width': 1.5, fill: 'none' })); pot(); }
    else if (kind === 'trail') { pot(); [[38, 56, 6, 4, -20], [30, 64, 5, 3.5, -40], [26, 74, 5, 3.5, -60], [62, 56, 6, 4, 20], [70, 64, 5, 3.5, 40], [74, 74, 5, 3.5, 60], [50, 52, 6, 4, 0], [44, 48, 5, 4, -10], [56, 48, 5, 4, 10]].forEach(function (l) { leaf.apply(null, l); }); }
    else if (kind === 'tall') { [[42, 36, 4, 22, -8], [50, 30, 4.5, 28, 0], [58, 36, 4, 22, 8], [46, 42, 3.5, 16, -16], [54, 42, 3.5, 16, 16]].forEach(function (l) { leaf.apply(null, l); }); pot(); }
    else if (kind === 'tree') { g.appendChild(s('path', { d: 'M50 62 V30', stroke: '#6b5440', 'stroke-width': 3 })); [[50, 18, 9, 11, 0], [40, 26, 8, 10, -30], [60, 26, 8, 10, 30], [42, 38, 7, 9, -40], [58, 38, 7, 9, 40], [50, 34, 7, 9, 0]].forEach(function (l) { leaf.apply(null, l); }); pot(); }
    else if (kind === 'flower') { [[40, 44, 6, 16, -20], [60, 44, 6, 16, 20], [50, 42, 6, 18, 0]].forEach(function (l) { leaf.apply(null, l); }); g.appendChild(s('path', { d: 'M54 40 Q56 24 58 20', stroke: '#3d7a52', 'stroke-width': 1.5, fill: 'none' })); leaf(58, 18, 4, 7, 15, '#fff'); g.appendChild(s('ellipse', { cx: 58, cy: 18, rx: 4, ry: 7, transform: 'rotate(15 58 18)', fill: 'none', stroke: '#c8d6c8' })); pot(); }
    else if (kind === 'succ') { [[30, 0], [50, 0], [70, 0]].forEach(function (q) { var x = q[0]; g.appendChild(s('path', { d: 'M' + (x - 10) + ' 66 H' + (x + 10) + ' L' + (x + 8) + ' 86 H' + (x - 8) + ' Z', fill: c[1] })); for (var a = 0; a < 6; a++) leaf(x + Math.cos(a) * 4, 58 + Math.sin(a) * 2, 3, 6, a * 60, c[2]); }); }
    else if (kind === 'cactus') { g.appendChild(s('ellipse', { cx: 50, cy: 50, rx: 16, ry: 15, fill: c[2] })); for (var i = -2; i <= 2; i++) g.appendChild(s('path', { d: 'M' + (50 + i * 6) + ' 37 Q' + (50 + i * 7) + ' 50 ' + (50 + i * 6) + ' 63', stroke: '#d9b44a', 'stroke-width': 1, fill: 'none' })); pot(); }
    else if (kind === 'lav') { for (var k = 0; k < 5; k++) { var x = 38 + k * 6; g.appendChild(s('path', { d: 'M' + x + ' 62 V' + (30 + (k % 2) * 6), stroke: c[2], 'stroke-width': 1.5 })); for (var j = 0; j < 4; j++) leaf(x, 28 + (k % 2) * 6 + j * 4, 2, 2.6, 0, '#8b6fb3'); } pot(); }
    else if (kind === 'herb') { for (var m = 0; m < 14; m++) leaf(36 + (m * 7) % 28, 36 + Math.floor(m / 4) * 7, 3.5, 2.4, (m * 37) % 180, c[2]); pot(); }
    else if (kind === 'pot') { pot(true); }
    else if (kind === 'bag') { g.appendChild(s('path', { d: 'M30 24 H70 L74 88 H26 Z', fill: c[1] })); g.appendChild(s('rect', { x: 36, y: 42, width: 28, height: 22, rx: 3, fill: '#efe6d8' })); g.appendChild(s('path', { d: 'M42 58 Q50 44 58 58', stroke: '#5c9a3f', 'stroke-width': 2, fill: 'none' })); }
    else if (kind === 'bottle') { g.appendChild(s('rect', { x: 44, y: 16, width: 12, height: 10, rx: 2, fill: '#1c1c1e' })); g.appendChild(s('rect', { x: 34, y: 26, width: 32, height: 62, rx: 8, fill: c[1] })); g.appendChild(s('rect', { x: 38, y: 46, width: 24, height: 22, rx: 3, fill: '#f3f1ec' })); }
    else if (kind === 'can') { g.appendChild(s('rect', { x: 28, y: 44, width: 36, height: 40, rx: 6, fill: c[1] })); g.appendChild(s('path', { d: 'M64 54 L86 34', stroke: c[1], 'stroke-width': 6, 'stroke-linecap': 'round' })); g.appendChild(s('path', { d: 'M34 44 Q46 26 58 44', stroke: c[1], 'stroke-width': 5, fill: 'none' })); }
    else if (kind === 'shears') { g.appendChild(s('path', { d: 'M50 50 L28 22 M50 50 L72 22', stroke: '#9aa0a6', 'stroke-width': 5, 'stroke-linecap': 'round' })); g.appendChild(s('path', { d: 'M50 50 L36 84 M50 50 L64 84', stroke: c[1], 'stroke-width': 7, 'stroke-linecap': 'round' })); g.appendChild(s('circle', { cx: 50, cy: 50, r: 3.5, fill: '#d9b44a' })); }
    return g;
  }
  function artBox(p, cls) { var b = h('div', { class: cls }); b.style.background = p[6][0]; b.appendChild(art(p)); return b; }

  /* ---------- Data ---------- */
  function money(n) { try { return new Intl.NumberFormat(L.lang === 'es' ? 'es-MX' : 'en-US', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2, minimumFractionDigits: (n % 1) ? 2 : 0 }).format(n || 0); } catch (e) { return '$' + n; } }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isoDay(t) { var d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  var STEPS = ['new', 'packed', 'shipped', 'delivered'];
  function seed() {
    var r = K.rng(7788), stock = {}, sold = {};
    P.forEach(function (p) { stock[p[0]] = 3 + Math.floor(r() * 22); sold[p[0]] = 0; });
    stock.fig = 2; stock.lavender = 4; stock.shears = 0;
    var names = ['Carla Méndez', 'Óscar Rubio', 'Paola Vidal', 'Iván Castañeda', 'Rocío Bravo', 'Andrés Pineda', 'Natalia Rosas', 'Germán Leal', 'Fernanda Soto', 'Raúl Cisneros'];
    var orders = [], now = Date.now(), n = 1200;
    for (var d = 6; d >= 0; d--) {
      var count = 2 + Math.floor(r() * 4);
      for (var i = 0; i < count; i++) {
        var items = [], k = 1 + Math.floor(r() * 3);
        for (var j = 0; j < k; j++) { var p = P[Math.floor(r() * P.length)]; if (!items.some(function (x) { return x[0] === p[0]; })) items.push([p[0], 1 + Math.floor(r() * 2)]); }
        var sub = items.reduce(function (t, x) { return t + BY[x[0]][4] * x[1]; }, 0);
        var del = r() > 0.35 ? 'ship' : 'pickup', shipFee = del === 'ship' && sub < 999 ? 99 : 0;
        items.forEach(function (x) { sold[x[0]] += x[1]; });
        var ts = now - d * 86400000 - Math.floor(r() * 8) * 3600000;
        var st = d >= 3 ? 'delivered' : d === 2 ? (r() > 0.5 ? 'delivered' : 'shipped') : d === 1 ? STEPS[1 + Math.floor(r() * 2)] : STEPS[Math.floor(r() * 2)];
        orders.push({ id: 'MC-' + (++n), at: ts, name: names[Math.floor(r() * names.length)], items: items, del: del, sub: sub, disc: 0, ship: shipFee, total: sub + shipFee, status: st });
      }
    }
    return { v: 1, stock: stock, sold: sold, orders: orders, seq: n, cart: [], coupon: false };
  }
  function validate(d) {
    if (!d || d.v !== 1 || !d.stock || !Array.isArray(d.orders)) return null;
    var st = {}, so = {};
    P.forEach(function (p) { st[p[0]] = Math.max(0, Math.min(999, Math.floor(+d.stock[p[0]] || 0))); so[p[0]] = Math.max(0, Math.floor(+((d.sold || {})[p[0]]) || 0)); });
    function items(a) { return (Array.isArray(a) ? a : []).filter(function (x) { return x && BY[x[0]]; }).map(function (x) { return [x[0], Math.max(1, Math.min(99, Math.floor(+x[1] || 1)))]; }).slice(0, 30); }
    return { v: 1, stock: st, sold: so, seq: +d.seq || 2000, coupon: !!d.coupon, cart: items(d.cart),
      orders: d.orders.filter(function (o) { return o && STEPS.indexOf(o.status) >= 0; }).map(function (o) {
        return { id: clean(o.id, 12), at: +o.at || Date.now(), name: clean(o.name, 60), items: items(o.items), del: o.del === 'pickup' ? 'pickup' : 'ship',
          sub: Math.max(0, +o.sub || 0), disc: Math.max(0, +o.disc || 0), ship: Math.max(0, +o.ship || 0), total: Math.max(0, +o.total || 0), status: o.status };
      }) };
  }
  var db = validate(STORE.load()) || seed();
  function save() { STORE.save(db); }

  /* ---------- State ---------- */
  var state = { side: 'shop', view: 'ov', cat: 'all', q: '', sort: 'pop', pd: null, qty: 1, ordFilter: 'all' };
  function $(id) { return document.getElementById(id); }

  function renderSide() {
    $('shopSide').hidden = state.side !== 'shop'; $('adminSide').hidden = state.side !== 'admin';
    $('cartBtn').hidden = state.side !== 'shop';
    document.querySelectorAll('#modeSeg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-mode') === state.side); });
    document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-view') === state.view); });
    document.querySelectorAll('#adminSide .view').forEach(function (v) { v.classList.toggle('on', v.id === 'view-' + state.view); });
    $('newCount').textContent = String(db.orders.filter(function (o) { return o.status === 'new'; }).length);
    $('cartCount').textContent = String(db.cart.reduce(function (t, x) { return t + x[1]; }, 0));
  }

  /* ---------- Storefront ---------- */
  function stockText(id) { var n = db.stock[id]; return n <= 0 ? T('out') : n < 5 ? T('low', { n: n }) : T('inStock', { n: n }); }
  function inCart(id) { var x = db.cart.filter(function (c) { return c[0] === id; })[0]; return x ? x[1] : 0; }
  function renderShop() {
    var cc = $('catChips'); clear(cc);
    Object.keys(T('cats')).forEach(function (c) { cc.appendChild(h('button', { type: 'button', class: 'chip' + (state.cat === c ? ' on' : ''), text: T('cats')[c], onclick: function () { state.cat = c; renderShop(); } })); });
    var q = state.q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    var best = Object.keys(db.sold).sort(function (a, b) { return db.sold[b] - db.sold[a]; }).slice(0, 3);
    var list = P.filter(function (p) {
      if (state.cat !== 'all' && p[3] !== state.cat) return false;
      return !q || (p[1] + ' ' + p[2] + ' ' + T('cats')[p[3]]).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').indexOf(q) !== -1;
    }).sort(function (a, b) {
      if (state.sort === 'low') return a[4] - b[4];
      if (state.sort === 'high') return b[4] - a[4];
      if (state.sort === 'name') return pName(a) < pName(b) ? -1 : 1;
      return db.sold[b[0]] - db.sold[a[0]];
    });
    var g = $('grid'); clear(g);
    if (!list.length) g.appendChild(h('p', { class: 'empty-shop', text: T('noResults') }));
    list.forEach(function (p) {
      var box = artBox(p, 'art');
      if (db.stock[p[0]] <= 0) box.appendChild(h('span', { class: 'pill tag', text: T('out') }));
      else if (best.indexOf(p[0]) >= 0) box.appendChild(h('span', { class: 'pill acc plain tag', text: T('best') }));
      var addBtn = h('button', { type: 'button', class: 'add', 'aria-label': T('add'), text: '+', onclick: function (e) { e.stopPropagation(); addToCart(p[0], 1); } });
      if (db.stock[p[0]] - inCart(p[0]) <= 0) addBtn.disabled = true;
      g.appendChild(h('article', { class: 'prod', tabindex: '0', onclick: function () { openPd(p[0]); }, onkeydown: function (e) { if (e.key === 'Enter') openPd(p[0]); } }, [
        box, h('div', { class: 'prod-body' }, [h('small', { text: T('cats')[p[3]] }), h('b', { text: pName(p) }), h('small', { text: stockText(p[0]) }),
          h('div', { class: 'prod-foot' }, [h('span', { class: 'price', text: money(p[4]) }), addBtn])])
      ]));
    });
  }
  function addToCart(id, n) {
    var have = inCart(id), avail = db.stock[id];
    if (have + n > avail) { K.toast(T('maxStock')); return; }
    var x = db.cart.filter(function (c) { return c[0] === id; })[0];
    if (x) x[1] += n; else db.cart.push([id, n]);
    save(); K.toast(T('added') + ' · ' + pName(BY[id]));
    var b = $('cartBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    renderSide(); renderShop(); if ($('cart').classList.contains('open')) renderCart();
  }

  function openPd(id) {
    var p = BY[id]; state.pd = id; state.qty = 1;
    var a = $('pdArt'); clear(a); a.style.background = p[6][0]; a.appendChild(art(p));
    $('pdCat').textContent = T('cats')[p[3]]; $('pdName').textContent = pName(p); $('pdPrice').textContent = money(p[4]); $('pdDesc').textContent = pDesc(p);
    var f = $('pdFacts'); clear(f);
    var facts = [[T('size'), p[11]]];
    if (p[7]) facts.push([T('light'), T(p[7])], [T('water'), T(p[8])], [T('care'), T(p[9])]);
    facts.forEach(function (x) { f.appendChild(h('li', null, [h('b', { text: x[0] }), x[1]])); });
    renderPdQty(); $('pdModal').hidden = false; $('pdAdd').focus();
  }
  function renderPdQty() {
    var id = state.pd, left = db.stock[id] - inCart(id);
    $('pdQty').textContent = String(state.qty); $('pdStock').textContent = stockText(id);
    $('pdAdd').disabled = left <= 0 || state.qty > left;
  }

  /* ---------- Cart ---------- */
  function totals() {
    var sub = db.cart.reduce(function (t, x) { return t + BY[x[0]][4] * x[1]; }, 0);
    var disc = db.coupon ? Math.round(sub * 10) / 100 : 0;
    var del = $('cDel') ? $('cDel').value : 'ship';
    var ship = sub === 0 || sub - disc >= 999 || del === 'pickup' ? 0 : 99;
    return { sub: sub, disc: disc, ship: ship, total: Math.round((sub - disc + ship) * 100) / 100 };
  }
  function totalsInto(box, showHint) {
    clear(box); var t = totals();
    box.appendChild(h('div', null, [h('span', { text: T('subtotal') }), h('span', { text: money(t.sub) })]));
    if (t.disc) box.appendChild(h('div', { class: 'ok' }, [h('span', { text: T('discount') }), h('span', { text: '− ' + money(t.disc) })]));
    box.appendChild(h('div', null, [h('span', { text: T('shipping') }), h('span', { text: t.ship ? money(t.ship) : T('free') })]));
    if (showHint && t.sub && t.sub - t.disc < 999) box.appendChild(h('div', { class: 'hint', text: T('freeHint', { a: money(999 - (t.sub - t.disc)) }) }));
    box.appendChild(h('div', { class: 'grand' }, [h('span', { text: T('total') }), h('span', { text: money(t.total) })]));
  }
  function renderCart() {
    var box = $('cartItems'); clear(box);
    if (!db.cart.length) box.appendChild(h('p', { class: 'muted', text: T('emptyCart') }));
    db.cart.forEach(function (x) {
      var p = BY[x[0]];
      var q = h('div', { class: 'qty sm' }, [
        h('button', { type: 'button', 'aria-label': '−', text: '−', onclick: function () { x[1]--; if (x[1] <= 0) db.cart = db.cart.filter(function (c) { return c !== x; }); save(); renderCart(); renderSide(); renderShop(); } }),
        h('span', { text: String(x[1]) }),
        h('button', { type: 'button', 'aria-label': '+', text: '+', onclick: function () { if (x[1] + 1 > db.stock[x[0]]) { K.toast(T('maxStock')); return; } x[1]++; save(); renderCart(); renderSide(); renderShop(); } })]);
      box.appendChild(h('div', { class: 'ci' }, [artBox(p, 'ci-art'), h('div', null, [h('b', { text: pName(p) }), h('small', { text: money(p[4]) })]), h('div', { class: 'ci-right' }, [h('b', { text: money(p[4] * x[1]) }), q])]));
    });
    $('couponMsg').textContent = db.coupon ? T('couponOk') : ''; $('couponMsg').className = 'small ok';
    totalsInto($('cartTotals'), true);
    $('checkoutBtn').disabled = !db.cart.length;
  }
  function openCart() { renderCart(); $('cart').classList.add('open'); $('cart').setAttribute('aria-hidden', 'false'); $('backdrop').hidden = false; $('cartClose').focus(); }
  function closeCart() { $('cart').classList.remove('open'); $('cart').setAttribute('aria-hidden', 'true'); $('backdrop').hidden = true; }

  /* ---------- Checkout ---------- */
  function openCheckout() {
    if (!db.cart.length) return;
    closeCart(); $('coErr').textContent = '';
    $('addrField').hidden = $('cDel').value === 'pickup';
    totalsInto($('coTotals'), false);
    $('coModal').hidden = false; $('cName').focus();
  }
  function place() {
    var name = clean($('cName').value, 60), email = clean($('cEmail').value, 80), del = $('cDel').value === 'pickup' ? 'pickup' : 'ship', addr = clean($('cAddr').value, 120);
    if (name.split(' ').filter(Boolean).length < 2) { $('coErr').textContent = T('eName'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { $('coErr').textContent = T('eEmail'); return; }
    if (del === 'ship' && addr.length < 8) { $('coErr').textContent = T('eAddr'); return; }
    if (db.cart.some(function (x) { return x[1] > db.stock[x[0]]; })) { $('coErr').textContent = T('eStock'); return; }
    var t = totals();
    db.seq++;
    var o = { id: 'MC-' + db.seq, at: Date.now(), name: name, items: db.cart.map(function (x) { return [x[0], x[1]]; }), del: del, sub: t.sub, disc: t.disc, ship: t.ship, total: t.total, status: 'new' };
    o.items.forEach(function (x) { db.stock[x[0]] -= x[1]; db.sold[x[0]] += x[1]; });
    db.orders.push(o); db.cart = []; db.coupon = false; save();
    $('coModal').hidden = true; $('coupon').value = '';
    $('okTitle').textContent = T('okTitle', { n: o.id }); $('okBody').textContent = T('okBody', { c: name.split(' ')[0] });
    $('okModal').hidden = false;
    renderSide(); renderShop();
  }

  /* ---------- Owner ---------- */
  function renderAdmin() {
    if (state.view === 'ov') renderOv();
    if (state.view === 'orders') renderOrders();
    if (state.view === 'stock') renderStock();
  }
  function renderOv() {
    var today = isoDay(Date.now()), week = db.orders.filter(function (o) { return Date.now() - o.at < 7 * 86400000; });
    var tOrders = db.orders.filter(function (o) { return isoDay(o.at) === today; });
    var low = P.filter(function (p) { return db.stock[p[0]] < 5; });
    var k = $('kpis'); clear(k);
    [[T('k1'), money(tOrders.reduce(function (s, o) { return s + o.total; }, 0)), T('k1s', { n: tOrders.length }), ''],
     [T('k2'), String(week.length), T('k2s', { n: week.filter(function (o) { return o.status === 'new' || o.status === 'packed'; }).length }), ''],
     [T('k3'), money(week.length ? week.reduce(function (s, o) { return s + o.total; }, 0) / week.length : 0), T('k3s'), ''],
     [T('k4'), String(low.length), T('k4s'), low.length ? 'alert' : '']].forEach(function (x) {
      k.appendChild(h('div', { class: 'kpi ' + x[3] }, [h('span', { text: x[0] }), h('b', { text: x[1] }), h('small', { text: x[2] })]));
    });
    var cols = $('weekCols'); clear(cols);
    var days = []; for (var i = 6; i >= 0; i--) days.push(isoDay(Date.now() - i * 86400000));
    var vals = days.map(function (d) { return db.orders.filter(function (o) { return isoDay(o.at) === d; }).reduce(function (s, o) { return s + o.total; }, 0); });
    var max = Math.max.apply(null, vals.concat([1]));
    days.forEach(function (d, i) {
      var bar = h('i', { title: money(vals[i]) }); bar.style.height = Math.max(3, vals[i] / max * 160) + 'px';
      var lbl = new Date(d + 'T12:00:00').toLocaleDateString(L.lang === 'es' ? 'es-MX' : 'en-US', { weekday: 'short' });
      cols.appendChild(h('div', { class: 'col' }, [h('span', { text: money(vals[i]).replace(/\.\d+$/, '') }), bar, h('small', { text: lbl })]));
    });
    var top = Object.keys(db.sold).sort(function (a, b) { return db.sold[b] - db.sold[a]; }).slice(0, 6), tmax = top.length ? db.sold[top[0]] || 1 : 1;
    var tl = $('topList'); clear(tl);
    top.forEach(function (id) { var fill = h('i'); fill.style.width = Math.round(db.sold[id] / tmax * 100) + '%'; tl.appendChild(h('div', { class: 'bar' }, [h('span', { text: pName(BY[id]) }), h('span', { class: 'track' }, [fill]), h('b', { text: T('units', { n: db.sold[id] }) })])); });
  }
  function renderOrders() {
    var ch = $('ordChips'); clear(ch);
    ['all'].concat(STEPS).forEach(function (s) {
      var n = db.orders.filter(function (o) { return s === 'all' || o.status === s; }).length;
      ch.appendChild(h('button', { type: 'button', class: 'chip' + (state.ordFilter === s ? ' on' : ''), text: T('st.' + s) + ' · ' + n, onclick: function () { state.ordFilter = s; renderOrders(); } }));
    });
    var tb = $('ordRows'); clear(tb);
    var list = db.orders.filter(function (o) { return state.ordFilter === 'all' || o.status === state.ordFilter; }).sort(function (a, b) { return b.at - a.at; });
    if (!list.length) tb.appendChild(h('tr', null, [h('td', { colspan: '7', class: 'empty-row', text: T('noOrders') })]));
    list.forEach(function (o) {
      var when = new Date(o.at).toLocaleString(L.lang === 'es' ? 'es-MX' : 'en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
      var cls = { new: 'warn', packed: 'acc', shipped: 'acc', delivered: 'ok' }[o.status];
      var act = o.status !== 'delivered' ? h('button', { type: 'button', class: 'icon-btn', text: T('nx.' + o.status), onclick: function () { o.status = STEPS[STEPS.indexOf(o.status) + 1]; save(); K.toast(T('tStatus', { n: o.id, s: T('st.' + o.status) })); renderOrders(); renderSide(); } }) : null;
      tb.appendChild(h('tr', null, [
        h('td', null, [h('div', { class: 'cell-main' }, [h('b', { class: 'mono', text: o.id }), h('small', { text: when })])]),
        h('td', { text: o.name }),
        h('td', null, [h('div', { class: 'cell-main' }, [h('b', { text: T('items', { n: o.items.reduce(function (t, x) { return t + x[1]; }, 0) }) }), h('small', { text: o.items.map(function (x) { return x[1] + '× ' + pName(BY[x[0]]); }).join(', ') })])]),
        h('td', { text: o.del === 'pickup' ? T('pickup') : T('ship') }),
        h('td', { class: 'num', text: money(o.total) }),
        h('td', null, [h('span', { class: 'pill ' + cls, text: T('st.' + o.status) })]),
        h('td', null, [act])
      ]));
    });
  }
  function renderStock() {
    var tb = $('invRows'); clear(tb);
    P.slice().sort(function (a, b) { return db.stock[a[0]] - db.stock[b[0]]; }).forEach(function (p) {
      var n = db.stock[p[0]];
      function setN(v) { db.stock[p[0]] = Math.max(0, Math.min(999, v)); save(); K.toast(T('tStock')); renderStock(); }
      tb.appendChild(h('tr', null, [
        h('td', null, [h('div', { class: 'stock-cell' }, [artBox(p, 'mini-art'), h('b', { text: pName(p) })])]),
        h('td', { text: T('cats')[p[3]] }), h('td', { class: 'num', text: money(p[4]) }),
        h('td', null, [h('div', { class: 'row' }, [h('div', { class: 'qty sm' }, [h('button', { type: 'button', text: '−', 'aria-label': '−', onclick: function () { setN(n - 1); } }), h('span', { text: String(n) }), h('button', { type: 'button', text: '+', 'aria-label': '+', onclick: function () { setN(n + 1); } })]),
          n < 5 ? h('span', { class: 'pill ' + (n === 0 ? 'err' : 'warn'), text: n === 0 ? T('out') : T('low', { n: n }) }) : null,
          h('button', { type: 'button', class: 'icon-btn', text: '+10', onclick: function () { setN(n + 10); } })])]),
        h('td', { class: 'num', text: String(db.sold[p[0]]) })
      ]));
    });
  }

  function renderAll() { renderSide(); if (state.side === 'shop') renderShop(); else renderAdmin(); }

  /* ---------- Wiring ---------- */
  document.querySelectorAll('#modeSeg button').forEach(function (b) { b.addEventListener('click', function () { state.side = b.getAttribute('data-mode'); closeCart(); renderAll(); window.scrollTo(0, 0); }); });
  document.querySelectorAll('#tabs button').forEach(function (b) { b.addEventListener('click', function () { state.view = b.getAttribute('data-view'); renderAll(); }); });
  $('q').addEventListener('input', function () { state.q = clean(this.value, 40); renderShop(); });
  $('sort').addEventListener('change', function () { state.sort = this.value; renderShop(); });
  $('cartBtn').addEventListener('click', openCart);
  $('cartClose').addEventListener('click', closeCart);
  $('backdrop').addEventListener('click', closeCart);
  $('pdMinus').addEventListener('click', function () { if (state.qty > 1) { state.qty--; renderPdQty(); } });
  $('pdPlus').addEventListener('click', function () { if (state.qty < db.stock[state.pd] - inCart(state.pd)) { state.qty++; renderPdQty(); } else K.toast(T('maxStock')); });
  $('pdAdd').addEventListener('click', function () { addToCart(state.pd, state.qty); $('pdModal').hidden = true; });
  $('couponBtn').addEventListener('click', function () {
    var c = clean($('coupon').value, 16).toUpperCase();
    if (c === 'DEMO10') { db.coupon = true; save(); renderCart(); }
    else { db.coupon = false; save(); renderCart(); $('couponMsg').textContent = T('couponBad'); $('couponMsg').className = 'small bad'; }
  });
  $('coupon').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('couponBtn').click(); });
  $('checkoutBtn').addEventListener('click', openCheckout);
  $('cDel').addEventListener('change', function () { $('addrField').hidden = this.value === 'pickup'; totalsInto($('coTotals'), false); });
  $('placeBtn').addEventListener('click', place);
  $('okAdmin').addEventListener('click', function () { $('okModal').hidden = true; state.side = 'admin'; state.view = 'orders'; state.ordFilter = 'new'; renderAll(); window.scrollTo(0, 0); });
  document.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { $(b.getAttribute('data-close')).hidden = true; }); });
  document.querySelectorAll('.modal').forEach(function (m) { m.addEventListener('click', function (e) { if (e.target === m) m.hidden = true; }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !document.querySelector('.dk-tour')) { document.querySelectorAll('.modal').forEach(function (m) { m.hidden = true; }); closeCart(); } });

  var resetBtn = h('button', { type: 'button', class: 'link', id: 'resetBtn', 'data-i18n': 'reset', text: T('reset'), onclick: function () { STORE.clear(); db = seed(); save(); closeCart(); K.toast(T('tReset')); renderAll(); } });
  document.querySelector('.top-right').insertBefore(resetBtn, $('cartBtn'));

  function side(sd, view) { return function () { closeCart(); $('pdModal').hidden = true; if (state.side !== sd || (view && state.view !== view)) { state.side = sd; if (view) state.view = view; renderAll(); } }; }
  var tour = new K.Tour({
    key: 'mercato', lang: function () { return L.lang; },
    steps: [
      { target: null, title: { en: 'Welcome to Mercato', es: 'Bienvenido a Mercato' },
        body: { en: 'A complete online store for a fictional plant shop: the customer side and the owner side, connected. Nothing is really charged or shipped.', es: 'Una tienda en línea completa para un vivero ficticio: el lado del cliente y el del dueño, conectados. No se cobra ni se envía nada de verdad.' } },
      { target: '#shopBar', before: side('shop'), title: { en: 'Browse the catalog', es: 'Explora el catálogo' },
        body: { en: 'Search, filter by category and sort by popularity or price. Stock is live — sold‑out products cannot be added.', es: 'Busca, filtra por categoría y ordena por popularidad o precio. Las existencias son reales — lo agotado no se puede agregar.' } },
      { target: '#grid', before: side('shop'), title: { en: 'Product pages', es: 'Fichas de producto' },
        body: { en: 'Click a product for its description and care guide, or use + to add it straight to the cart.', es: 'Haz clic en un producto para ver su descripción y guía de cuidado, o usa + para agregarlo directo al carrito.' } },
      { target: '#cartBtn', before: side('shop'), title: { en: 'Cart and checkout', es: 'Carrito y pago' },
        body: { en: 'Adjust quantities, try the coupon DEMO10 and see free delivery kick in over $999. Checkout never asks for card details.', es: 'Ajusta cantidades, prueba el cupón DEMO10 y mira cómo el envío se vuelve gratis arriba de $999. El pago nunca pide datos de tarjeta.' } },
      { target: '#modeSeg', before: side('shop'), title: { en: 'The owner side', es: 'El lado del dueño' },
        body: { en: 'Switch to the dashboard to see what the shop owner sees.', es: 'Cambia al panel para ver lo que ve el dueño de la tienda.' } },
      { target: '#kpis', before: side('admin', 'ov'), title: { en: 'Sales at a glance', es: 'Ventas de un vistazo' },
        body: { en: 'Today\'s sales, weekly orders, average ticket and products running low, plus a 7‑day chart and best sellers.', es: 'Ventas de hoy, pedidos de la semana, ticket promedio y productos por agotarse, además de la gráfica de 7 días y los más vendidos.' } },
      { target: '#tabs', before: side('admin', 'ov'), title: { en: 'Orders and inventory', es: 'Pedidos e inventario' },
        body: { en: 'Move orders from new to packed, shipped and delivered, and restock products — changes appear in the store immediately.', es: 'Lleva los pedidos de nuevo a empacado, enviado y entregado, y resurte productos — los cambios aparecen en la tienda al instante.' } },
      { target: '.top-right', title: { en: 'Always at hand', es: 'Siempre a la mano' },
        body: { en: 'Replay this tour, switch language or reset the demo. The Portfolio button takes you back.', es: 'Repite este recorrido, cambia el idioma o reinicia la demo. El botón Portafolio te regresa.' } }
    ]
  });
  $('tourBtn').addEventListener('click', function () { tour.start(); });

  L.bind(function () { renderAll(); if (!$('pdModal').hidden && state.pd) openPd(state.pd); if ($('cart').classList.contains('open')) renderCart(); });
  save();
  renderAll();
  if (!tour.seen()) setTimeout(function () { tour.start(); }, 400);
})();
