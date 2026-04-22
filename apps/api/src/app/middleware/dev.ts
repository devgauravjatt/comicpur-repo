import { some } from 'hono/combine';
import { createMiddleware } from 'hono/factory';
import { HonoLogger } from './logger.js';

const isDev = createMiddleware(async (_c, next) => {
	if (process.env.NODE_ENV === 'development') {
		return next();
	}
});

export const devMiddleware = some(isDev, HonoLogger());
