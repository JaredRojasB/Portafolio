# Mercato — e‑commerce demo

Live: https://jaredrojasb.github.io/Portafolio/mercato/

Mercato is a complete online store for a fictional plant shop, with both sides connected: what the customer sees and what the owner manages.

## What it does

**Storefront**
- Catalog of 18 products (indoor plants, herbs, pots, care and tools) with original illustrations.
- Search, category filters and sorting by popularity, price or name. "Best seller" and "Sold out" labels come from real sales and stock data.
- Product page with description, size and care guide (light, water, difficulty) and quantity selector limited by stock.
- Cart drawer with quantities, coupon `DEMO10` (10% off) and free delivery over $999.
- Checkout with delivery or store pickup. **No payment is processed and no card data is ever requested.**

**Owner dashboard**
- Sales today, weekly orders, average ticket and low-stock products; 7‑day sales chart and best sellers.
- Orders flow New → Packed → Shipped → Delivered. Orders placed in the storefront appear instantly.
- Inventory with quick restock; stock changes are reflected in the store immediately.

Also: **guided tour** on first visit and **English / Spanish** switch.

## How it is built

- Plain HTML, CSS and JavaScript, no external libraries; product illustrations are generated SVG.
- Fictional data stored in `localStorage` on the visitor's device. Nothing is sent to a server.
- Security: strict Content-Security-Policy, user text written with `textContent` and sanitized before storage, stored data validated on load, no payment fields.
