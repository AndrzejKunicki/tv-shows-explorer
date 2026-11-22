import type { Show } from '#src/api/types.ts';
import { favoriteStorage } from '#src/storage/favorite.ts';

/** All favorite shows, the most recently added first. */
export const listFavorites = (): Show[] => {
  const entries = favoriteStorage.list().sort((a, b) => b.addedAt - a.addedAt);
  const shows = entries.map((entry) => entry.show);

  return shows;
};
