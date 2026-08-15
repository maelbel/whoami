# Portfolio

Mael Belliard's portfolio — built with [Nuxt](https://nuxt.com) and [Nuxt UI](https://ui.nuxt.com).

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Production

```bash
pnpm build
pnpm preview
```

## CI/CD

- **`.github/workflows/ci.yml`** — lint + typecheck on every push.
- **`.github/workflows/release.yml`** — on pushing a tag matching `v*.*.*`, builds the site,
  deploys it to Vercel, and publishes a GitHub Release with auto-generated notes and the
  deployment URL.

To cut a release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

### One-time setup for the release workflow

1. Create a project on [Vercel](https://vercel.com) linked to this repo (or run `vercel link`
   locally once).
2. Add these repo secrets under **Settings → Secrets and variables → Actions**:
   - `VERCEL_TOKEN` — from [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` — found in `.vercel/project.json` after running
     `vercel link`

See [ROADMAP.md](./ROADMAP.md) for planned features.
