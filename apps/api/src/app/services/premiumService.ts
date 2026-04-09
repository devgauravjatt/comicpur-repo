import { and, eq } from 'drizzle-orm';
import type z from 'zod';
import { premiumTable } from '@/app/schema/db/index.js';
import type { addPremiumBodySchema } from '@/app/schema/validate/req.js';
import db from '@/config/database.js';
import dateHelper from '@/lib/dateHelper.js';

type AddPremiumBody = z.infer<typeof addPremiumBodySchema>;

export const premiumService = {
	/**
	 * Create premium subscription
	 * @param data - Premium subscription data
	 * @param userID - User ID
	 */
	async createPremiumSubscription(data: AddPremiumBody) {
		const user = await db.query.usersTable.findFirst({
			where: (users, { eq }) => eq(users.email, data.userMail),
		});
		if (!user) {
			throw new Error('User not found');
		}

		await db.insert(premiumTable).values({
			userId: user.id,
			payMode: data.payMode,
			amount: data.amount,
			expiryDate: dateHelper.getNextMonthDate(),
		});
	},

	/**
	 * Inactive premium subscription
	 * @param userMail - User mail
	 */
	async inactivePremiumSubscription(userMail: string) {
		const user = await db.query.usersTable.findFirst({
			where: (users, { eq }) => eq(users.email, userMail),
		});
		if (!user) {
			throw new Error('User not found');
		}
		// get premium subscription by user ID
		const result = await db.query.premiumTable.findFirst({
			where: and(eq(premiumTable.userId, user.id), eq(premiumTable.active, true)),
		});
		if (result) {
			await db.update(premiumTable).set({ active: false }).where(eq(premiumTable.id, result.id));
		}
	},

	/**
	 * Check premium subscription and inactive if expired
	 * @param userID - User ID
	 * @param userMail - User mail
	 * @returns True if premium subscription is active, false otherwise
	 */
	async checkPremiumSubscription(userID?: number, userMail?: string) {
		if (userID) {
			// get premium subscription by user ID
			const result = await db.query.premiumTable.findFirst({
				where: and(eq(premiumTable.userId, userID), eq(premiumTable.active, true)),
			});
			if (result) {
				// check if any of the subscription is expired
				const isExpired = result.expiryDate < new Date();
				if (isExpired) {
					await db
						.update(premiumTable)
						.set({ active: false })
						.where(eq(premiumTable.userId, userID));
					return false;
				}
				return true;
			}
		} else if (userMail) {
			// get premium subscription by user mail
			const user = await db.query.usersTable.findFirst({
				where: (users, { eq }) => eq(users.email, userMail),
			});
			if (!user) {
				throw new Error('User not found');
			}
			const result = await db.query.premiumTable.findFirst({
				where: and(eq(premiumTable.userId, user.id), eq(premiumTable.active, true)),
			});
			if (result) {
				// check if any of the subscription is expired
				const isExpired = result.expiryDate < new Date();
				if (isExpired) {
					await db
						.update(premiumTable)
						.set({ active: false })
						.where(eq(premiumTable.id, result.id));
					return false;
				}
				return true;
			}
		}
		return false;
	},
	async getPremiumSubscription(userID: number) {
		const result = await db.query.premiumTable.findFirst({
			where: and(eq(premiumTable.userId, userID), eq(premiumTable.active, true)),
		});
		if (result) {
			const isExpired = result.expiryDate < new Date();
			if (isExpired) {
				await db.delete(premiumTable).where(eq(premiumTable.id, result.id));
				return false;
			}
			return result;
		}
		return false;
	},
};
