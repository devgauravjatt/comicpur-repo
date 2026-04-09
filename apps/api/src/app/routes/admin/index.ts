import { Hono } from 'hono';
import { adminAuthMiddleware } from '@/app/middleware/auth.js';
import db from '@/config/database.js';
import appEnv from '@/config/env.js';
import type { Variables } from '@/types/auth.js';
import categoriesRouter from './categories.js';
import chaptersRouter from './chapters.js';
import comicsRouter from './comics.js';
import premiumRouter from './premium.js';

const adminRouter = new Hono<{ Variables: Variables }>()
	.use(adminAuthMiddleware)
	.route('/comics', comicsRouter)
	.route('/categories', categoriesRouter)
	.route('/chapters', chaptersRouter)
	.route('/premium', premiumRouter)
	.get('/check', async (c) => {
		const userId = c.get('user').userId;
		const admins = appEnv.ADMIN_IDS;

		const user = await db.query.usersTable.findFirst({
			where: (users, { eq }) => eq(users.id, userId),
		});

		if (!user || !admins.includes(user.id)) {
			return c.json({ success: false, access: false }, 403);
		}
		return c.json({ success: true, access: true });
	});

export default adminRouter;
