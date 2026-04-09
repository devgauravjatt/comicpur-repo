import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import appEnv from '@/config/env.js';
import type { JwtPayload, Variables } from '@/types/auth.js';
import { tokenService } from '../services/tokenService.js';

export const authMiddleware = createMiddleware(
	async (c: Context<{ Variables: Variables }>, next) => {
		const token = c.req.header('Authorization')?.replace('Bearer ', '');

		if (!token) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		try {
			const user = tokenService.verifyAccess(token) as JwtPayload;
			const userFix = {
				userId: Number(user.userId.toString().slice(0, -4)),
			};
			c.set('user', userFix);
			await next();
		} catch {
			return c.json({ success: false, error: 'Invalid token' }, 401);
		}
	},
);

export const adminAuthMiddleware = createMiddleware(
	async (c: Context<{ Variables: Variables }>, next) => {
		const userId = c.get('user').userId;
		const admins = appEnv.ADMIN_IDS;

		if (!admins.includes(userId)) {
			return c.json({ success: false, error: 'Unauthorized' }, 401);
		}

		await next();
	},
);
