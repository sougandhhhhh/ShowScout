# Data providers

## Current

- `demo`: deterministic Kochi/Ernakulam seed data. Every record is marked `demo` and the UI shows a `DEMO DATA` badge.
- `osm`: directory adapter boundary for public cinema locations. OSM attribution is required when the adapter is enabled.
- `tmdb`: metadata adapter boundary. Production use requires the owner to obtain a TMDB key and follow TMDB attribution/terms.
- `booking-provider-stub`: deep-link capability only. It contains no scraping or private API access.

## Rules

ShowScout never fabricates live availability, prices, or seats. A missing field renders as unavailable. BookMyShow and District are never scraped; an authorized partner API can be plugged into the adapter contract later.

The operator portal is the intended free route to live data: theatre owners can submit schedules, price tiers, and availability through a form, CSV paste, or an authenticated push feed.
