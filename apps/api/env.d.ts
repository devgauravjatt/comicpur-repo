// environment.d.ts
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production' | 'test';
			DATABASE_URL: string;
			PORT: number;
			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;
			GOOGLE_REDIRECT_URI: string;
			JWT_SECRET: string;
			JWT_TIME: string;
			FRONTEND_REDIRECT_URL: string;
			ADMIN_IDS: string;
		}
	}
}
// Ensures the file is treated as a module
export {};
