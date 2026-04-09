import { Hono } from 'hono';
import z from 'zod';
import { ChaptersService } from '@/app/services/chaptersService.js';
import { ComicsService } from '@/app/services/comicsService.js';
import { premiumService } from '@/app/services/premiumService.js';
import { readLimitService } from '@/app/services/readLimitService.js';
import { reqValidator } from '@/lib/reqValidator.js';
import type { Variables } from '@/types/auth.js';

const chaptersReadRouter = new Hono<{ Variables: Variables }>().get(
	'/chapter',
	reqValidator(
		'query',
		z.object({
			comic: z.string('comic slug must be required'),
			chap: z.coerce.number('chapter id must be a number'),
		}),
	),
	async (c) => {
		const { comic, chap } = c.req.valid('query');
		const userId = c.get('user').userId;

		if (!comic || !chap) {
			return c.json({ success: false, error: 'Missing required parameters' }, 400);
		}

		const comicId = await (await ComicsService.getComicsBySlug(comic)).comic.id;
		if (!comicId) {
			return c.json({ success: false, error: 'Comic not found' }, 404);
		}
		const chapter = await ChaptersService.readChapter(comicId, chap);
		if (!chapter) {
			return c.json({ success: false, error: 'Chapter not found' }, 404);
		}
		const isPro = await premiumService.checkPremiumSubscription(userId);

		if (isPro) {
			return c.json({ success: true, data: chapter });
		}

		const limit = await readLimitService.checkLimitAndRead(userId, chap);

		if (limit.allowed) {
			return c.json({ success: true, data: chapter, limitInfo: limit });
		}
		return c.json({ success: true, limitInfo: limit });
	},
);

export default chaptersReadRouter;
