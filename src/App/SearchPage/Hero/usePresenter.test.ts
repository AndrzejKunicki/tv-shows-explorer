import { describe, expect, it } from 'vitest';
import { fetchShows } from '@src/store/shows/showsSlice';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { usePresenter } from './usePresenter';

describe('Hero usePresenter', () => {
  it('is full size on the start page', () => {
    const { result } = renderHookWithStore(usePresenter);

    expect(result.current.isCompact).toBe(false);
  });

  it('is compact once a search has started', () => {
    const store = createStore();
    store.dispatch(fetchShows.pending('request-1', 'lost'));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current.isCompact).toBe(true);
  });
});
