import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export function errorRes(code: ContentfulStatusCode, message: string) {
	return new HTTPException(code, {
		res: new Response(JSON.stringify({ success: false, message }), {
			headers: {
				'Content-Type': 'application/json',
			},
		}),
		message: message,
	});
}
