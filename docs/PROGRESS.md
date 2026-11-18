# Delivery progress

## Phase 0 — Foundation

- [x] Vite React public web experience
- [x] Workspace-ready packages for shared contracts, scoring, and providers
- [x] Strict TypeScript configuration
- [x] Deterministic Kochi demo dataset and seed command
- [x] Hono API with health, movies, theatres, compare, formats, and OpenAPI outline
- [x] Demo provenance and freshness contract
- [x] CI, PWA, SEO, and deployment scaffolding

## Phase 1 — Core data and API

- [x] Shared Zod schemas
- [x] Value scoring and sort engine
- [x] Provider registry with demo, OSM, TMDB, booking stub boundaries
- [x] `/compare` response
- [x] Theatre detail, show detail, search suggestions, operator feed, community report endpoints
- [x] OSM Overpass and TMDB adapter implementations with safe empty-key behavior
- [x] D1/SQLite starter schema and seed SQL
- [x] Freshness SSE endpoint, open-data export, data-quality dashboard endpoint, outbound redirect boundary
- [x] Operator signup/login/session boundary and CSV import validation boundary
- [ ] D1 migrations and persistent ingestion runs
- [ ] Real OSM/TMDB credentials and scheduled jobs

## Phase 2 — Public web MVP

- [x] Home and compare experience
- [x] Cards, table control, and map-style view
- [x] Show detail drawer
- [x] Source/freshness/demo transparency UI
- [x] Theme toggle and mobile layout
- [x] Operator portal, format guide, and data-transparency pages
- [x] Public movie/theatre/about directory routes
- [x] API-backed browser compare with demo fallback
- [x] Alerts, privacy, terms, and offline routes
- [ ] Full route-level React Router pages
- [ ] Live API query wiring in the browser

## Later phases

Operator auth/claims, persistent CSV storage, alerts, booking partnerships, advanced map tiles, full Malayalam locale, analytics, and production monitoring remain intentionally staged. The community-report endpoint and operator-feed validation boundary are present; persistence/moderation UI is still staged. No scraping is present.
