import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { premiumTable, usersTable } from '@/app/schema/db/index.js';
import appEnv from './env.js';

const globalForDb = globalThis as unknown as {
	pool?: Pool;
};

const pool =
	globalForDb.pool ??
	new Pool({
		connectionString: appEnv.DATABASE_URL,
		max: 2,
	});

if (process.env.NODE_ENV !== 'production') {
	globalForDb.pool = pool;
}

const db = drizzle(pool, {
	schema: {
		usersTable,
		premiumTable,
	},
});

export default db;
