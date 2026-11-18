# Free-tier budget

The local demo has no paid dependency and runs entirely from seeded data.

| Resource | Intended free option | Guardrail |
| --- | --- | --- |
| Frontend | Cloudflare Pages | Static build; no server runtime required |
| API | Cloudflare Workers | Cache public reads and keep provider fetches scheduled |
| Database | Cloudflare D1 | Indexed reads, bounded compare queries, nightly export |
| Cache | Workers KV / Cache API | Short TTL for compare responses |
| Images | Committed optimized assets or R2 | Resize and cache posters |
| Email | Resend/Brevo free tier | Alerts are opt-in and rate-limited |
| Metadata | TMDB free API key | Cache and attribute every request |

Limits change over time. Re-check provider terms before launch and keep the demo adapter available as a safe fallback.
