import z from 'zod';

/**
 * Schema for validating the request body of the /auth/check endpoint.
 */
export const authCheckBodySchema = z.object({
	accessToken: z.string(),
});

// Schema for validating the request body of the /admin/premium POST endpoint.
export const addPremiumBodySchema = z.object({
	userMail: z.email().includes('@gmail.com', 'user mail is not valid'),
	payMode: z.string(),
	amount: z
		.number()
		.positive('Amount must be positive')
		.refine(
			(amount) => {
				if (amount < 49 || amount > 999) {
					return false;
				}
				return true;
			},
			{ message: 'Amount must be between ₹49-₹999' },
		),
});

// Schema for validating the request body of the /admin/comics POST endpoint.
export const addComicBodySchema = z.object({
	title: z.string().min(10, 'Title is required to be at least 10 characters long'),
	description: z.string().min(10, 'Description is required to be at least 10 characters long'),
	coverImage: z.string().min(11, 'Cover image is required to be a valid URL').url(),
	published: z.boolean().default(false),
	languageCode: z.string().min(2, 'Language code is required to be at least 2 characters long'),
	isAdult: z.boolean().default(false),
	slug: z.string().min(10, 'Slug is required to be at least 10 characters long'),
	categoryIds: z
		.array(z.number().int().positive('Category ID is required to be a valid ID'))
		.min(1, 'Category ID is required to be at least 1'),
});

// Schema for validating the request body of the /admin/comics PUT endpoint.
export const updateComicBodySchema = z
	.object({
		id: z.number().int().positive('ID is required to be a valid ID'),
		title: z.string().min(10, 'Title is required to be at least 10 characters long').optional(),
		description: z
			.string()
			.min(10, 'Description is required to be at least 10 characters long')
			.optional(),
		coverImage: z.string().min(11, 'Cover image is required to be a valid URL').url().optional(),
		published: z.boolean().optional(),
		languageCode: z
			.string()
			.min(2, 'Language code is required to be at least 2 characters long')
			.optional(),
		isAdult: z.boolean().optional(),
		slug: z.string().min(10, 'Slug is required to be at least 10 characters long').optional(),
		categoryIds: z
			.array(z.number().int().positive('Category ID is required to be a valid ID'))
			.min(1, 'Category ID is required to be at least 1')
			.optional(),
	})
	.refine(
		(data) => {
			const defined = Object.entries(data).filter(([, v]) => v !== undefined);
			return defined.length > 1; // id is always present, so we need > 1
		},
		{
			message: 'At least one field must be provided',
		},
	);

// Schema for validating the request body of the /admin/categories POST endpoint.
export const addCategoriesBodySchema = z.object({
	name: z.string().min(10, 'Name is required to be at least 10 characters long'),
	description: z.string().min(10, 'Description is required to be at least 10 characters long'),
	slug: z.string().min(10, 'Slug is required to be at least 10 characters long'),
	isAdult: z.boolean().default(false),
});

// Schema for validating the request body of the /admin/categories PUT endpoint.
export const updateCategoriesBodySchema = z
	.object({
		id: z.number().int().positive('ID is required to be a valid ID'),
		name: z.string().min(10, 'Name is required to be at least 10 characters long').optional(),
		description: z
			.string()
			.min(10, 'Description is required to be at least 10 characters long')
			.optional(),
		slug: z.string().min(10, 'Slug is required to be at least 10 characters long').optional(),
		isAdult: z.boolean().optional(),
	})
	.refine(
		(data) => {
			const defined = Object.entries(data).filter(([, v]) => v !== undefined);
			return defined.length > 1; // id is always present, so we need > 1
		},
		{
			message: 'At least one field must be provided',
		},
	);

// Schema for validating the request body of the /admin/chapters POST endpoint.
export const addChaptersBodySchema = z.object({
	title: z.string().min(5, 'Title is required to be at least 10 characters long'),
	comicId: z.number().int().positive('Comic ID is required to be a valid ID'),
	chapterNumber: z.number().int().positive('Chapter number is required to be a valid number'),
	images: z.array(z.string().min(11, 'Image is required to be a valid URL').url()),
});

// Schema for validating the request body of the /admin/chapters PUT endpoint.
export const updateChaptersBodySchema = z
	.object({
		id: z.number().int().positive('ID is required to be a valid ID'),
		title: z.string().min(5, 'Title is required to be at least 10 characters long').optional(),
		images: z.array(z.string().min(11, 'Image is required to be a valid URL').url()).optional(),
	})
	.refine(
		(data) => {
			const defined = Object.entries(data).filter(([, v]) => v !== undefined);
			return defined.length > 1; // id is always present, so we need > 1
		},
		{
			// chapterNumber and images are optional, so we need > 1
			message: 'At least one field must be provided',
		},
	);
