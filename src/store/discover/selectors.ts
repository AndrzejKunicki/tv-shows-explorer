import { createSelector } from '@reduxjs/toolkit';
import type { Show } from '@src/api/types';
import type { RootState } from '@src/store/store';

export const DISCOVER_ROW_SIZE = 20;
export const POPULAR_TODAY_COUNT = 5;
export const GEM_MIN_RATING = 7.8;
/** Below this TVMaze popularity a well rated show counts as "under the radar". */
export const GEM_MAX_WEIGHT = 90;
/** A row with fewer shows is not worth showing. */
export const GEM_MIN_COUNT = 6;

const selectIndexShows = (state: RootState) => state.discover.index.shows;
const selectScheduleShows = (state: RootState) => state.discover.schedule.shows;
const selectGemShows = (state: RootState) => state.discover.gems.shows;

const uniqueById = (shows: Show[]) => [...new Map(shows.map((show) => [show.id, show])).values()];
const byRatingDesc = (a: Show, b: Show) => (b.rating.average ?? 0) - (a.rating.average ?? 0);

/** Shows airing today, most popular first (a show with several episodes today appears once). */
export const selectAiringToday = createSelector([selectScheduleShows], (shows) =>
  uniqueById(shows)
    .filter((show) => show.image)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, DISCOVER_ROW_SIZE),
);

/** Names of the most popular shows airing today, offered as one-click searches. */
export const selectPopularToday = createSelector([selectAiringToday], (shows) =>
  shows.slice(0, POPULAR_TODAY_COUNT).map((show) => show.name),
);

/** Highest rated shows from the popular part of the index. */
export const selectFanFavorites = createSelector([selectIndexShows], (shows) =>
  shows
    .filter((show) => show.image && show.rating.average)
    .sort(byRatingDesc)
    .slice(0, DISCOVER_ROW_SIZE),
);

/** Well rated shows with lower popularity; empty when there are too few to fill a row. */
export const selectHiddenGems = createSelector([selectGemShows], (shows) => {
  const gems = uniqueById(shows)
    .filter((show) => show.image && (show.rating.average ?? 0) >= GEM_MIN_RATING && show.weight < GEM_MAX_WEIGHT)
    .sort(byRatingDesc)
    .slice(0, DISCOVER_ROW_SIZE);
  const rowGems = gems.length >= GEM_MIN_COUNT ? gems : [];

  return rowGems;
});
