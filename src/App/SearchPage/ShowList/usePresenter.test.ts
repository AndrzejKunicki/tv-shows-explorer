import { describe, expect, it } from 'vitest';
import { PAGE_SIZE, resultsRestored } from '@src/store/shows/showsSlice';
import { testShows } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { usePresenter } from './usePresenter';

describe('ShowList usePresenter', () => {
  it('returns no shows before a search', () => {
    const { result } = renderHookWithStore(usePresenter);

    expect(result.current.shows).toEqual([]);
  });

  it('returns the shows of the current page', () => {
    const store = createStore();
    store.dispatch(resultsRestored({ query: 'q', items: testShows }));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current.shows).toEqual(testShows.slice(0, PAGE_SIZE));
  });
});
