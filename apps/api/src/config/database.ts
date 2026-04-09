import { drizzle } from 'drizzle-orm/node-postgres';
import { premiumTable, usersTable } from '@/app/schema/db/index.js';
import appEnv from './env.js';

const db = drizzle(appEnv.DATABASE_URL, {
	schema: {
		usersTable,
		premiumTable,
	},
});

export default db;
