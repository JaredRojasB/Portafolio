# Settle — payables and renewals demo

Live: https://jaredrojasb.github.io/Portafolio/settle/

Settle puts every payment that is due in one calm place — suppliers, payroll, household bills — together with the renewals nobody should forget.

## What it does

- **Two modes.** *Business* (a construction company paying suppliers, payroll and permits by project) and *Household* (mortgage, utilities, car, tuition and subscriptions by account).
- **Overview.** Overdue amount, what is due in the next 7 days, what was paid this month and renewals within 30 days. Pending payments grouped by urgency with one-click "Pay".
- **Payments.** Search, filter by project/account and status, add, edit, undo and delete. Recording a payment captures date, method and reference. Monthly payments create next month's automatically.
- **Renewals.** Insurance, digital certificates, licenses, permits and subscriptions with a countdown and progress bar. "Renew" moves the expiry forward and records the payment.
- **Reports.** Spending by project or account and a six-month paid-versus-pending chart.
- **CSV export** for accounting, protected against spreadsheet formula injection.
- **Guided tour** on first visit and **English / Spanish** switch.

## How it is built

- Plain HTML, CSS and JavaScript, no external libraries.
- Fictional data stored in `localStorage` on the visitor's device. Nothing is sent to a server.
- Security: strict Content-Security-Policy, user text written with `textContent` and sanitized before storage, stored data validated on load.
