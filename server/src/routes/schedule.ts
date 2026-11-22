import { Router } from 'express';
import { getTodayShows } from '#src/tasks/getTodayShows.ts';

export const scheduleRouter = Router();

/** GET /api/schedule?country=US: shows with an episode airing today. */
scheduleRouter.get('/', async (request, response) => {
  const country = typeof request.query.country === 'string' ? request.query.country.toUpperCase() : 'US';
  if (!/^[A-Z]{2}$/.test(country)) {
    response.status(400).json({ error: 'The "country" parameter must be a two-letter code' });

    return;
  }

  const shows = await getTodayShows(country);
  response.json(shows);
});
