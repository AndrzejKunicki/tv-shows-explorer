import { cacheStorage } from '#src/storage/cache.ts';

/** How long a TVmaze response is reused before it is fetched again. */
export const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Returns the data cached under `key` if it was fetched less than 5 minutes ago; otherwise calls `load`
 * (a TVmaze request) and caches the fresh data. A failed request is not cached.
 */
export const getCached = async <T>(key: string, load: () => Promise<T>, now: () => number = Date.now): Promise<T> => {
  const entry = cacheStorage.get(key);
  const isFresh = entry !== undefined && now() - entry.savedAt < CACHE_TTL_MS;
  if (isFresh) {
    return entry.data as T;
  }

  const data = await load();
  const savedAt = now();
  cacheStorage.removeOlderThan(savedAt - CACHE_TTL_MS);
  cacheStorage.set(key, data, savedAt);

  return data;
};
