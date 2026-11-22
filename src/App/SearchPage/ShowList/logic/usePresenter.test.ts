import { describe, expect, it } from 'vitest';
import { resultsReceived } from '@src/store/shows/showsSlice';
import { makeSearchPage, testShows } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { usePresenter } from './usePresenter';

describe('ShowList usePresenter', () => {
  it('returns no shows before a search', () => {
    const { result } = renderHookWithStore(usePresenter);

    expect(result.current.shows).toEqual([]);
  });

  it('returns the shows of the page sent by the server', () => {
    const store = createStore();
    store.dispatch(resultsReceived(makeSearchPage({ items: testShows.slice(0, 3) })));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current.shows).toEqual(testShows.slice(0, 3));
  });
});
