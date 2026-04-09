import { logger } from 'hono/logger';

const customLogger = (message: string, ...rest: string[]) => {
	const now = new Date();
	const time = now.toLocaleTimeString('en-IN', { hour12: true });
	console.log(message, ...rest, time);
};
export const HonoLogger = () => logger(customLogger);
