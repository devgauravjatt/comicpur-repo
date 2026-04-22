import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/app/schema/db/index.ts',
	dialect: 'postgresql',
	dbCredentials: {
		ssl: true,
		url: process.env.DATABASE_URL,
	},
});
