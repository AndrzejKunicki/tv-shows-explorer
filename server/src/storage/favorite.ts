import type { Show } from '#src/api/types.ts';

interface FavoriteEntry {
  show: Show;
  /** When the show was added (ms since epoch), for "newest first". */
  addedAt: number;
}

/** Favorite shows in server memory, one list for the whole server, keyed by show id. */
const favorite: Record<number, FavoriteEntry> = {};

/** Favorites as a small database: named reads and writes, no rules (see the favorites tasks). */
export const favoriteStorage = {
  list: (): FavoriteEntry[] => Object.values(favorite),
  find: (id: number): FavoriteEntry | undefined => favorite[id],
  save: (show: Show, addedAt: number) => {
    favorite[show.id] = { show, addedAt };
  },
  remove: (id: number) => {
    delete favorite[id];
  },
  clear: () => {
    for (const id of Object.keys(favorite)) {
      delete favorite[Number(id)];
    }
  },
};
