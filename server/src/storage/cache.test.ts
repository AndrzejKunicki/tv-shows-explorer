import { cacheStorage } from './cache.ts';

describe('cacheStorage', () => {
  beforeEach(() => {
    cacheStorage.clear();
  });

  it('returns nothing for an unknown key', () => {
    expect(cacheStorage.get('search:lost')).toBeUndefined();
  });

  it('stores data with the time it was saved', () => {
    cacheStorage.set('search:lost', [1, 2], 1000);

    expect(cacheStorage.get('search:lost')).toEqual({ data: [1, 2], savedAt: 1000 });
  });

  it('replaces the data saved under the same key', () => {
    cacheStorage.set('search:lost', [1], 1000);
    cacheStorage.set('search:lost', [2], 2000);

    expect(cacheStorage.get('search:lost')).toEqual({ data: [2], savedAt: 2000 });
  });

  it('removes entries saved before the given time', () => {
    cacheStorage.set('old', 1, 1000);
    cacheStorage.set('new', 2, 3000);

    cacheStorage.removeOlderThan(2000);

    expect(cacheStorage.get('old')).toBeUndefined();
    expect(cacheStorage.get('new')).toEqual({ data: 2, savedAt: 3000 });
  });

  it('clears every entry', () => {
    cacheStorage.set('a', 1, 1000);

    cacheStorage.clear();

    expect(cacheStorage.get('a')).toBeUndefined();
  });
});
