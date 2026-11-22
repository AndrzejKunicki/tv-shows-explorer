import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { scheduleRouter } from '#src/routes/schedule.ts';
import { showsRouter } from '#src/routes/shows.ts';

/** Turns a failed TVmaze request (or any other error) into a JSON 502 response. */
const handleError = (error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : 'Unknown error';

  response.status(502).json({ error: message });
};

/** The HTTP app: middleware and routes. The port is chosen by `index.ts`. */
export const createApp = () => {
  const app = express();

  // In production only the client domain (GitHub Pages) may call the API; locally any origin
  app.use(cors({ origin: process.env.CORS_ORIGIN ?? true }));

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });
  app.use('/api/shows', showsRouter);
  app.use('/api/schedule', scheduleRouter);
  app.use(handleError);

  return app;
};
