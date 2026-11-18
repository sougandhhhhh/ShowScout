import type { Movie, Region } from '../../shared/src/index';
import { MovieSchema } from '../../shared/src/index';

export async function fetchTmdbNowPlaying(region: Region, apiKey: string, fetcher: typeof fetch = fetch): Promise<Movie[]> {
  if (!apiKey) return [];
  const response = await fetcher('https://api.themoviedb.org/3/movie/now_playing?region=IN&language=en-IN', { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);
  const payload = await response.json() as { results?: Array<{ id: number; title: string; overview: string; release_date: string; poster_path?: string }> };
  return (payload.results ?? []).flatMap((movie) => { try { const parsed = MovieSchema.safeParse({ id: `tmdb-${movie.id}`, title: movie.title, slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), synopsis: movie.overview || 'Not available', runtimeMinutes: null, certification: 'UA', languages: ['English'], genres: [], posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined, status: 'now_showing', dataQuality: 'live', source: 'tmdb', lastUpdatedAt: new Date().toISOString() }); return parsed.success ? [parsed.data] : []; } catch { return []; } });
}
