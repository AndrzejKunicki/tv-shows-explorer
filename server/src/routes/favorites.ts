import { Router, type Response } from 'express';
import { addFavorite } from '#src/tasks/addFavorite.ts';
import { listFavorites } from '#src/tasks/listFavorites.ts';
import { removeFavorite } from '#src/tasks/removeFavorite.ts';
import { parseInteger } from './queryParams.ts';

export const favoritesRouter = Router();

/** A show id is a whole number from 1; otherwise answers 400 and returns null. */
const readId = (value: string, response: Response) => {
  const id = parseInteger(value, 1, 0);
  if (!id) {
    response.status(400).json({ error: 'The show id must be a whole number from 1' });

    return null;
  }

  return id;
};

/** GET /api/favorites: all favorite shows, the most recently added first. */
favoritesRouter.get('/', (_request, response) => {
  response.json(listFavorites());
});

/** PUT /api/favorites/:id: adds the show and returns it (repeating it changes nothing). */
favoritesRouter.put('/:id', async (request, response) => {
  const id = readId(request.params.id, response);
  if (id === null) {
    return;
  }

  const result = await addFavorite(id);
  if (!result.ok) {
    response.status(404).json({ error: `Show ${id} was not found` });

    return;
  }

  response.json(result.show);
});

/** DELETE /api/favorites/:id: removes the show (repeating it changes nothing). */
favoritesRouter.delete('/:id', (request, response) => {
  const id = readId(request.params.id, response);
  if (id === null) {
    return;
  }

  removeFavorite(id);
  response.status(204).end();
});
