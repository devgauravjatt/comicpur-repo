import { and, eq, lt, sql } from 'drizzle-orm';
import db from '@/config/database.js';
import dateHelper from '@/lib/dateHelper.js';
import { userDailyReadsTable } from '../schema/db/index.js';

const DEFAULT_LIMIT = 5;

export const readLimitService = {
	// 🧹 Cleanup old rows (keep only today)
	cleanupOldReads: async () => {
		const today = dateHelper.getTodayZeroHours();

		await db.delete(userDailyReadsTable).where(lt(userDailyReadsTable.readDate, today));
	},

	// 🔍 Get today's count
	getTodayCount: async (userId: number) => {
		const today = dateHelper.getTodayZeroHours();

		const [{ count }] = await db
			.select({ count: sql<number>`count(*)` })
			.from(userDailyReadsTable)
			.where(and(eq(userDailyReadsTable.userId, userId), eq(userDailyReadsTable.readDate, today)));

		return Number(count);
	},

	// 🔁 Check already read today
	alreadyReadToday: async (userId: number, chapterId: number) => {
		const today = dateHelper.getTodayZeroHours();

		const existing = await db
			.select()
			.from(userDailyReadsTable)
			.where(
				and(
					eq(userDailyReadsTable.userId, userId),
					eq(userDailyReadsTable.chapterId, chapterId),
					eq(userDailyReadsTable.readDate, today),
				),
			)
			.limit(1);

		return existing.length > 0;
	},

	// 🚀 MAIN FUNCTION (use this in API)
	checkLimitAndRead: async (userId: number, chapterId: number) => {
		const today = dateHelper.getTodayZeroHours();

		// 1️⃣ Cleanup (or move to cron for better performance)
		await readLimitService.cleanupOldReads();

		// 2️⃣ Already read → allow (no count)
		const alreadyRead = await readLimitService.alreadyReadToday(userId, chapterId);

		if (alreadyRead) {
			const count = await readLimitService.getTodayCount(userId);

			return {
				allowed: true,
				reason: 'already_read',
				remaining: Math.max(0, DEFAULT_LIMIT - count),
				waitTime: 0,
			};
		}

		// 3️⃣ Count today
		const count = await readLimitService.getTodayCount(userId);

		if (count >= DEFAULT_LIMIT) {
			return {
				allowed: false,
				reason: 'limit_reached',
				remaining: 0,
				waitTime: dateHelper.getWaitTimeNextMidnight(),
			};
		}

		// 4️⃣ Insert new read (race-safe)
		try {
			await db.insert(userDailyReadsTable).values({
				userId,
				chapterId,
				readDate: today,
			});
		} catch (_err) {
			// duplicate safe fallback
			return {
				allowed: true,
				reason: 'race_duplicate',
				remaining: Math.max(0, DEFAULT_LIMIT - count),
				waitTime: 0,
			};
		}

		return {
			allowed: true,
			reason: 'new_read',
			remaining: DEFAULT_LIMIT - (count + 1),
			waitTime: 0,
		};
	},
};
