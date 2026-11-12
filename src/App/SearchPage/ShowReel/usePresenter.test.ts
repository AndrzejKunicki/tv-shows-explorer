import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchShowIndex } from '@src/api/tvmaze';
import { fetchIndex } from '@src/store/discover/discoverSlice';
import { REEL_ROWS } from '@src/store/discover/reelSelectors';
import { withPoster } from '@src/store/discover/testState';
import { fetchShows } from '@src/store/shows/showsSlice';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { usePresenter } from './usePresenter';

vi.mock('@src/api/tvmaze', () => ({ fetchShowIndex: vi.fn() }));
const fetchShowIndexMock = vi.mocked(fetchShowIndex);

const storeWithIndex = () => {
  const store = createStore();
  const shows = Array.from({ length: REEL_ROWS * 2 }, (_, index) => withPoster(index + 1, 9 - index / 10));
  store.dispatch(fetchIndex.fulfilled(shows, 'index'));

  return store;
};

describe('ShowReel usePresenter', () => {
  beforeEach(() => {
    fetchShowIndexMock.mockReset().mockResolvedValue([]);
  });

  it('loads the show index on mount', () => {
    renderHookWithStore(usePresenter);

    expect(fetchShowIndexMock).toHaveBeenCalledWith(0, expect.anything());
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
    store.dispatch(fetchShows.pending('request-1', 'lost'));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current.isHidden).toBe(true);
  });
});
