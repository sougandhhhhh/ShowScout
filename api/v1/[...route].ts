import { handle } from 'hono/vercel';
import app from '../../server/api-app.js';

export default handle(app);
