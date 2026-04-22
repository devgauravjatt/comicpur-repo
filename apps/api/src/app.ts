import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from '@/index.js';
import checkEnv from './config/check-env.js';
import appEnv, { isDevelopment } from './config/env.js';

// check environment variables with zod
checkEnv();

if (isDevelopment) {
	serve(
		{
			fetch: app.fetch,
			port: appEnv.PORT,
		},
		(info) => {
			if (isDevelopment) {
				console.info(`Server is running on http://localhost:${info.port}`);
			}
		},
	);
}

export default app;
export type AppType = typeof app;
