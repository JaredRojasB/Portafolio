# Inventra — asset management demo

Live: https://jaredrojasb.github.io/Portafolio/inventra/

Inventra keeps track of equipment: what you own, who has it, what it is worth and when its warranty ends.

## What it does

- **Two modes.** *Company* (Northwind Studio: laptops, monitors, phones, peripherals, network and A/V equipment handed to 8 employees) and *Home* (Casa Alameda: appliances, TVs, computers and tools organized by room).
- **Overview.** Total assets and value, share in use, warranties ending in the next 60 days, devices in repair, usage by category, status breakdown and recent activity.
- **Assets table.** Search by name, tag, serial or person; filter by category and status; sort any column; export the current view to CSV.
- **Asset detail.** Label with a tag pattern, full details and a complete history. Actions: assign or move, return, send to repair, back from repair, retire, restore, edit and delete.
- **People / rooms.** What each person or room currently holds and its value; click to see their assets.
- **Activity.** Timeline of every registration, assignment, repair and retirement.
- **Guided tour** on first visit and **English / Spanish** switch.

## How it is built

- Plain HTML, CSS and JavaScript, no external libraries.
- Fictional seed data; everything is stored in `localStorage` on the visitor's device. Nothing is sent to a server.
- Security: strict Content-Security-Policy, user text written with `textContent` and sanitized before storage, stored data validated on load, and CSV export protected against spreadsheet formula injection.
