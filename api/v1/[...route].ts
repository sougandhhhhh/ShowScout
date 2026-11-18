import { handle } from 'hono/vercel';
import app from '../../apps/api/src/index';

export default handle(app);
