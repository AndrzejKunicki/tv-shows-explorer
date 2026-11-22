import type { Show } from '@src/api/types';
import type { FeedName } from '@src/store/discover/discoverSlice';
import { discoverStore } from '@src/store/discover/discoverStore';

export type LoadFeedResult = { error: string | null };

/**
 * Loads a discover feed once per session, and again only after a failure (the next visit of the start page
 * retries it). This also prevents double requests from StrictMode effects.
 */
export const loadFeed = async (feed: FeedName, load: () => Promise<Show[]>): Promise<LoadFeedResult> => {
  const status = discoverStore.getFeedStatus(feed);
  const shouldLoad = status === 'idle' || status === 'failed';
  if (!shouldLoad) {
    return { error: null };
  }

  discoverStore.startFeed(feed);

  try {
    const shows = await load();
    discoverStore.setFeed(feed, shows);

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    discoverStore.failFeed(feed);

    return { error: message };
  }
};
