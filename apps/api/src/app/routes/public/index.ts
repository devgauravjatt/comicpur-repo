import { Hono } from 'hono';
import type { Variables } from '@/types/auth.js';
import categoriesRouter from './categories.js';
import chaptersRouter from './chapters.js';
import comicsRouter from './comics.js';

const publicRouter = new Hono<{ Variables: Variables }>()
	.route('/categories', categoriesRouter)
	.route('/comics', comicsRouter)
	.route('/chapters', chaptersRouter);

export default publicRouter;
