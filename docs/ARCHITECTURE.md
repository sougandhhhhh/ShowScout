# ShowScout architecture

ShowScout is designed as a static React frontend plus a small edge-friendly API. The current repository keeps the frontend at the root for the simplest local workflow, while the API and domain packages live under `apps/` and `packages/` so they can be split into independent workspaces without changing the product model.

```mermaid
flowchart LR
  Web[React + Vite web] --> API[Hono API /api/v1]
  API --> Providers[Provider adapters]
  Providers --> Demo[Demo adapter]
  Providers --> OSM[OSM directory]
  Providers --> TMDB[TMDB metadata]
  Providers --> Operator[Operator portal feed]
  API --> DB[(D1 / SQLite)]
  API --> Cache[(KV / Cache API)]
```

All public records carry source, last-updated time, and data quality. The demo provider is deterministic and is the default until authorized data sources are connected.
