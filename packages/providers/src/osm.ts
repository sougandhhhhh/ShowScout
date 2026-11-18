import type { Region, Theatre } from '@showscout/shared';
import { TheatreSchema } from '@showscout/shared';

type OsmElement = { id: number; lat?: number; lon?: number; tags?: Record<string, string> };
export async function fetchOsmCinemas(region: Region, fetcher: typeof fetch = fetch): Promise<Theatre[]> {
  const query = `[out:json][timeout:20];nwr[amenity=cinema](${region.lat - 0.35},${region.lng - 0.35},${region.lat + 0.35},${region.lng + 0.35});out center tags;`;
  const response = await fetcher('https://overpass-api.de/api/interpreter', { method: 'POST', body: query, headers: { 'content-type': 'text/plain' } });
  if (!response.ok) throw new Error(`OSM Overpass failed: ${response.status}`);
  const payload = await response.json() as { elements?: OsmElement[] };
  return (payload.elements ?? []).filter((element) => element.tags?.name).map((element) => TheatreSchema.parse({ id: `osm-${element.id}`, name: element.tags!.name, slug: element.tags!.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), address: element.tags!['addr:street'] ?? 'Kochi, Kerala', regionId: region.id, lat: element.lat ?? region.lat, lng: element.lon ?? region.lng, rating: 0, formats: [], facilities: [], verified: false, dataQuality: 'live', source: 'openstreetmap', lastUpdatedAt: new Date().toISOString(), shows: [] }));
}
