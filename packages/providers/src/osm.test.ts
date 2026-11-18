import { describe, expect, it, vi } from 'vitest';
import { fetchOsmCinemas } from './osm';
import { demoRegion } from './demo';

describe('OSM provider', () => {
  it('marks directory records correctly and skips invalid records', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ elements: [
      { id: 1, lat: 9.9, lon: 76.2, tags: { name: 'Cinema One', 'addr:street': 'MG Road' } },
      { id: 2, tags: {} },
    ] }), { status: 200 }));
    const theatres = await fetchOsmCinemas(demoRegion, fetcher);
    expect(theatres).toHaveLength(1);
    expect(theatres[0].dataQuality).toBe('directory');
    expect(fetcher.mock.calls[0][1]?.headers).toMatchObject({ 'user-agent': expect.stringContaining('ShowScout') });
  });
});
