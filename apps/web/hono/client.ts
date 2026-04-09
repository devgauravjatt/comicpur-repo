import { hc } from 'hono/client';
import appEnv from '@/envConfig';
import type { AppType } from './app.mjs';

const honoClient = hc<AppType>(appEnv.API_URL);

export default honoClient;
