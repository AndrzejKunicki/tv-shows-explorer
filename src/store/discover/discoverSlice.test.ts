import { describe, expect, it } from 'vitest';
import { testShows } from '@src/store/shows/testShows';
import { discoverReducer, feedFailed, feedLoaded, feedRequested, initialState } from './discoverSlice';

describe('discover slice', () => {
  it('starts with idle, empty feeds', () => {
    expect(discoverReducer(undefined, { type: 'init' })).toEqual(initialState);
  });

  it('gives every feed its own initial object', () => {
    expect(initialState.index).not.toBe(initialState.schedule);
    expect(initialState.schedule).not.toBe(initialState.gems);
  });

  it('marks a requested feed as loading', () => {
    const state = discoverReducer(initialState, feedRequested('index'));

    expect(state.index.status).toBe('loading');
    expect(state.schedule.status).toBe('idle');
  });

  it('stores the shows of a loaded feed', () => {
    const state = discoverReducer(initialState, feedLoaded({ feed: 'gems', shows: testShows }));

    expect(state.gems).toEqual({ status: 'succeeded', shows: testShows });
  });

  it('marks a feed as failed', () => {
    const state = discoverReducer(discoverReducer(initialState, feedRequested('schedule')), feedFailed('schedule'));

    expect(state.schedule).toEqual({ status: 'failed', shows: [] });
  });
});
