import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@src/store/store';
import type { FeedName } from './discoverSlice';

/** How many shows fit into a discovery row (the server decides which shows and in what order). */
export const DISCOVER_ROW_SIZE = 20;
/** How many one-click searches "Popular on TV today" offers. */
export const POPULAR_TODAY_COUNT = 5;

export const selectFeedStatus = (state: RootState, feed: FeedName) => state.discover[feed].status;

export const selectAiringToday = (state: RootState) => state.discover.airingToday.shows;
export const selectTopRated = (state: RootState) => state.discover.topRated.shows;
export const selectHiddenGems = (state: RootState) => state.discover.hiddenGems.shows;

/** Names of the most popular shows airing today, offered as one-click searches. */
export const selectPopularToday = createSelector([selectAiringToday], (shows) =>
  shows.slice(0, POPULAR_TODAY_COUNT).map((show) => show.name),
);

/** The "Fan favorites" row: the top of the top rated list. */
export const selectFanFavorites = createSelector([selectTopRated], (shows) => shows.slice(0, DISCOVER_ROW_SIZE));
