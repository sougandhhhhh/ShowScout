# ShowScout

ShowScout is a Kerala-first cinema comparison experience: one movie, every nearby theatre, every price.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal. A production build can be created with `npm run build` and previewed with `npm run preview`.

In a second terminal, run `npm run dev:api` to start the Hono API on port 8787. Verify it with `http://localhost:8787/api/v1/health`. Use `npm run seed` to print a deterministic Kochi demo-data summary.

## What is working in this first release

- Premium, responsive homepage and comparison experience for Kochi.
- Movie rail with active movie selection.
- Search by theatre or area.
- Date, language, format, availability and verified-data filter controls.
- Best value, lowest price, nearest and earliest sorting controls.
- Cards, table-style control and interactive map-style view.
- Theatre cards with distance, ETA, ratings, formats, seat state, source and freshness.
- Show detail drawer with seat categories, screen/audio metadata and outbound booking disclosure.
- Theme toggle, favourite state, toasts, responsive mobile layout and demo-data transparency badge.

The current UI intentionally uses clearly labelled demo data. Live provider adapters, operator portal, authenticated API, persistent storage and real outbound booking integrations are the next product phase.

See [docs/PROGRESS.md](docs/PROGRESS.md) for the complete implemented/deferred checklist and [docs/API.md](docs/API.md) for the public API surface.

## Architecture and deployment

The Vite React frontend uses shared Zod contracts from `packages/shared`, demo/provider adapters from `packages/providers`, and scoring from `packages/scoring`. The Hono API is exported for both the Node development server (`apps/api/src/dev.ts`) and Cloudflare Workers (`apps/api/src/worker.ts`).

Live URL: configure `SHOWSCOUT_PUBLIC_URL` for deployment; `https://showscout.example` remains a safe placeholder until a domain is chosen.

| Variable | Purpose |
| --- | --- |
| `VITE` | Browser API base URL |
| `ALLOWED_ORIGINS` | Comma-separated API CORS allowlist |
| `TMDB_API_KEY` | Optional TMDB bearer credential |
| `SHOWSCOUT_PUBLIC_URL` | Public URL used by deployment tooling |

Run `npm run build` for the frontend and `npm run build:api` for the API. Deploy `dist` to a static host with SPA fallback and deploy the API with `wrangler deploy` after configuring the CORS allowlist and D1 bindings.
