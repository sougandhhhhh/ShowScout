import type { Theatre } from '@showscout/shared';

export function valueScore(theatre: Theatre): number {
  const cheapest = theatre.shows.length ? Math.min(...theatre.shows.map((show) => show.priceFromPaise)) : 60000;
  const price = 1 - cheapest / 60000;
  const quality = theatre.formats.some((format) => /imax|dolby|4dx|laser/i.test(format)) ? 1 : 0.65;
  const availability = theatre.shows.reduce((sum, show) => sum + (show.availableSeats ?? 0), 0) / Math.max(1, theatre.shows.length * 100);
  const ageHours = Math.max(0, (Date.now() - new Date(theatre.lastUpdatedAt).getTime()) / 3_600_000);
  const freshness = theatre.dataQuality === 'demo' ? 0.75 : Math.max(0, theatre.dataQuality === 'live' ? 1 : 0.85 - Math.min(ageHours / 240, 0.75));
  return Math.round((price * 0.4 + quality * 0.25 + Math.min(availability, 1) * 0.2 + freshness * 0.15) * 100);
}

export function sortTheatres(theatres: Theatre[], sort: string, origin?: { lat: number; lng: number }): Theatre[] {
  const cheapest = (theatre: Theatre) => theatre.shows.length ? Math.min(...theatre.shows.map((show) => show.priceFromPaise)) : Number.POSITIVE_INFINITY;
  const availability = (theatre: Theatre) => theatre.shows.reduce((sum, show) => sum + (show.availableSeats ?? 0), 0);
  const earliest = (theatre: Theatre) => theatre.shows.length ? Math.min(...theatre.shows.map((show) => new Date(show.startsAt).getTime())) : Number.POSITIVE_INFINITY;
  const distance = (theatre: Theatre) => origin ? Math.hypot(theatre.lat - origin.lat, theatre.lng - origin.lng) : Number.POSITIVE_INFINITY;
  return [...theatres].sort((a, b) => sort === 'lowest_price' ? cheapest(a) - cheapest(b) : sort === 'most_available' ? availability(b) - availability(a) : sort === 'earliest' ? earliest(a) - earliest(b) : sort === 'nearest' ? distance(a) - distance(b) : valueScore(b) - valueScore(a));
}
