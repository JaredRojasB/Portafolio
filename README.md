# Jared Rojas — Portfolio

Personal portfolio of Jared Jacob Rojas Barrón, IT Operations & Systems Solutions Engineer (Guadalajara, MX).

Live site: https://jaredrojasb.github.io/Portafolio/

## Projects

Every project in this repository is an independent demo built specifically for the portfolio. The visual design is for demonstration; colors, layout and branding can be adapted to each client. All data is fictional and stays in the visitor's browser; nothing connects to a real client, server or database.

| Project | Folder | Status |
|---|---|---|
| Spacio — space booking on an interactive floor plan (guided tour, EN/ES) | `spacio/` | Live |
| Inventra — asset management (company / home, guided tour, EN/ES) | `inventra/` | Live |
| Triage — conversational help desk (classifier, SLA queue, guided tour, EN/ES) | `triage/` | Live |
| Settle — payables and renewals (business / household, guided tour, EN/ES) | `settle/` | Live |
| Vitalis — clinical lab front desk (smart study search, worklist, guided tour, EN/ES) | `vitalis/` | Live |
| Hearth — shared finances | — | In progress |
| Mercato — e‑commerce storefront | — | In progress |
| Atlas — private cloud case study | — | In progress |

## Security

- Static site: no server, no database, no API keys.
- Strict Content-Security-Policy on every page (scripts only from this site, no inline scripts).
- User input is rendered with `textContent` only and sanitized before storage.
- CSV exports are protected against spreadsheet formula injection.
