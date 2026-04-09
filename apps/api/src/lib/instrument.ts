// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from '@sentry/node';

Sentry.init({
	dsn: 'https://0129e6c40d645257d3fe00aebeac29a9@o4511132625076224.ingest.de.sentry.io/4511132628484176',
	// Setting this option to true will send default PII data to Sentry.
	// For example, automatic IP address collection on events
	sendDefaultPii: true,
});
