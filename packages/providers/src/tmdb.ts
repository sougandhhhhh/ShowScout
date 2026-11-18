import type { Movie, Region } from '../../shared/src/index';
import { MovieSchema } from '../../shared/src/index';

export async function fetchTmdbNowPlaying(region: Region, apiKey: string, fetcher: typeof fetch = fetch): Promise<Movie[]> {
  if (!apiKey) return [];
  const url = new URL('https://api.themoviedb.org/3/movie/now_playing');
  url.searchParams.set('region', 'IN');
  url.searchParams.set('language', 'en-IN');
  url.searchParams.set('api_key', apiKey);
  const response = await fetcher(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);
  const payload = await response.json() as { results?: Array<{ id: number; title: string; overview: string; release_date: string; poster_path?: string; popularity?: number; vote_average?: number; vote_count?: number }> };
  return (payload.results ?? []).flatMap((movie) => { try { const parsed = MovieSchema.safeParse({ id: `tmdb-${movie.id}`, title: movie.title, slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), synopsis: movie.overview || 'Not available', runtimeMinutes: null, certification: 'UA', languages: ['English'], genres: [], posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined, releaseDate: movie.release_date || undefined, popularity: movie.popularity ?? 0, voteAverage: movie.vote_average ?? 0, voteCount: movie.vote_count ?? 0, status: 'now_showing', dataQuality: 'live', source: 'tmdb', lastUpdatedAt: new Date().toISOString() }); return parsed.success ? [parsed.data] : []; } catch { return []; } }).sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0) || (b.voteAverage ?? 0) - (a.voteAverage ?? 0) || (b.releaseDate ?? '').localeCompare(a.releaseDate ?? ''));
}
