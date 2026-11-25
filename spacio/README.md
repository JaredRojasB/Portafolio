# Spacio — space booking demo

Live: https://jaredrojasb.github.io/Portafolio/spacio/

Spacio is a booking system for shared spaces. A visitor picks a day, finds a free desk, meeting room or amenity on an interactive floor plan and reserves it in a few clicks.

## What it does

- **Two modes.** *Workplace* (Northwind Studio: 18 desks, 5 meeting rooms, 6 focus booths, 3 lounges) and *Residence* (Alameda Residences: terrace, grills, gym, laundry, co-work and event rooms). Same engine, different rules: offices open 8:00–20:00 with a 4 h limit; residences 7:00–22:00 with a 2 h limit.
- **Interactive floor plan.** SVG plan colored by availability for the chosen day (free, partly booked, full). Keyboard accessible.
- **Filters.** By space type, minimum capacity and equipment (screen, video, whiteboard, A/C...).
- **Booking rules.** 30-minute slots, no past times, no overlaps with other bookings or with your own, maximum duration per site.
- **Week view.** Occupancy of every space for the whole week; click a cell to jump to that space and day.
- **Insights.** Bookings and hours this week, utilization, peak hour, usage by space type and most booked spaces.
- **My bookings.** Upcoming reservations with a check-in pass (opens 15 minutes before the start) and cancellation.
- **Guided tour** on first visit (replay with "Take the tour") and **English / Spanish** switch.

## How it is built

- Plain HTML, CSS and JavaScript — no frameworks, no external libraries.
- Fictional seed data generated in the browser; everything is stored in `localStorage` on the visitor's device. Nothing is sent to a server.
- Security: strict Content-Security-Policy (scripts only from this site), every piece of user text is written with `textContent` and sanitized before it is stored, stored data is validated when loaded.
