import { initialState as discoverInitialState } from './discover/discoverSlice';
import { initialState as favoritesInitialState } from './favorites/favoritesSlice';
import { draftChanged, initialState as showsInitialState } from './shows/showsSlice';
import { createStore, store } from './store';
import { initialState as toastsInitialState } from './toasts/toastsSlice';

describe('store', () => {
  it('createStore combines all slices', () => {
    const state = createStore().getState();

    expect(state).toEqual({
      shows: showsInitialState,
      discover: discoverInitialState,
      favorites: favoritesInitialState,
      toasts: toastsInitialState,
    });
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
