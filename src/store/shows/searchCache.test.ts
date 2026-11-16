import { describe, expect, it } from 'vitest';
import { addToCache, CACHE_LIMIT, findCachedResults, toCacheKey, type CachedSearch } from './searchCache';
import { makeShow, testShows } from './testShows';

describe('toCacheKey', () => {
  it('ignores surrounding spaces and letter case', () => {
    expect(toCacheKey('  Breaking BAD ')).toBe('breaking bad');
  });
});

describe('findCachedResults', () => {
  const cache: CachedSearch[] = [
    { key: 'banana', shows: testShows },
    { key: 'murder', shows: [] },
  ];

  it('returns exact hit', () => {
    expect(findCachedResults(cache, 'banana')).toBe(testShows);
  });

  it('returns cached empty result for the same query', () => {
    expect(findCachedResults(cache, 'murder')).toEqual([]);
  });

  it('returns null when a request is needed', () => {
    expect(findCachedResults(cache, 'banan')).toBeNull();
    expect(findCachedResults(cache, 'bananas')).toBeNull();
    expect(findCachedResults(cache, 'constructor')).toBeNull();
  });
});

describe('addToCache', () => {
  it('appends a new response without changing the given cache', () => {
    const cache: CachedSearch[] = [{ key: 'a', shows: [] }];

    const next = addToCache(cache, 'b', testShows);

    expect(next).toEqual([
      { key: 'a', shows: [] },
      { key: 'b', shows: testShows },
    ]);
    expect(cache).toHaveLength(1);
  });

  it('replaces a response for the same key and moves it to the end', () => {
    const cache: CachedSearch[] = [
      { key: 'a', shows: [] },
      { key: 'b', shows: [] },
    ];

    const next = addToCache(cache, 'a', testShows);

    expect(next.map((cached) => cached.key)).toEqual(['b', 'a']);
    expect(findCachedResults(next, 'a')).toBe(testShows);
  });

  it('drops the oldest responses above the limit', () => {
    let cache: CachedSearch[] = [];
    for (let index = 0; index <= CACHE_LIMIT; index++) {
      cache = addToCache(cache, `q${index}`, [makeShow(index, [])]);
    }

    expect(cache).toHaveLength(CACHE_LIMIT);
    expect(findCachedResults(cache, 'q0')).toBeNull();
    expect(findCachedResults(cache, `q${CACHE_LIMIT}`)).not.toBeNull();
  });
});
