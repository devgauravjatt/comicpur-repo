import type { HTTPResponseError } from 'hono/types';
import '@/lib/instrument.js';
import * as Sentry from '@sentry/node';
import { logger } from 'rslog';

// biome-ignore lint/suspicious/noExplicitAny: <for error catching>
export default function errorCatch(err: Error | HTTPResponseError, value: any) {
	logger.error(err);
	Sentry.captureException(err, value);
}
