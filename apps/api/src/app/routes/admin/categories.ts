import { Hono } from 'hono';
import { addCategoriesBodySchema, updateCategoriesBodySchema } from '@/app/schema/validate/req.js';
import { CategoriesService } from '@/app/services/categoriesService.js';
import isPgError from '@/lib/pgError.js';
import { reqValidator } from '@/lib/reqValidator.js';
import type { Variables } from '@/types/auth.js';

const categoriesRouter = new Hono<{ Variables: Variables }>()

	.post('/', reqValidator('json', addCategoriesBodySchema, true), async (c) => {
		const body = c.req.valid('json');
		try {
			await CategoriesService.addCategories(body);
		} catch (error) {
			if (isPgError.code(error, '23505')) {
				return c.json({ success: false, error: 'Categories name|slug already exist' }, 400);
			}
			throw error;
		}

		return c.json({ success: true, message: 'Categories added successfully' });
	})
	.put('/', reqValidator('json', updateCategoriesBodySchema, true), async (c) => {
		const body = c.req.valid('json');
		try {
			await CategoriesService.updateCategories(body);
		} catch (err) {
			if (isPgError.code(err, '23505')) {
				return c.json({ success: false, error: 'Categories name|slug already exist' }, 400);
			}
			throw err;
		}
		return c.json({ success: true, message: 'Categories updated successfully' });
	})
	.delete('/:id', async (c) => {
		const id = Number(c.req.param('id'));

		try {
			await CategoriesService.deleteCategories(id);
		} catch (error) {
			if (isPgError.code(error, '23503')) {
				return c.json({ success: false, error: 'Categories is associated with comics' }, 400);
			}
			throw error;
		}

		return c.json({ success: true, message: 'Categories deleted successfully' });
	});

export default categoriesRouter;
