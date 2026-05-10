import { hc } from 'hono/client';
import appEnv from '@/envConfig';
import type { app } from './app.d.mts';

const honoClient = hc<typeof app>(appEnv.API_URL);

export default honoClient;
