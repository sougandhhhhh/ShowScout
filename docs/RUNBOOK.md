# Runbook

## Local

1. `npm install`
2. `npm run seed`
3. `npm run dev` for the web app
4. `npm run dev:api` for the API on port 8787

## Health check

Open `http://localhost:8787/api/v1/health` and confirm `{ "ok": true }`.

## Deployment outline

Build the frontend with `npm run build`, deploy `dist/` to Cloudflare Pages, and deploy the Hono API to Workers using `wrangler.toml`. Add D1/KV/R2 bindings only after reviewing retention, backups, and provider terms.

## Incident defaults

If a provider fails or data becomes stale, keep the last known record with its freshness warning, stop presenting it as live, and fall back to demo/unavailable state. Never replace a missing price with an estimate.
