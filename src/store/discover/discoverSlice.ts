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

const emptyFeed: Feed = { shows: [], status: 'idle' };

export const initialState: DiscoverState = {
  index: emptyFeed,
  schedule: emptyFeed,
  gems: emptyFeed,
};

/** Each feed is loaded once per session; this also prevents double requests from StrictMode effects. */
const onlyOnce = (feed: FeedName) => ({
  condition: (_: unknown, { getState }: { getState: () => unknown }) => {
    const { status } = (getState() as RootState).discover[feed];
    const shouldFetch = status === 'idle';

    return shouldFetch;
  },
});

/** First page of the TVMaze index: well known, popular shows. */
export const fetchIndex = createAsyncThunk(
  'discover/fetchIndex',
  (_: void, { signal }) => fetchShowIndex(0, signal),
  onlyOnce('index'),
);

/** Shows with an episode airing today on US TV. */
export const fetchTodaySchedule = createAsyncThunk(
  'discover/fetchSchedule',
  async (_: void, { signal }) => {
    const episodes = await fetchSchedule('US', signal);
    const shows = episodes.map((episode) => episode.show);

    return shows;
  },
  onlyOnce('schedule'),
);

/** Later index pages, where less known shows live. */
export const fetchGems = createAsyncThunk(
  'discover/fetchGems',
  async (pages: number[], { signal }) => {
    const responses = await Promise.all(pages.map((page) => fetchShowIndex(page, signal)));
    const shows = responses.flat();

    return shows;
  },
  onlyOnce('gems'),
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
