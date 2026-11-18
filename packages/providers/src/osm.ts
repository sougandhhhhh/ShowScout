import type { Region, Theatre } from '@showscout/shared';
import { TheatreSchema } from '@showscout/shared';

type OsmElement = { id: number; lat?: number; lon?: number; tags?: Record<string, string> };
export async function fetchOsmCinemas(region: Region, fetcher: typeof fetch = fetch): Promise<Theatre[]> {
  const query = `[out:json][timeout:20];nwr[amenity=cinema](${region.lat - 0.35},${region.lng - 0.35},${region.lat + 0.35},${region.lng + 0.35});out center tags;`;
  const response = await fetcher('https://overpass-api.de/api/interpreter', { method: 'POST', body: query, headers: { 'content-type': 'text/plain', 'user-agent': 'ShowScout/0.1 (cinema directory; contact via repository)' } });
  if (!response.ok) throw new Error(`OSM Overpass failed: ${response.status}`);
  const payload = await response.json() as { elements?: OsmElement[] };
  return (payload.elements ?? []).flatMap((element) => { const tags = element.tags; if (!tags?.name) return []; const parsed = TheatreSchema.safeParse({ id: `osm-${element.id}`, name: tags.name, slug: tags.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), address: tags['addr:street'] ?? tags['addr:city'] ?? 'Address not provided', regionId: region.id, lat: element.lat ?? region.lat, lng: element.lon ?? region.lng, rating: 0, formats: [], facilities: [], verified: false, dataQuality: 'directory', source: 'openstreetmap', lastUpdatedAt: new Date().toISOString(), shows: [] }); return parsed.success ? [parsed.data] : []; });
}
