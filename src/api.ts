import type { Movie, Region, Theatre } from '@showscout/shared';

const baseUrl = (import.meta.env.VITE as string | undefined)?.replace(/\/$/, '') ?? '/api/v1';

export type CompareResponse = {
  data: { movie: Movie; region: Region; theatres: Array<Theatre & { valueScore: number }> };
  meta?: { dataQuality: string; source: string; lastUpdatedAt: string };
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { accept: 'application/json', ...init?.headers } });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const getCompare = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)]));
  return request<CompareResponse>(`/compare?${query}`);
};
export const getMovies = () => request<{ data: Movie[] }>('/movies');
export const getTheatres = () => request<{ data: Theatre[] }>('/theatres');
export const getSuggestions = (query: string) => request<{ data: Array<{ type: string; title: string; slug: string }> }>(`/search/suggest?q=${encodeURIComponent(query)}`);
