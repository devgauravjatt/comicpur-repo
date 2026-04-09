import { boolean, date, integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	googleId: text('google_id').unique(),
	name: varchar().notNull(),
	email: varchar().notNull().unique(),
	avatar: text('avatar').notNull(),
});

export const premiumTable = pgTable('premium', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: integer('user_id').notNull(),
	payMode: varchar('pay_mode').notNull(),
	amount: integer().notNull(),
	active: boolean('active').default(true).notNull(),
	expiryDate: date('expiry_date', { mode: 'date' }).notNull(),
});

export const categoriesTable = pgTable('categories', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	isAdult: boolean('is_adult').default(false).notNull(),
	description: text('description').notNull(),
});

export const comicsTable = pgTable('comics', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description').notNull(),
	coverImage: text('cover_image').notNull(),
	published: boolean('published').default(false).notNull(),
	chaptersCount: integer('chapters_count').default(0).notNull(),
	languageCode: text('language_code').notNull(),
	isAdult: boolean('is_adult').default(false).notNull(),
	categoryId: integer('category_id')
		.references(() => categoriesTable.id)
		.notNull(),
	createdAt: date('created_at', { mode: 'date' }).defaultNow().notNull(),
	updatedAt: date('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const chaptersTable = pgTable('chapters', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	comicId: integer('comic_id')
		.references(() => comicsTable.id)
		.notNull(),
	chapterNumber: integer('chapter_number').notNull(),
	title: text('title').notNull(),
	images: text('images').array().notNull(),
});

export const userDailyReadsTable = pgTable('user_daily_reads', {
	id: serial('id').primaryKey(),
	userId: integer('user_id').notNull(),
	chapterId: integer('chapter_id').notNull(),
	readDate: date('read_date', { mode: 'date' }).notNull(),
});
