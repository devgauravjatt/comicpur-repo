import { eq, sql } from 'drizzle-orm';
import type z from 'zod';
import { categoriesTable, comicsTable } from '@/app/schema/db/index.js';
import type {
	addCategoriesBodySchema,
	updateCategoriesBodySchema,
} from '@/app/schema/validate/req.js';
import db from '@/config/database.js';

type addCategoriesSchema = z.infer<typeof addCategoriesBodySchema>;
type updateCategoriesSchema = z.infer<typeof updateCategoriesBodySchema>;

export const CategoriesService = {
	// add categories
	addCategories: async (body: addCategoriesSchema) => {
		return await db.insert(categoriesTable).values(body);
	},
	updateCategories: async (body: updateCategoriesSchema) => {
		const updateData = Object.fromEntries(
			Object.entries({
				name: body.name,
				description: body.description,
				isAdult: body.isAdult,
				slug: body.slug,
			}).filter(([_, v]) => v !== undefined),
		);

		await db.update(categoriesTable).set(updateData).where(eq(categoriesTable.id, body.id));
	},
	// check if category is delete possible
	isDeletePossible: async (id: number) => {
		const result = await db
			.select({ count: sql<number>`cast(count(*) as int)` })
			.from(comicsTable)
			.where(sql`${id} = ANY(${comicsTable.categoryIds})`);
		const count = Number(result[0]?.count ?? 0);
		return count === 0;
	},
	// delete categories
	deleteCategories: async (id: number) => {
		return await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
	},
	getCategories: async (adult_allow?: boolean) => {
		if (adult_allow) {
			return await db.select().from(categoriesTable);
		}
		return await db.select().from(categoriesTable).where(eq(categoriesTable.isAdult, false));
	},
};
