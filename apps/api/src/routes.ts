import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { poweredBy } from 'hono/powered-by';
import appRouter from '@/app/routes/routes.js';
import { HonoLogger } from './app/middleware/logger.js';
import errorCatch from './lib/errorCatch.js';

const app = new Hono()
	.use(poweredBy())
	.use(HonoLogger())

	.get('/', (c) => {
		return c.json({ success: true, apiVersion: 'v1', path: '/api/v1' });
	})

	.route('/', appRouter)

	.notFound((c) => {
		return c.json(
			{
				success: false,
				message: 'The requested resource was not found.',
			},
			404,
		);
	})

	.onError(async (err, c) => {
		const reqData = {
			headers: c.req.header(),
			method: c.req.method,
			url: c.req.url,
			body: await c.req.text(),
		};
		errorCatch(err, reqData);
		if (err instanceof HTTPException) {
			return err.getResponse();
		}
		return c.json(
			{
				success: false,
				message: 'Something went wrong. Please try again later.',
			},
			500,
		);
	});

export default app;
