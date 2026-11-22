interface CacheEntry {
  data: unknown;
  /** When the data was fetched from TVmaze (ms since epoch). */
  savedAt: number;
}

/** TVmaze responses kept in memory, keyed by request. A plain object, so it lives as long as the process. */
const cache: Record<string, CacheEntry> = {};

/** The cache as a small database: named reads and writes, no rules about freshness (see `getCached`). */
export const cacheStorage = {
  get: (key: string): CacheEntry | undefined => cache[key],
  set: (key: string, data: unknown, savedAt: number) => {
    cache[key] = { data, savedAt };
  },
  /** Drops entries saved before `time`, so the object does not grow forever. */
  removeOlderThan: (time: number) => {
    for (const [key, entry] of Object.entries(cache)) {
      if (entry.savedAt < time) {
        delete cache[key];
      }
    }
  },
  clear: () => {
    for (const key of Object.keys(cache)) {
      delete cache[key];
    }
  },
};
