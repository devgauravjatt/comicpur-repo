import type { HTTPResponseError } from 'hono/types';
import '@/lib/instrument.js';
import * as Sentry from '@sentry/node';

// biome-ignore lint/suspicious/noExplicitAny: <for error catching>
export default function errorCatch(err: Error | HTTPResponseError, value: any) {
	Sentry.captureException(err, value);
}
