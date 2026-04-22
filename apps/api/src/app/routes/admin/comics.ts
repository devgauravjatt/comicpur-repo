import { Hono } from 'hono';
import { addComicBodySchema, updateComicBodySchema } from '@/app/schema/validate/req.js';
import { ComicsService } from '@/app/services/comicsService.js';
import isPgError from '@/lib/pgError.js';
import { reqValidator } from '@/lib/reqValidator.js';
import type { Variables } from '@/types/auth.js';

const comicsRouter = new Hono<{ Variables: Variables }>()
	.post('/', reqValidator('json', addComicBodySchema, true), async (c) => {
		const body = c.req.valid('json');
		try {
			await ComicsService.addComic(body);
		} catch (err) {
			if (isPgError.code(err, '23505')) {
				return c.json({ success: false, error: 'Comic with this slug already exist' }, 400);
			}
			throw err;
		}
		return c.json({ success: true, message: 'Comic added successfully' });
	})

	.put('/', reqValidator('json', updateComicBodySchema, true), async (c) => {
		const body = c.req.valid('json');
		try {
			await ComicsService.updateComic(body);
		} catch (err) {
			if (isPgError.code(err, '23505')) {
				return c.json({ success: false, error: 'Comic with this slug already exist' }, 400);
			}
			throw err;
		}
		return c.json({ success: true, message: 'Comic updated successfully' });
	})

	// delete comics
	.delete('/:id', async (c) => {
		const id = Number(c.req.param('id'));

		try {
			const isDeletePossible = await ComicsService.isDeletePossible(id);
			if (!isDeletePossible) {
				return c.json({ success: false, error: 'Comic is associated with chapters' }, 400);
			}
			await ComicsService.deleteComic(id);
		} catch (error) {
			if (isPgError.code(error, '23503')) {
				return c.json({ success: false, error: 'Comic is associated with chapters' }, 400);
			}
			throw error;
		}

		return c.json({ success: true, message: 'Comic deleted successfully' });
	});

export default comicsRouter;
