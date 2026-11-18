# Decisions

## ADR-001: Demo-first launch data

The first runnable release uses a deterministic demo adapter so the product can be reviewed without scraping or secret API keys. This keeps the data contract honest and makes local development repeatable.

## ADR-002: Booking links are outbound only

ShowScout redirects to authorized providers and does not sell tickets or iframe booking flows. This reduces data and compliance risk while preserving the comparison value.

## ADR-003: Monorepo foundation with a simple root web command

The public web app remains at the root for a one-command local start. Domain contracts, scoring, providers, and the API are workspace-ready under `packages/` and `apps/`.
