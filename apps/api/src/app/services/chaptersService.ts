import { and, asc, count, desc, eq } from 'drizzle-orm';
import type z from 'zod';
import { chaptersTable } from '@/app/schema/db/index.js';
import type { addChaptersBodySchema, updateChaptersBodySchema } from '@/app/schema/validate/req.js';
import db from '@/config/database.js';
import { ComicsService } from './comicsService.js';

type addChaptersSchema = z.infer<typeof addChaptersBodySchema>;
type updateChaptersSchema = z.infer<typeof updateChaptersBodySchema>;

export const ChaptersService = {
	// check if chapter number already exists for a comic
	async checkChapterNumberExists(comicId: number, chapterNumber: number) {
		const result = await db
			.select()
			.from(chaptersTable)
			.where(
				and(eq(chaptersTable.comicId, comicId), eq(chaptersTable.chapterNumber, chapterNumber)),
			);
		console.log('🚀 ~ result :- ', result.length);
		return result.length > 0;
	},
	// count chapters by comic id
	async countChaptersByComicId(comicId: number) {
		const result = await db
			.select({ count: count() })
			.from(chaptersTable)
			.where(eq(chaptersTable.comicId, comicId));
		return result[0].count;
	},
	// get last chapter number by comic id
	async lastChapterNumberByComicId(comicId: number) {
		const result = await db
			.select({ chapterNumber: chaptersTable.chapterNumber })
			.from(chaptersTable)
			.where(eq(chaptersTable.comicId, comicId))
			.orderBy(desc(chaptersTable.chapterNumber))
			.limit(1);
		return result[0].chapterNumber;
	},
	// add chapter
	async addChapter(body: addChaptersSchema) {
		try {
			const result = await db
				.insert(chaptersTable)
				.values(body)
				.onConflictDoNothing({
					target: [chaptersTable.comicId, chaptersTable.chapterNumber],
				})
				.returning();

			const inserted = result.length > 0;

			if (!inserted) return true;

			const count = await this.countChaptersByComicId(body.comicId);

			await ComicsService.updateComic({
				id: body.comicId,
				chaptersCount: count,
			});
			return false;
		} catch (error) {
			console.log('🚀 ~ error :- ', error);
			return false;
		}
	},
	// update chapter
	async updateChapter(body: updateChaptersSchema) {
		const updateData = Object.fromEntries(
			Object.entries({
				title: body.title,
				images: body.images,
			}).filter(([_, v]) => v !== undefined),
		);
		await db.update(chaptersTable).set(updateData).where(eq(chaptersTable.id, body.id));
	},
	// delete chapter
	async deleteChapter(id: number) {
		const res = await db.delete(chaptersTable).where(eq(chaptersTable.id, id)).returning();
		if (res.length > 0 && res[0].comicId) {
			const count = await this.countChaptersByComicId(res[0].comicId);
			await ComicsService.updateComic({
				id: res[0].comicId,
				chaptersCount: count,
			});
		}
	},
	// get chapters by comic id with pagination
	getChaptersByComicId: async (comicId: number, page: number) => {
		const ITEMS_PER_PAGE = 10;
		const offset = ITEMS_PER_PAGE * (page - 1);

		const [chapters, [{ count: itemsCount }]] = await Promise.all([
			db
				.select({
					id: chaptersTable.id,
					chapterNumber: chaptersTable.chapterNumber,
					title: chaptersTable.title,
				})
				.from(chaptersTable)
				.where(eq(chaptersTable.comicId, comicId))
				.orderBy(asc(chaptersTable.chapterNumber))
				.limit(ITEMS_PER_PAGE)
				.offset(offset),
			db.select({ count: count() }).from(chaptersTable).where(eq(chaptersTable.comicId, comicId)),
		]);

		return {
			chapters: chapters,
			totalPages: Math.ceil(itemsCount / ITEMS_PER_PAGE),
		};
	},
	readChapter: async (comicId: number, chapterId: number) => {
		const res = await db
			.select()
			.from(chaptersTable)
			.where(and(eq(chaptersTable.comicId, comicId), eq(chaptersTable.chapterNumber, chapterId)));

		return res[0];
	},
};
