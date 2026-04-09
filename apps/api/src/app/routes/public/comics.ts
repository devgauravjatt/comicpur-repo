import { Hono } from 'hono';
import z from 'zod';
import { ComicsService } from '@/app/services/comicsService.js';
import { reqValidator } from '@/lib/reqValidator.js';
import type { Variables } from '@/types/auth.js';

const comicsRouter = new Hono<{ Variables: Variables }>()
	.get('/home', async (c) => {
		const data = await ComicsService.ComicsForHome();
		return c.json({ success: true, data });
	})
	.get('/category', async (c) => {
		const slug = c.req.query('slug');
		const page = c.req.query('page');
		if (!slug || !page) {
			return c.json({ success: false, error: 'Slug and page is required' }, 400);
		}
		const data = await ComicsService.getComicsByCategorySlug(slug, Number(page));
		return c.json({ success: true, data: data });
	})
	.get('/', reqValidator('query', z.object({ slug: z.string() })), async (c) => {
		const { slug } = c.req.valid('query');

		const data = await ComicsService.getComicsBySlug(slug);
		return c.json({ success: true, data });
	});

export default comicsRouter;
