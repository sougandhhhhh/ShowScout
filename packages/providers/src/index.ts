import type { Movie, Region, Theatre } from '../../shared/src/index';

export type ProviderCapability = 'movies' | 'theatres' | 'screens' | 'shows' | 'prices' | 'seatMap' | 'liveAvailability' | 'bookingLinks';
export interface CinemaProvider { key: string; name: string; kind: 'demo' | 'osm' | 'tmdb' | 'operator_portal' | 'booking_stub' | 'community'; capabilities: ProviderCapability[]; fetchMovies?(region: Region): Promise<Movie[]>; fetchTheatres?(region: Region): Promise<Theatre[]>; }

export const bookingProviderStub: CinemaProvider = { key: 'booking-provider-stub', name: 'Authorized booking deep-link stub', kind: 'booking_stub', capabilities: ['bookingLinks'] };
export const osmDirectoryProvider: CinemaProvider = { key: 'osm', name: 'OpenStreetMap cinema directory', kind: 'osm', capabilities: ['theatres'] };
export const tmdbMetadataProvider: CinemaProvider = { key: 'tmdb', name: 'TMDB metadata adapter', kind: 'tmdb', capabilities: ['movies'] };

export const providerRegistry = [osmDirectoryProvider, tmdbMetadataProvider, bookingProviderStub];
export { fetchOsmCinemas } from './osm';
export { fetchTmdbNowPlaying } from './tmdb';
export { buildAuthorizedDeepLink } from './booking';
