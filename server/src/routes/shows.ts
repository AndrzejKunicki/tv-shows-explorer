import { Router } from 'express';
import { findShowsPage } from '#src/tasks/findShowsPage.ts';
import { getShowIndex } from '#src/tasks/getShowIndex.ts';
import { parseInteger, parseSearchParams } from './queryParams.ts';

export const showsRouter = Router();

/** GET /api/shows/search?q=lost&genre=Drama&sort=rating&page=2: one page of filtered, sorted results. */
showsRouter.get('/search', async (request, response) => {
  const params = parseSearchParams(request.query);
  if (!params.ok) {
    response.status(400).json({ error: params.error });

    return;
  }

  const page = await findShowsPage(params.value);
  response.json(page);
});

/** GET /api/shows/index?page=0: one page of the TVMaze show index. */
showsRouter.get('/index', async (request, response) => {
  const page = parseInteger(request.query.page, 0, 0);
  if (page === null) {
    response.status(400).json({ error: 'The "page" parameter must be a whole number from 0' });

    return;
  }

  const shows = await getShowIndex(page);
  response.json(shows);
});
