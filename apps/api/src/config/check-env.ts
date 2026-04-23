import { z } from 'zod';
import appEnv from './env.js';

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	PORT: z.coerce.number().default(3001),
	DATABASE_URL: z.string().min(10, 'DATABASE_URL must be short'),
	JWT_SECRET: z.string().min(10, 'JWT_SECRET must be short'),
	GOOGLE_CLIENT_ID: z.string().min(10, 'GOOGLE_CLIENT_ID must be short'),
	GOOGLE_CLIENT_SECRET: z.string().min(10, 'GOOGLE_CLIENT_SECRET must be short'),
	GOOGLE_REDIRECT_URI: z.string().min(10, 'GOOGLE_REDIRECT_URI must be short'),
	JWT_TIME: z.string().min(2, 'JWT_TIME must be short'),
	FRONTEND_REDIRECT_URL: z.string().min(10, 'FRONTEND_REDIRECT_URL must be short'),
	ADMIN_IDS: z.array(z.coerce.number().min(1, 'ADMIN_IDS must be short')).default([]),
});

function checkEnv() {
	try {
		envSchema.parse({
			NODE_ENV: appEnv.NODE_ENV,
			PORT: appEnv.PORT,
			DATABASE_URL: appEnv.DATABASE_URL,
			JWT_SECRET: appEnv.JWT_SECRET,
			GOOGLE_CLIENT_ID: appEnv.GOOGLE_CLIENT_ID,
			GOOGLE_CLIENT_SECRET: appEnv.GOOGLE_CLIENT_SECRET,
			GOOGLE_REDIRECT_URI: appEnv.GOOGLE_REDIRECT_URI,
			JWT_TIME: appEnv.JWT_TIME,
			FRONTEND_REDIRECT_URL: appEnv.FRONTEND_REDIRECT_URL,
			ADMIN_IDS: appEnv.ADMIN_IDS,
		});
	} catch (error) {
		console.error('❌ Invalid environment variables');
		console.error(error);
		process.exit(1);
	}
}

export default checkEnv;
