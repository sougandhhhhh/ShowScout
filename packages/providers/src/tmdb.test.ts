import { describe, expect, it, vi } from 'vitest';
import { fetchTmdbNowPlaying } from './tmdb';
import { demoRegion } from './demo';

describe('TMDB provider', () => {
  it('uses bearer auth and skips invalid records', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ results: [
      { id: 1, title: 'Valid', overview: 'Overview', release_date: '2026-01-01', poster_path: null },
      { id: 2, title: null, overview: '', release_date: '', poster_path: null } as any,
    ] }), { status: 200 }));
    const movies = await fetchTmdbNowPlaying(demoRegion, 'secret', fetcher);
    expect(fetcher.mock.calls[0][1]?.headers).toEqual({ Authorization: 'Bearer secret' });
    expect(movies).toHaveLength(1);
    expect(movies[0].runtimeMinutes).toBeNull();
  });
});
