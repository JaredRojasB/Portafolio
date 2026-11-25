# Atlas — private cloud case study

Live: https://jaredrojasb.github.io/Portafolio/atlas/

Atlas tells a real infrastructure project as a case study: a private cloud for a family, built from reused computers to replace paid cloud storage. All personal details, names, addresses and network data are anonymized.

## What it contains

**Case study**
- The goal and requirements: private, free to run, simple for non-technical users, safely backed up and reachable from anywhere.
- Architecture diagram: devices reach the main server through a private mesh VPN; services run in isolated containers; encrypted backups travel nightly to a second machine; alerts go to a family chat.
- Building blocks: Proxmox VE, LXC + Docker, Jellyfin, Immich, File Browser + SMB, AdGuard Home, Tailscale, restic, Uptime Kuma, a chat bot, a custom web dashboard, Home Assistant and a local AI assistant (Ollama + Open WebUI).
- Key decisions, results, lessons learned and how the same approach applies to small offices and homes.

**Simulated console**
- Node cards with live-updating CPU, RAM, disk and temperature (simulated in the browser).
- Service health with response times, quick actions (run backup, pause ad blocking, wake the standby node, restart a service), backup history and alerts timeline.

Also: **guided tour** on first visit and **English / Spanish** switch.

## How it is built

- Plain HTML, CSS and JavaScript; the diagram is generated SVG. No external libraries.
- Nothing connects to the real infrastructure; the console is a simulation.
- Strict Content-Security-Policy on the page.
