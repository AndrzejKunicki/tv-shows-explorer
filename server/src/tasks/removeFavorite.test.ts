import { beforeEach, describe, expect, it } from 'vitest';
import { makeShow } from '#src/api/testShows.ts';
import { favoriteStorage } from '#src/storage/favorite.ts';
import { removeFavorite } from './removeFavorite.ts';

describe('removeFavorite', () => {
  beforeEach(() => {
    favoriteStorage.clear();
  });

  it('removes the show from the favorites', () => {
    favoriteStorage.save(makeShow(1, []), 1000);
    favoriteStorage.save(makeShow(2, []), 1000);

    removeFavorite(1);

    expect(favoriteStorage.list().map((entry) => entry.show.id)).toEqual([2]);
  });

  it('changes nothing for a show that is not a favorite', () => {
    favoriteStorage.save(makeShow(1, []), 1000);

    removeFavorite(5);

    expect(favoriteStorage.list()).toHaveLength(1);
  });
});
