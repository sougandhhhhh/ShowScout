import type { Theatre } from '@showscout/shared';

export function valueScore(theatre: Theatre): number {
  const cheapest = Math.min(...theatre.shows.map((show) => show.priceFromPaise), 60000);
  const price = 1 - cheapest / 60000;
  const quality = theatre.formats.some((format) => /imax|dolby|4dx|laser/i.test(format)) ? 1 : 0.65;
  const availability = theatre.shows.reduce((sum, show) => sum + (show.availableSeats ?? 0), 0) / Math.max(1, theatre.shows.length * 100);
  const freshness = theatre.dataQuality === 'demo' ? 0.75 : theatre.dataQuality === 'live' ? 1 : 0.85;
  return Math.round((price * 0.4 + quality * 0.25 + Math.min(availability, 1) * 0.2 + freshness * 0.15) * 100);
}

export function sortTheatres(theatres: Theatre[], sort: string): Theatre[] {
  return [...theatres].sort((a, b) => sort === 'lowest_price' ? a.shows[0].priceFromPaise - b.shows[0].priceFromPaise : sort === 'most_available' ? (b.shows[0].availableSeats ?? 0) - (a.shows[0].availableSeats ?? 0) : valueScore(b) - valueScore(a));
}
