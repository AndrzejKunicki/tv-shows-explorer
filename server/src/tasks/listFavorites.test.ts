import { beforeEach, describe, expect, it } from 'vitest';
import { makeShow } from '#src/api/testShows.ts';
import { favoriteStorage } from '#src/storage/favorite.ts';
import { listFavorites } from './listFavorites.ts';

describe('listFavorites', () => {
  beforeEach(() => {
    favoriteStorage.clear();
  });

  it('returns the favorite shows, the most recently added first', () => {
    favoriteStorage.save(makeShow(1, []), 1000);
    favoriteStorage.save(makeShow(2, []), 3000);
    favoriteStorage.save(makeShow(3, []), 2000);

    expect(listFavorites().map((show) => show.id)).toEqual([2, 3, 1]);
  });

  it('returns an empty list without favorites', () => {
    expect(listFavorites()).toEqual([]);
  });
});
