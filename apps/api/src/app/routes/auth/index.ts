import { googleAuth } from '@hono/oauth-providers/google';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { usersTable } from '@/app/schema/db/index.js';
import { authCheckBodySchema } from '@/app/schema/validate/req.js';
import { tokenService } from '@/app/services/tokenService.js';
import db from '@/config/database.js';
import appEnv from '@/config/env.js';
import { reqValidator } from '@/lib/reqValidator.js';
import type { Variables } from '@/types/auth.js';

const authRouter = new Hono<{ Variables: Variables }>()

	.use(
		'/google',
		googleAuth({
			client_id: appEnv.GOOGLE_CLIENT_ID,
			client_secret: appEnv.GOOGLE_CLIENT_SECRET,
			redirect_uri: appEnv.GOOGLE_REDIRECT_URI,
			scope: ['openid', 'email', 'profile'],
		}),
	)

	.get('/google', async (c) => {
		const user = c.get('user-google');

		if (!user) {
			return c.json({ success: false, error: 'failed to google auth' }, 500);
		}
		let user_id = 0;

		const [existingUser] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, user.email))
			.limit(1);

		if (existingUser) {
			user_id = existingUser.id;
		} else {
			const newUser = await db
				.insert(usersTable)
				.values({
					googleId: user.id,
					email: user.email,
					name: user.name,
					avatar: user.picture,
				})
				.returning();

			user_id = newUser[0].id;
		}

		const accessToken = tokenService.createAccessToken(user_id);

		return c.redirect(`${appEnv.FRONTEND_REDIRECT_URL}?token=${accessToken}`);
	})

	.post('/check', reqValidator('json', authCheckBodySchema), async (c) => {
		const body = c.req.valid('json');

		const isValid = tokenService.verifyAccess(body.accessToken);
		if (!isValid) {
			return c.json({ success: false, error: 'invalid access token' }, 401);
		}
		return c.json({ success: true, authenticated: true });
	});

export default authRouter;
