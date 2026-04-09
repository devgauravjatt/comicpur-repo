import { Hono } from 'hono';
import { premiumService } from '@/app/services/premiumService.js';
import db from '@/config/database.js';
import type { Variables } from '@/types/auth.js';
import chaptersReadRouter from './chapters.js';

const userRouter = new Hono<{ Variables: Variables }>()

	.get('/profile', async (c) => {
		const userId = c.get('user').userId;

		const result = await db.query.usersTable.findFirst({
			where: (users, { eq }) => eq(users.id, userId),
		});

		if (!result) {
			throw new Error('User not found');
		}

		return c.json({
			success: true,
			user: result,
		});
	})

	.get('/plan', async (c) => {
		const userId = c.get('user').userId;

		const result = await premiumService.getPremiumSubscription(userId);

		return c.json({
			success: true,
			premium: result,
		});
	})

	.get('/premium-check', async (c) => {
		const userId = c.get('user').userId;
		const result = await premiumService.checkPremiumSubscription(userId);

		return c.json({
			success: true,
			premium: result,
		});
	})
	.route('/read', chaptersReadRouter);
export default userRouter;
