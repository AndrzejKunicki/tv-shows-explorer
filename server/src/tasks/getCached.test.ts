import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cacheStorage } from '#src/storage/cache.ts';
import { CACHE_TTL_MS, getCached } from './getCached.ts';

describe('getCached', () => {
  let time = 0;
  const now = () => time;

  beforeEach(() => {
    cacheStorage.clear();
    time = 1_000_000;
  });

  it('loads and caches the data on the first request', async () => {
    const load = vi.fn(async () => ['lost']);

    const data = await getCached('search:lost', load, now);

    expect(data).toEqual(['lost']);
    expect(load).toHaveBeenCalledTimes(1);
    expect(cacheStorage.get('search:lost')).toEqual({ data: ['lost'], savedAt: time });
  });

  it('returns the cached data for the same request within 5 minutes', async () => {
    const load = vi.fn(async () => ['lost']);
    await getCached('search:lost', load, now);

    time += CACHE_TTL_MS - 1;
    const data = await getCached('search:lost', load, now);

    expect(data).toEqual(['lost']);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('loads again and updates the cache once the data is 5 minutes old', async () => {
    const load = vi.fn().mockResolvedValueOnce(['old']).mockResolvedValueOnce(['new']);
    await getCached('search:lost', load, now);

    time += CACHE_TTL_MS;
    const data = await getCached('search:lost', load, now);

    expect(data).toEqual(['new']);
    expect(load).toHaveBeenCalledTimes(2);
    expect(cacheStorage.get('search:lost')).toEqual({ data: ['new'], savedAt: time });
  });

  it('caches different requests separately', async () => {
    const load = vi.fn(async () => []);

    await getCached('search:lost', load, now);
    await getCached('search:friends', load, now);

    expect(load).toHaveBeenCalledTimes(2);
  });

  it('does not cache a failed request', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(['lost']);

    await expect(getCached('search:lost', load, now)).rejects.toThrow('offline');
    const data = await getCached('search:lost', load, now);

    expect(data).toEqual(['lost']);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('drops expired entries of other requests when it saves new data', async () => {
    await getCached('search:old', async () => [], now);

    time += CACHE_TTL_MS + 1;
    await getCached('search:new', async () => [], now);

    expect(cacheStorage.get('search:old')).toBeUndefined();
  });
});
