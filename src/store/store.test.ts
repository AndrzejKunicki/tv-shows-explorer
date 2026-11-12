import { describe, expect, it } from 'vitest';
import { initialState as discoverInitialState } from './discover/discoverSlice';
import { draftChanged, initialState as showsInitialState } from './shows/showsSlice';
import { createStore, store } from './store';

describe('store', () => {
  it('createStore combines the shows and discover slices', () => {
    const state = createStore().getState();

    expect(state).toEqual({ shows: showsInitialState, discover: discoverInitialState });
  });

  it('createStore returns independent stores', () => {
    const first = createStore();
    const second = createStore();

    first.dispatch(draftChanged('lost'));

    expect(second.getState().shows.draft).toBe('');
  });

  it('exports the app store instance', () => {
    expect(store.getState().shows).toBeDefined();
  });
});
