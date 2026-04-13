import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from '@/routes.js';
import checkEnv from './config/check-env.js';
import appEnv from './config/env.js';

// check environment variables with zod
checkEnv();

serve(
	{
		fetch: app.fetch,
		port: appEnv.PORT,
	},
	(info) => {
		console.info(`Server is running on http://localhost:${info.port}`);
	},
);

export type AppType = typeof app;
