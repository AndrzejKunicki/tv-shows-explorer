import { Router } from 'express';
import { getAiringToday } from '#src/tasks/getAiringToday.ts';
import { getHiddenGems } from '#src/tasks/getHiddenGems.ts';
import { getTopRated } from '#src/tasks/getTopRated.ts';

/** Ready-made rows for the start page: the server decides which shows and in what order. */
export const discoverRouter = Router();

/** GET /api/discover/airing-today: shows airing today on US TV, most popular first. */
discoverRouter.get('/airing-today', async (_request, response) => {
  response.json(await getAiringToday());
});

/** GET /api/discover/top-rated: the highest rated well known shows. */
discoverRouter.get('/top-rated', async (_request, response) => {
  response.json(await getTopRated());
});

/** GET /api/discover/hidden-gems: well rated, less known shows (different on every request). */
discoverRouter.get('/hidden-gems', async (_request, response) => {
  response.json(await getHiddenGems());
});
