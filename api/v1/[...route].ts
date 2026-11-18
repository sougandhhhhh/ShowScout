import { handle } from 'hono/vercel';
import app from '../../apps/api/src/index.ts';

export default handle(app);
