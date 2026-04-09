import { sValidator as sv } from '@hono/standard-validator';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { ValidationTargets } from 'hono/types';
import type * as z from 'zod';
import appEnv from '@/config/env.js';

type FailedResponseIssue = readonly StandardSchemaV1.Issue[];

function mapZodErrors(issues: FailedResponseIssue) {
	// biome-ignore lint/suspicious/noExplicitAny: <reason>
	const fieldErrors: Record<string, any> = {};

	issues.forEach((err) => {
		const path = err.path || [];
		if (path.length === 0) return;

		const message = err.message || 'Invalid input';

		// Build nested object structure
		let current = fieldErrors;
		for (let i = 0; i < path.length; i++) {
			const key = String(path[i]);

			// If this is the last path segment, assign the error message
			if (i === path.length - 1) {
				current[key] = message;
			} else {
				// Otherwise, create nested object if it doesn't exist
				if (!current[key]) {
					current[key] = {};
				}
				current = current[key];
			}
		}
	});

	return fieldErrors;
}

export const reqValidator = <T extends z.ZodSchema, Target extends keyof ValidationTargets>(
	target: Target,
	schema: T,
	errorMap?: boolean,
) => {
	const error_map = appEnv.NODE_ENV === 'development';

	if (errorMap || error_map) {
		return sv(target, schema, (result, c) => {
			if (!result.success) {
				const fieldErrors = mapZodErrors(result.error);

				// if fieldErrors is empty, then return a generic error message
				if (Object.keys(fieldErrors).length === 0) {
					return c.json({ success: false, error: 'Invalid request!' }, 400);
				}

				return c.json({ success: false, errors: fieldErrors }, 400);
			}
		});
	} else {
		return sv(target, schema, (result, c) => {
			if (!result.success) {
				return c.json({ success: false, error: 'Invalid request!' }, 400);
			}
		});
	}
};
