import type { Region, Theatre } from '@showscout/shared';
import { MovieSchema, TheatreSchema } from '@showscout/shared';

const updated = new Date(Date.now() - 4 * 60_000).toISOString();
export const demoRegion: Region = { id: 'reg-kochi', state: 'Kerala', district: 'Ernakulam', city: 'Kochi', slug: 'kochi', lat: 9.9312, lng: 76.2673, isActive: true };
export const demoMovies = [
  MovieSchema.parse({ id: 'mov-rekhachithram', title: 'Rekhachithram', slug: 'rekhachithram', synopsis: 'A mystery unfolds through a forgotten reel and the stories hidden inside it.', runtimeMinutes: 138, certification: 'UA', languages: ['Malayalam'], genres: ['Drama', 'Mystery'], status: 'now_showing', dataQuality: 'demo', source: 'demo', lastUpdatedAt: updated }),
  MovieSchema.parse({ id: 'mov-bhoothaddam', title: 'Bhoothaddam Bhaskar Narayana', slug: 'bhoothaddam-bhaskar-narayana', synopsis: 'A sharp-eyed investigator follows a trail that no one else can see.', runtimeMinutes: 122, certification: 'UA', languages: ['Malayalam'], genres: ['Mystery', 'Thriller'], status: 'now_showing', dataQuality: 'demo', source: 'demo', lastUpdatedAt: updated }),
];
export function createDemoTheatres(): Theatre[] {
  const names = ['PVR Lulu Mall', 'Cinepolis Centre Square', 'Shenoys Theatre', 'Vanitha Vineetha', 'Sangeetha Cinemas', 'Aashirvad Cineplexx'];
  return names.map((name, index) => TheatreSchema.parse({ id: `thr-${index + 1}`, name, slug: name.toLowerCase().replaceAll(' ', '-'), address: `${index % 2 ? 'MG Road' : 'Edappally'}, Kochi, Kerala`, regionId: demoRegion.id, lat: demoRegion.lat + index * 0.006, lng: demoRegion.lng + index * 0.005, rating: 4.1 + (index % 5) / 10, formats: index % 2 ? ['2D', 'Dolby Atmos'] : ['2D', 'Laser projection'], facilities: ['Parking', 'F&B', index % 2 ? 'Wheelchair access' : 'Recliner'], verified: index !== 2, dataQuality: 'demo', source: 'demo', lastUpdatedAt: updated, shows: [10, 13, 16, 19].map((hour, showIndex) => ({ id: `show-${index}-${showIndex}`, movieId: demoMovies[0].id, theatreId: `thr-${index + 1}`, startsAt: new Date(new Date().setHours(hour, 15, 0, 0)).toISOString(), format: index % 2 ? '2D' : 'Laser projection', language: 'Malayalam', status: showIndex === 3 ? 'fast_filling' : 'selling', priceFromPaise: (120 + index * 20 + showIndex * 10) * 100, availableSeats: 24 + ((index + 1) * 13) % 70, source: 'demo', lastUpdatedAt: updated, dataQuality: 'demo' })) }));
}
