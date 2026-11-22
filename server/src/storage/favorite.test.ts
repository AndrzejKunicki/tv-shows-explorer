import { beforeEach, describe, expect, it } from 'vitest';
import { makeShow } from '#src/api/testShows.ts';
import { favoriteStorage } from './favorite.ts';

describe('favoriteStorage', () => {
  beforeEach(() => {
    favoriteStorage.clear();
  });

  it('is empty at first', () => {
    expect(favoriteStorage.list()).toEqual([]);
    expect(favoriteStorage.find(1)).toBeUndefined();
  });

  it('saves a show with the time it was added', () => {
    favoriteStorage.save(makeShow(1, []), 1000);

    expect(favoriteStorage.find(1)).toEqual({ show: makeShow(1, []), addedAt: 1000 });
    expect(favoriteStorage.list()).toHaveLength(1);
  });

  it('keeps one entry per show', () => {
    favoriteStorage.save(makeShow(1, []), 1000);
    favoriteStorage.save(makeShow(1, []), 2000);

    expect(favoriteStorage.list()).toEqual([{ show: makeShow(1, []), addedAt: 2000 }]);
  });

  it('removes a show and clears everything', () => {
    favoriteStorage.save(makeShow(1, []), 1000);
    favoriteStorage.save(makeShow(2, []), 1000);

    favoriteStorage.remove(1);

    expect(favoriteStorage.find(1)).toBeUndefined();

    favoriteStorage.clear();

    expect(favoriteStorage.list()).toEqual([]);
  });
});
