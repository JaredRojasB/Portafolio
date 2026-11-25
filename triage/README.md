# Triage — conversational service desk demo

Live: https://jaredrojasb.github.io/Portafolio/triage/

Triage is a help desk that talks like a person. Users describe a problem in their own words (English or Spanish); Triage classifies it, sets a priority, offers guided self-service steps and escalates to a technician only when needed.

## What it does

- **Get help (user side).** Chat with example prompts. Each answer shows the detected category, the priority and the exact words that drove the decision.
- **Rule-based classifier.** Keyword rules in both languages map messages to Network, Access & passwords, Email, Printer, Hardware, Software, Security or General. Urgency and impact words ("urgent", "everyone", "client", "no puedo trabajar"…) raise the priority; calm wording lowers it. Security issues always go to a person.
- **Response targets.** P1 1 hour, P2 4 hours, P3 1 day, P4 3 days. Deadlines turn yellow when close and red when overdue.
- **Technician queue.** Tickets sorted by priority and deadline, status filters and search. Open a ticket to see the conversation and the classifier's reasoning, take it, reply and resolve or reopen it.
- **Knowledge base.** The guides the assistant suggests, searchable.
- **Insights.** Open tickets, deadlines at risk, self-service resolution rate, average resolution time, tickets by category and priority.
- **Guided tour** on first visit and **English / Spanish** switch.

## How it is built

- Plain HTML, CSS and JavaScript, no external libraries and no AI service — the classifier is transparent, deterministic rules.
- Fictional tickets stored in `localStorage` on the visitor's device. Nothing is sent to a server.
- Security: strict Content-Security-Policy, user text written with `textContent` and sanitized before storage, stored data validated on load.
