import { Hono } from 'hono';
import { addChaptersBodySchema, updateChaptersBodySchema } from '@/app/schema/validate/req.js';
import { ChaptersService } from '@/app/services/chaptersService.js';
import { reqValidator } from '@/lib/reqValidator.js';
import type { Variables } from '@/types/auth.js';

const chaptersRouter = new Hono<{ Variables: Variables }>()
	.get('/count/:comicId', async (c) => {
		const comicId = Number(c.req.param('comicId'));
		const chaptersCount = await ChaptersService.countChaptersByComicId(comicId);
		return c.json({ success: true, chaptersCount });
	})
	.get('/count/last/:comicId', async (c) => {
		const comicId = Number(c.req.param('comicId'));
		const lastChapterNumber = await ChaptersService.lastChapterNumberByComicId(comicId);
		return c.json({ success: true, lastChapterNumber });
	})

	.post('/', reqValidator('json', addChaptersBodySchema, true), async (c) => {
		const body = c.req.valid('json');

		const chapterNumberIsExist = await ChaptersService.addChapter(body);

		if (chapterNumberIsExist) {
			return c.json({ success: false, error: 'Chapter number already exist' }, 400);
		}

		return c.json({ success: true, message: 'Chapter added successfully' });
	})

	.put('/', reqValidator('json', updateChaptersBodySchema, true), async (c) => {
		const body = c.req.valid('json');

		await ChaptersService.updateChapter(body);

		return c.json({ success: true, message: 'Chapter updated successfully' });
	})

	.delete('/:id', async (c) => {
		const id = Number(c.req.param('id'));

		await ChaptersService.deleteChapter(id);

		return c.json({ success: true, message: 'Chapter deleted successfully' });
	});

export default chaptersRouter;
