import { describe, expect, it } from 'vitest';
import type { Show } from '@src/api/types';
import { fetchShows, resultsRestored } from '@src/store/shows/showsSlice';
import { makeShow } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { usePresenter } from './usePresenter';

const withResults = (items: Show[]) => {
  const store = createStore();
  store.dispatch(resultsRestored({ query: 'lost', items }));

  return renderHookWithStore(usePresenter, store).result.current;
};

describe('SearchPage usePresenter', () => {
  it('shows only the discovery rows on the start page', () => {
    const { result } = renderHookWithStore(usePresenter);

    expect(result.current).toEqual({ message: null, isError: false, hasResults: false, showDiscover: true });
  });

  it('shows a loading message during a search', () => {
    const store = createStore();
    store.dispatch(fetchShows.pending('request-1', 'lost'));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current).toEqual({ message: 'Searching…', isError: false, hasResults: false, showDiscover: false });
  });

  it('shows the error when the search failed', () => {
    const store = createStore();
    store.dispatch(fetchShows.pending('request-1', 'lost'));
    store.dispatch(fetchShows.rejected(new Error('Network down'), 'request-1', 'lost'));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current).toMatchObject({ message: 'Something went wrong: Network down', isError: true });
  });

  it('shows the results', () => {
    const result = withResults([makeShow(1, [])]);

    expect(result).toEqual({ message: null, isError: false, hasResults: true, showDiscover: false });
  });

  it('suggests discovery rows when nothing was found', () => {
    const result = withResults([]);

    expect(result).toEqual({
      message: 'No shows found for "lost". Try another title, or pick something below.',
      isError: false,
      hasResults: false,
      showDiscover: true,
    });
  });
});
