import { Hono } from 'hono';
import { addPremiumBodySchema } from '@/app/schema/validate/req.js';
import { premiumService } from '@/app/services/premiumService.js';
import { reqValidator } from '@/lib/reqValidator.js';
import type { Variables } from '@/types/auth.js';

const premiumRouter = new Hono<{ Variables: Variables }>()

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

	.put('/', reqValidator('json', addPremiumBodySchema.pick({ userMail: true })), async (c) => {
		const body = c.req.valid('json');

		await premiumService.inactivePremiumSubscription(body.userMail);

		return c.json({
			success: true,
			message: 'Premium subscription inactive successfully',
		});
	});

export default premiumRouter;
