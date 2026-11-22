import { fetchShow, TvmazeError } from '#src/api/tvmaze.ts';
import type { Show } from '#src/api/types.ts';
import { favoriteStorage } from '#src/storage/favorite.ts';
import { getCached } from './getCached.ts';

export type AddFavoriteResult = { ok: true; show: Show } | { ok: false; error: 'not-found' };

/**
 * Adds the show to the favorites by its id. The server takes the show data from TVmaze itself (through
 * the cache), so the client cannot store made-up data. Adding a favorite again changes nothing.
 */
export const addFavorite = async (id: number, now: () => number = Date.now): Promise<AddFavoriteResult> => {
  const existing = favoriteStorage.find(id);
  if (existing) {
    return { ok: true, show: existing.show };
  }

  try {
    const show = await getCached(`show:${id}`, () => fetchShow(id));
    favoriteStorage.save(show, now());

    return { ok: true, show };
  } catch (error) {
    // Other TVmaze errors are an outage, not a wrong id: the app answers them with 502
    if (error instanceof TvmazeError && error.status === 404) {
      return { ok: false, error: 'not-found' };
    }
    throw error;
  }
};
