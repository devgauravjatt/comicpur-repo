import 'dotenv/config';
import jwt, { type SignOptions } from 'jsonwebtoken';
import appEnv from '@/config/env.js';

const ACCESS_SECRET = appEnv.JWT_SECRET;
const TOKEN_TIME = appEnv.JWT_TIME as SignOptions['expiresIn'];

export const tokenService = {
	/**
	 * Create access token
	 * @param userId - User ID
	 * @returns Access token
	 */
	createAccessToken(userId: number) {
		const num = Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, '0');

		const id = userId.toString() + num;
		return jwt.sign({ userId: Number(id) }, ACCESS_SECRET, { expiresIn: TOKEN_TIME });
	},
	/**
	 * Create refresh token
	 * @param userId - User ID
	 * @returns Refresh token
	 */
	createRefreshToken(userId: number) {
		const num = Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, '0');

		const id = userId.toString() + num;
		return jwt.sign({ userId: Number(id) }, ACCESS_SECRET, { expiresIn: TOKEN_TIME });
	},

	/**
	 * Verify access token
	 * @param token - Access token
	 * @returns Decoded token
	 */
	verifyAccess(token: string) {
		return jwt.verify(token, ACCESS_SECRET);
	},

	/**
	 * Verify refresh token
	 * @param token - Refresh token
	 * @returns Decoded token
	 */
	verifyRefresh(token: string) {
		return jwt.verify(token, ACCESS_SECRET);
	},
};
