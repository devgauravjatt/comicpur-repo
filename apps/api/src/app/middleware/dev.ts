import { some } from 'hono/combine';
import { createMiddleware } from 'hono/factory';
import { HonoLogger } from './logger.js';

const isDev = createMiddleware(async (_c, next) => {
	if (process.env.NODE_ENV === 'development') {
		await next();
	} else {
		// In non-development, still need to continue the chain
		await next();
	}
});

export const devMiddleware = some(isDev, HonoLogger());
