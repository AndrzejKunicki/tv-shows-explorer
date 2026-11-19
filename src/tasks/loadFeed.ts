import type { Show } from '@src/api/types';
import { feedFailed, feedLoaded, feedRequested, type FeedName } from '@src/store/discover/discoverSlice';
import { selectFeedStatus } from '@src/store/discover/selectors';
import { store } from '@src/store/store';

export type LoadFeedResult = { error: string | null };

/**
 * Loads a discover feed once per session, and again only after a failure (the next visit of the start page
 * retries it). This also prevents double requests from StrictMode effects.
 */
export const loadFeed = async (feed: FeedName, load: () => Promise<Show[]>): Promise<LoadFeedResult> => {
  const status = selectFeedStatus(store.getState(), feed);
  const shouldLoad = status === 'idle' || status === 'failed';
  if (!shouldLoad) {
    return { error: null };
  }

  store.dispatch(feedRequested(feed));

  try {
    const shows = await load();
    store.dispatch(feedLoaded({ feed, shows }));

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    store.dispatch(feedFailed(feed));

    return { error: message };
  }
};
