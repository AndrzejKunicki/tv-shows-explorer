import { describe, expect, it } from 'vitest';
import { testShows } from '@src/store/shows/testShows';
import { discoverReducer, feedFailed, feedLoaded, feedRequested, initialState } from './discoverSlice';

describe('discover slice', () => {
  it('starts with idle, empty feeds', () => {
    expect(discoverReducer(undefined, { type: 'init' })).toEqual(initialState);
  });

  it('gives every feed its own initial object', () => {
    expect(initialState.topRated).not.toBe(initialState.airingToday);
    expect(initialState.airingToday).not.toBe(initialState.hiddenGems);
  });

  it('marks a requested feed as loading', () => {
    const state = discoverReducer(initialState, feedRequested('topRated'));

    expect(state.topRated.status).toBe('loading');
    expect(state.airingToday.status).toBe('idle');
  });

  it('stores the shows of a loaded feed', () => {
    const state = discoverReducer(initialState, feedLoaded({ feed: 'hiddenGems', shows: testShows }));

    expect(state.hiddenGems).toEqual({ status: 'succeeded', shows: testShows });
  });

  it('marks a feed as failed', () => {
    const state = discoverReducer(discoverReducer(initialState, feedRequested('airingToday')), feedFailed('airingToday'));

    expect(state.airingToday).toEqual({ status: 'failed', shows: [] });
  });
});
