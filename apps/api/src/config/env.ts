import 'dotenv/config';

const appEnv = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	DATABASE_URL: process.env.DATABASE_URL,
	JWT_SECRET: process.env.JWT_SECRET,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
	JWT_TIME: process.env.JWT_TIME,
	FRONTEND_REDIRECT_URL: process.env.FRONTEND_REDIRECT_URL,
	ADMIN_IDS: process.env.ADMIN_IDS.split(',').map(Number),
};

export const isProduction = appEnv.NODE_ENV === 'production';
export const isDevelopment = appEnv.NODE_ENV === 'development';

export default appEnv;
