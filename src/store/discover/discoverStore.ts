import type { Show } from '@src/api/types';
import { store } from '@src/store/store';
import { feedFailed, feedLoaded, feedRequested, type FeedName } from './discoverSlice';
import { selectFeedStatus } from './selectors';

/**
 * Start page feeds for tasks: named reads and writes in terms of the domain. It is the only place where
 * tasks meet the Redux API, so switching the state library changes this file, not the tasks.
 */
export const discoverStore = {
  getFeedStatus: (feed: FeedName) => selectFeedStatus(store.getState(), feed),

  startFeed: (feed: FeedName) => {
    store.dispatch(feedRequested(feed));
  },
  setFeed: (feed: FeedName, shows: Show[]) => {
    store.dispatch(feedLoaded({ feed, shows }));
  },
  failFeed: (feed: FeedName) => {
    store.dispatch(feedFailed(feed));
  },
};
