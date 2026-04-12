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
	.get(
		'/category',
		reqValidator(
			'query',
			z.object({
				slug: z.string(),
				page: z.coerce.number(),
			}),
		),
		async (c) => {
			const { slug, page } = c.req.valid('query');

			const data = await ComicsService.getComicsByCategorySlug(slug, page);
			return c.json({ success: true, data: data });
		},
	)
	.get('/', reqValidator('query', z.object({ slug: z.string() })), async (c) => {
		const { slug } = c.req.valid('query');

		const data = await ComicsService.getComicsBySlug(slug);
		return c.json({ success: true, data });
	});

export default comicsRouter;
