import { Hono } from 'hono';
import { ChaptersService } from '@/app/services/chaptersService.js';
import type { Variables } from '@/types/auth.js';

const chaptersRouter = new Hono<{ Variables: Variables }>().get('/', async (c) => {
	const comicId = c.req.query('comicId');
	const page = c.req.query('page');

	if (!comicId || !page) {
		return c.json({ success: false, error: 'Missing required parameters' }, 400);
	}

	const data = await ChaptersService.getChaptersByComicId(Number(comicId), Number(page));
	return c.json({
		success: true,
		data,
	});
});

export default chaptersRouter;
