import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import adminRouter from './admin/index.js';
import authRouter from './auth/index.js';
import publicRouter from './public/index.js';
import userRouter from './user/index.js';

const appRouter = new Hono()
	.basePath('/api/v1')

	.get('/', (c) => {
		return c.json({ success: true, message: 'Welcome to the ComicPur API' });
	})

	.route('/auth', authRouter)
	.route('/public', publicRouter)
	.use('*', authMiddleware)
	.route('/user', userRouter)
	.route('/admin', adminRouter);

export default appRouter;
