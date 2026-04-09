import { Hono } from 'hono';
import { CategoriesService } from '@/app/services/categoriesService.js';
import type { Variables } from '@/types/auth.js';

const categoriesRouter = new Hono<{ Variables: Variables }>().get('/', async (c) => {
	const adult_allow = c.req.query('adult_allow') === 'true';
	const categories = await CategoriesService.getCategories(adult_allow);
	return c.json({ success: true, categories });
});

export default categoriesRouter;
