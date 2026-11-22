import { favoriteStorage } from '#src/storage/favorite.ts';

/** Removes the show from the favorites. Removing a show that is not there changes nothing. */
export const removeFavorite = (id: number) => {
  favoriteStorage.remove(id);
};
