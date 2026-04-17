import { Hono } from 'hono';
import z from 'zod';
import { addPremiumBodySchema } from '@/app/schema/validate/req.js';
import { premiumService } from '@/app/services/premiumService.js';
import { reqValidator } from '@/lib/reqValidator.js';
import type { Variables } from '@/types/auth.js';

const premiumRouter = new Hono<{ Variables: Variables }>()

	.get(
		'/',
		reqValidator(
			'query',
			z.object({
				userMail: z.string().optional(),
				active: z
					.enum(['true', 'false'])
					.transform((val) => val === 'true')
					.optional(),
				page: z.coerce.number().optional(),
			}),
		),
		async (c) => {
			const query = c.req.valid('query');
			const subscriptions = await premiumService.getPremiumSubscriptions({
				active: query.active,
				userMail: query.userMail,
				page: query.page,
			});
			return c.json({
				success: true,
				data: subscriptions,
			});
		},
	)

	.post('/', reqValidator('json', addPremiumBodySchema), async (c) => {
		const body = c.req.valid('json');

		const isPremium = await premiumService.checkPremiumSubscription(undefined, body.userMail);
		if (isPremium) {
			return c.json({ success: false, error: 'Premium subscription already exists' }, 400);
		}
		await premiumService.createPremiumSubscription(body);

		return c.json({
			success: true,
			message: 'Premium subscription created successfully',
		});
	})

	.put(
		'/',
		reqValidator(
			'json',
			z.object({
				id: z.coerce.number('id is number required'),
				active: z.boolean('active is required'),
			}),
		),
		async (c) => {
			const body = c.req.valid('json');

			if (body.active) {
				await premiumService.reActivePremiumSubscription(body.id);
				return c.json({
					success: true,
					message: 'Premium subscription reactivated successfully',
				});
			} else {
				await premiumService.inactivePremiumSubscription(body.id);
				return c.json({
					success: true,
					message: 'Premium subscription inactive successfully',
				});
			}
		},
	);

export default premiumRouter;
