import { and, count, desc, eq, sql } from 'drizzle-orm';
import type z from 'zod';
import { categoriesTable, chaptersTable, comicsTable } from '@/app/schema/db/index.js';
import type { addComicBodySchema, updateComicBodySchema } from '@/app/schema/validate/req.js';
import db from '@/config/database.js';

type addComicSchema = z.infer<typeof addComicBodySchema>;
type updateComicSchema = z.infer<typeof updateComicBodySchema> & {
	chaptersCount?: number;
};

export const ComicsService = {
	addComic: async (body: addComicSchema) => {
		await db.insert(comicsTable).values(body);
	},
	updateComic: async (body: updateComicSchema) => {
		const updateData = Object.fromEntries(
			Object.entries({
				title: body.title,
				description: body.description,
				coverImage: body.coverImage,
				published: body.published,
				languageCode: body.languageCode,
				isAdult: body.isAdult,
				slug: body.slug,
				categoryId: body.categoryId,
				updatedAt: new Date(),
				chaptersCount: body.chaptersCount,
			}).filter(([_, v]) => v !== undefined),
		);

		await db.update(comicsTable).set(updateData).where(eq(comicsTable.id, body.id));
	},
	// check if comic is delete possible
	isDeletePossible: async (id: number) => {
		const result = await db
			.select({ count: sql<number>`cast(count(*) as int)` })
			.from(chaptersTable)
			.where(eq(chaptersTable.comicId, id));
		const count = Number(result[0]?.count ?? 0);
		return count === 0;
	},
	// delete comic
	deleteComic: async (id: number) => {
		return await db.delete(comicsTable).where(eq(comicsTable.id, id));
	},
	// 5 - 5 comics for all categories
	ComicsForHome: async () => {
		const categories = await db.select().from(categoriesTable);

		const data = await Promise.all(
			categories.map(async (category) => {
				const comics = await db
					.select()
					.from(comicsTable)
					.where(and(eq(comicsTable.categoryId, category.id), eq(comicsTable.published, true)))
					.orderBy(desc(comicsTable.createdAt))
					.limit(6);

				if (comics.length === 0) return null;

				return {
					...category,
					comics,
				};
			}),
		);

		return data.filter((item) => item !== null);
	},
	// get by slug
	getComicsBySlug: async (slug: string) => {
		const data = await db
			.select({
				comic: comicsTable,
				categoryName: categoriesTable.name,
				categorySlug: categoriesTable.slug,
			})
			.from(comicsTable)
			.leftJoin(categoriesTable, eq(comicsTable.categoryId, categoriesTable.id))
			.where(eq(comicsTable.slug, slug));
		return data[0];
	},
	getComicsByCategorySlug: async (slug: string, page: number) => {
		const ITEMS_PER_PAGE = 10;
		const offset = ITEMS_PER_PAGE * (page - 1);

		const category = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, slug));

		const data = await db
			.select()
			.from(comicsTable)
			.where(eq(comicsTable.categoryId, category[0].id))
			.limit(ITEMS_PER_PAGE)
			.offset(offset);

		const [{ count: itemsCount }] = await db
			.select({ count: count() })
			.from(comicsTable)
			.where(eq(comicsTable.categoryId, category[0].id));
		return {
			comics: data,
			totalPages: Math.ceil(itemsCount / ITEMS_PER_PAGE),
		};
	},
};
