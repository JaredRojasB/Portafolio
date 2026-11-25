# Vitalis — clinical lab front desk demo

Live: https://jaredrojasb.github.io/Portafolio/vitalis/

Vitalis is front desk software for clinical labs and small practices: register patients, build an order from a study catalog and follow every sample until results are delivered.

## What it does

- **New order in three steps.** Find a patient by name or phone (or register a new one — age is calculated from the birth date), add studies, apply a discount and choose how the patient pays.
- **Smart study search.** Finds studies by code (BH, QS6, EGO…), by name in English or Spanish, or by everyday words ("sugar", "thyroid", "orina", "embarazo"). Preparation requirements such as fasting are gathered automatically.
- **Printable receipt** with folio, results time, totals and preparation notes.
- **Worklist.** Each order moves through Registered → Sample taken → In process → Ready → Delivered. Pending payments can be collected here. Filter by status and day.
- **Patients.** Searchable list; open a patient to see every visit and start a new order for them.
- **Catalog.** 30 studies and packages with area, turnaround time, preparation and price; click one to add it to an order.
- **Daily summary.** Visits, money collected, pending collections, results ready to deliver and most requested studies.
- **Guided tour** on first visit and **English / Spanish** switch.

## How it is built

- Plain HTML, CSS and JavaScript, no external libraries.
- All patients, prices and the clinic are fictional. Data is stored in `localStorage` on the visitor's device and never sent anywhere.
- Security: strict Content-Security-Policy, user text written with `textContent` and sanitized before storage, stored data validated on load.
