import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Show } from '@src/api/types';

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

const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {
    feedRequested: (state, action: PayloadAction<FeedName>) => {
      state[action.payload].status = 'loading';
    },
    feedLoaded: (state, action: PayloadAction<{ feed: FeedName; shows: Show[] }>) => {
      state[action.payload.feed] = { shows: action.payload.shows, status: 'succeeded' };
    },
    feedFailed: (state, action: PayloadAction<FeedName>) => {
      state[action.payload].status = 'failed';
    },
  },
});

export const { feedRequested, feedLoaded, feedFailed } = discoverSlice.actions;
export const discoverReducer = discoverSlice.reducer;
