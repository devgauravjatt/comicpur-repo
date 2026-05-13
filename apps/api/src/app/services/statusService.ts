import { eq } from 'drizzle-orm';
import db from '@/config/database.js';
import { comicsTable, premiumTable, usersTable } from '../schema/db/index.js';

const statusService = {
	forHome: async () => {
		const totalUsers = await db.$count(usersTable);
		const totalPremiumUsers = await db.$count(premiumTable, eq(premiumTable.active, true));
		const totalComics = await db.$count(comicsTable);

		return {
			totalUsers,
			totalPremiumUsers,
			totalComics,
		};
	},
};

export default statusService;
