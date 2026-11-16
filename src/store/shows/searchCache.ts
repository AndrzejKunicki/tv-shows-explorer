import type { Show } from '@src/api/types';

/** How many search responses are kept; the oldest one is dropped first. */
export const CACHE_LIMIT = 20;

export interface CachedSearch {
  key: string;
  shows: Show[];
}

export const toCacheKey = (query: string) => query.trim().toLowerCase();

/**
 * Returns results already fetched for exactly the same query (e.g. "banana" -> "banan" -> "banana"),
 * or `null` when the API has to be called.
 */
export const findCachedResults = (cache: CachedSearch[], key: string): Show[] | null => {
  const entry = cache.find((cached) => cached.key === key);
  const shows = entry ? entry.shows : null;

  return shows;
};

/** Adds a response at the end of the cache, replacing the same key and dropping the oldest above the limit. */
export const addToCache = (cache: CachedSearch[], key: string, shows: Show[]): CachedSearch[] => {
  const others = cache.filter((cached) => cached.key !== key);
  const next = [...others, { key, shows }].slice(-CACHE_LIMIT);

  return next;
};
