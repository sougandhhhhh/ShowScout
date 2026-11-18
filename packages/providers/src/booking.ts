export type BookingProvider = 'bookmyshow' | 'district' | 'theatre_site' | 'other';
export function buildAuthorizedDeepLink(provider: BookingProvider, theatreSlug: string, movieSlug: string): string | null {
  if (provider === 'bookmyshow') return `https://in.bookmyshow.com/movies/${encodeURIComponent(movieSlug)}/buytickets/${encodeURIComponent(theatreSlug)}`;
  if (provider === 'district') return `https://www.district.in/movies/${encodeURIComponent(movieSlug)}`;
  return null;
}
