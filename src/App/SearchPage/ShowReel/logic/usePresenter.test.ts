import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { feedLoaded } from '@src/store/discover/discoverSlice';
import { REEL_ROWS } from '@src/store/discover/reelSelectors';
import { withPoster } from '@src/store/discover/testState';
import { searchStarted } from '@src/store/shows/showsSlice';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { loadTopRated } from '@src/tasks/loadTopRated';
import { usePresenter } from './usePresenter';

vi.mock('@src/tasks/loadTopRated', () => ({ loadTopRated: vi.fn() }));

const storeWithIndex = () => {
  const store = createStore();
  const shows = Array.from({ length: REEL_ROWS * 2 }, (_, index) => withPoster(index + 1, 9 - index / 10));
  store.dispatch(feedLoaded({ feed: 'topRated', shows: shows }));

  return store;
};

describe('ShowReel usePresenter', () => {
  it('loads the show index on mount', () => {
    renderHookWithStore(usePresenter);

    expect(loadTopRated).toHaveBeenCalled();
  });

  it('has no rows before the index is loaded', () => {
    const { result } = renderHookWithStore(usePresenter);

    expect(result.current.hasRows).toBe(false);
  });

  it('returns rows of not yet loaded screens, visible on the start page', () => {
    const { result } = renderHookWithStore(usePresenter, storeWithIndex());
    const posters = result.current.rows.flatMap((row) => row.posters);

    expect(result.current.rows).toHaveLength(REEL_ROWS);
    expect(result.current.isHidden).toBe(false);
    expect(posters.every((poster) => !poster.isLoaded)).toBe(true);
  });

  it('marks every copy of a poster as loaded once its image loads', () => {
    const { result } = renderHookWithStore(usePresenter, storeWithIndex());

    act(() => result.current.handleImageLoad('medium-1.jpg'));
    const loaded = result.current.rows.flatMap((row) => row.posters).filter((poster) => poster.isLoaded);

    expect(loaded).toHaveLength(2);
    expect(loaded.every((poster) => poster.imageUrl === 'medium-1.jpg')).toBe(true);
  });

  it('hides the wall once a search has started', () => {
    const store = storeWithIndex();
    store.dispatch(searchStarted('lost'));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current.isHidden).toBe(true);
  });
});
