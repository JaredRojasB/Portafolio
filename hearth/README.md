# Hearth — shared finances demo

Live: https://jaredrojasb.github.io/Portafolio/hearth/

Hearth makes shared money clear — for a couple sharing a home or two partners sharing a small business.

## What it does

- **Two modes.** *Household* (a couple's income, fixed bills and everyday spending) and *Small business* (two partners sharing a studio's costs).
- **This month.** Income, spent so far, what is left and saving rate against a 20% target.
- **Fair split.** Fixed bills split in proportion to income or 50/50, showing exactly what each person pays.
- **Budgets** per category that turn yellow near the limit and red when exceeded.
- **Spending.** Add expenses with category and who paid; filter by category; budgets update instantly.
- **Goals.** Savings goals with progress rings and quick contributions.
- **Debts.** Payoff projection (months and total interest) with a chart, plus a slider to see how much time and interest an extra monthly payment saves.
- **Guided tour** on first visit and **English / Spanish** switch.

## How it is built

- Plain HTML, CSS and JavaScript, no external libraries; charts are generated SVG.
- Fictional people and amounts stored in `localStorage` on the visitor's device. Nothing is sent to a server.
- Security: strict Content-Security-Policy, user text written with `textContent` and sanitized before storage, stored data validated on load.
- Projections are planning estimates, not financial advice.
