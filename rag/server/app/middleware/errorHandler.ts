import { Context } from 'egg';

export default function errorHandlerMiddleware(): (ctx: Context, next: () => Promise<void>) => Promise<void> {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (err) {
      const error = err as Error & { status?: number };
      ctx.logger.error('Unhandled error:', error);

      ctx.status = error.status || 500;
      ctx.body = {
        error: error.message || 'Internal Server Error',
      };
    }
  };
}
