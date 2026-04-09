import { Hono } from 'hono';
import { addChaptersBodySchema, updateChaptersBodySchema } from '@/app/schema/validate/req.js';
import { ChaptersService } from '@/app/services/chaptersService.js';
import { reqValidator } from '@/lib/reqValidator.js';
import type { Variables } from '@/types/auth.js';

const chaptersRouter = new Hono<{ Variables: Variables }>();

chaptersRouter.get('/count/:comicId', async (c) => {
	const comicId = Number(c.req.param('comicId'));
	const chaptersCount = await ChaptersService.countChaptersByComicId(comicId);
	return c.json({ success: true, chaptersCount });
});

chaptersRouter.get('/count/last/:comicId', async (c) => {
	const comicId = Number(c.req.param('comicId'));
	const lastChapterNumber = await ChaptersService.lastChapterNumberByComicId(comicId);
	return c.json({ success: true, lastChapterNumber });
});

// add categories
chaptersRouter.post('/', reqValidator('json', addChaptersBodySchema, true), async (c) => {
	const body = c.req.valid('json');

	const chapterNumberIsExist = await ChaptersService.checkChapterNumberExists(
		body.comicId,
		body.chapterNumber,
	);
	if (chapterNumberIsExist) {
		return c.json({ success: false, error: 'Chapter number already exist' }, 400);
	}

	await ChaptersService.addChapter(body);

	return c.json({ success: true, message: 'Chapter added successfully' });
});

// update categories
chaptersRouter.put('/', reqValidator('json', updateChaptersBodySchema, true), async (c) => {
	const body = c.req.valid('json');

	await ChaptersService.updateChapter(body);

	return c.json({ success: true, message: 'Chapter updated successfully' });
});

// delete categories
chaptersRouter.delete('/:id', async (c) => {
	const id = Number(c.req.param('id'));

	await ChaptersService.deleteChapter(id);

	return c.json({ success: true, message: 'Chapter deleted successfully' });
});

export default chaptersRouter;
