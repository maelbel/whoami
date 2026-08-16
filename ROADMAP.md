# Roadmap

Ideas for future iterations, not yet implemented.

## Data-driven / live

- **Real CI badge** — pull Croesus's actual `ci.yml` run status via the GitHub Actions API
  instead of a static "passing" pill.
- **Repo stats ticker** — fetch stars / last-commit / open-issues for pinned repos at build
  time and render as compact stat tiles, so the projects section stays current with no
  manual upkeep.
- **"Now" panel** — a small widget showing the latest commit message + repo (via the GitHub
  events API) as a live status line instead of a static bio.

## Interactive

- **Typeable terminal hero** — swap the static `$ whoami` card for a minimal fake shell that
  accepts a few real commands (`whoami`, `skills`, `contact`, `sudo hire-me`).
- **`docker-compose.yml` peek on project cards** — an expandable, redacted snippet of the
  actual compose file / Traefik labels used to deploy that project.
- **Hidden `/root` route or Konami-code easter egg** — unlocks a changelog or blooper reel.

## Structural

- **Self-hosting architecture diagram** — a page documenting the real infra
  (Traefik → Docker → services).
- **Portfolio changelog page** — version the site itself (`v1.2.0 — added dark mode…`) and
  ship it through the same pipeline shown in the "How it ships" section.
- **JSON/YAML-sourced résumé** — one data file renders both the on-page résumé and a
  generated PDF, so they can't drift out of sync.

## Content gaps to fill in later

- `culina-backend` / `culina-frontend` / `cats` / `L3SPIInfo` — left out of the projects
  section for now; add once there's a clear one-line description for each.
