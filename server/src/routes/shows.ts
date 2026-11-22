import { Router } from 'express';
import { findShowsPage } from '#src/tasks/findShowsPage.ts';
import { parseSearchParams } from './queryParams.ts';

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
