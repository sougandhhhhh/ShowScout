# API reference

The local API runs at `http://localhost:8787/api/v1`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Health and service timestamp |
| GET | `/regions` | Active rollout regions |
| GET | `/movies` | Movie metadata list |
| GET | `/movies/:slug` | Movie detail |
| GET | `/theatres` | Theatre directory |
| GET | `/compare?movie=&region=&sort=` | Core theatre/show/price comparison |
| GET | `/formats` | Screen and audio glossary |
| GET | `/search/suggest?q=` | Movie/theatre typeahead |
| GET | `/theatres/:slug` | Theatre detail with schedule |
| GET | `/shows/:id` | Show, price breakdown, and seat-map placeholder |
| POST | `/feeds/:theatreId/shows` | Validated operator push feed |
| POST | `/community/reports` | Moderated community report submission |
| POST | `/alerts` | Register an opt-in availability/price/reminder alert |
| POST | `/operator/claims` | Queue a theatre claim for verification |
| GET | `/compare/stream` | Freshness SSE stream |
| GET | `/export.json` | Public demo open-data export |
| GET | `/admin/data-quality` | Provider health and coverage summary |
| GET | `/openapi.json` | Small machine-readable API outline |

The compare response includes the selected movie, region, theatres, `valueScore`, and response-level provenance. Each show includes `source`, `lastUpdatedAt`, and `dataQuality`. Production adapters should preserve those fields rather than hiding uncertainty.
