import { createAsyncThunk, createSlice, type ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { fetchSchedule, fetchShowIndex } from '@src/api/tvmaze';
import type { Show } from '@src/api/types';
import type { RootState } from '@src/store/store';

export type FeedStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type FeedName = 'index' | 'schedule' | 'gems';

export interface Feed {
  shows: Show[];
  status: FeedStatus;
}

/** Data for the start page: the decorative poster wall and the discovery rows. */
export type DiscoverState = Record<FeedName, Feed>;

const createEmptyFeed = (): Feed => ({ shows: [], status: 'idle' });

export const initialState: DiscoverState = {
  index: createEmptyFeed(),
  schedule: createEmptyFeed(),
  gems: createEmptyFeed(),
};

/**
 * Each feed is loaded once per session, and again only after a failure (the next visit of the start page
 * retries it). This also prevents double requests from StrictMode effects.
 */
const onceUntilLoaded = (feed: FeedName) => ({
  condition: (_: unknown, { getState }: { getState: () => unknown }) => {
    const { status } = (getState() as RootState).discover[feed];
    const shouldFetch = status === 'idle' || status === 'failed';

    return shouldFetch;
  },
});

/** First page of the TVMaze index: well known, popular shows. */
export const fetchIndex = createAsyncThunk(
  'discover/fetchIndex',
  (_: void, { signal }) => fetchShowIndex(0, signal),
  onceUntilLoaded('index'),
);

/** Shows with an episode airing today on US TV. */
export const fetchTodaySchedule = createAsyncThunk(
  'discover/fetchSchedule',
  async (_: void, { signal }) => {
    const episodes = await fetchSchedule('US', signal);
    const shows = episodes.map((episode) => episode.show);

    return shows;
  },
  onceUntilLoaded('schedule'),
);

/** Later index pages, where less known shows live. Failed pages are skipped; it fails only when all do. */
export const fetchGems = createAsyncThunk(
  'discover/fetchGems',
  async (pages: number[], { signal }) => {
    const responses = await Promise.allSettled(pages.map((page) => fetchShowIndex(page, signal)));
    const loaded = responses.filter((response) => response.status === 'fulfilled');
    if (loaded.length === 0) {
      const [firstFailure] = responses as PromiseRejectedResult[];
      throw firstFailure.reason;
    }
    const shows = loaded.flatMap((response) => response.value);

    return shows;
  },
  onceUntilLoaded('gems'),
);

const addFeedCases = (
  builder: ActionReducerMapBuilder<DiscoverState>,
  feed: FeedName,
  thunk: typeof fetchIndex | typeof fetchTodaySchedule | typeof fetchGems,
) => {
  builder
    .addCase(thunk.pending, (state) => {
      state[feed].status = 'loading';
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state[feed] = { shows: action.payload, status: 'succeeded' };
    })
    .addCase(thunk.rejected, (state) => {
      state[feed].status = 'failed';
    });
};

const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addFeedCases(builder, 'index', fetchIndex);
    addFeedCases(builder, 'schedule', fetchTodaySchedule);
    addFeedCases(builder, 'gems', fetchGems);
  },
});

export const discoverReducer = discoverSlice.reducer;
