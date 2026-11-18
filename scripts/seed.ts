import { createDemoTheatres, demoMovies, demoRegion } from '@showscout/providers/demo';
const theatres = createDemoTheatres();
console.log(JSON.stringify({ seededAt: new Date().toISOString(), regions: 1, movies: demoMovies.length, theatres: theatres.length, screens: theatres.length * 2, shows: theatres.reduce((sum, theatre) => sum + theatre.shows.length, 0), dataQuality: 'demo' }, null, 2));
