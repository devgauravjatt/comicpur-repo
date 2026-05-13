import { Hono } from 'hono';
import statusService from '@/app/services/statusService.js';
import type { Variables } from '@/types/auth.js';

const statusRouter = new Hono<{ Variables: Variables }>().get('/', async (c) => {
	const stats = await statusService.forHome();
	return c.json({
		success: true,
		data: stats,
	});
});

export default statusRouter;
