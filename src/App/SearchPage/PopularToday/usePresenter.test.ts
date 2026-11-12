import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchSchedule } from '@src/api/tvmaze';
import { fetchTodaySchedule } from '@src/store/discover/discoverSlice';
import { withPoster } from '@src/store/discover/testState';
import { fetchShows } from '@src/store/shows/showsSlice';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { usePresenter } from './usePresenter';

vi.mock('@src/api/tvmaze', () => ({ fetchSchedule: vi.fn() }));
const fetchScheduleMock = vi.mocked(fetchSchedule);

const storeWithSchedule = () => {
  const store = createStore();
  store.dispatch(fetchTodaySchedule.fulfilled([withPoster(1, 8, 99), withPoster(2, 7, 80)], 'schedule'));

  return store;
};

describe('PopularToday usePresenter', () => {
  beforeEach(() => {
    fetchScheduleMock.mockReset().mockResolvedValue([]);
  });

  it("loads today's schedule on mount", () => {
    renderHookWithStore(usePresenter);

    expect(fetchScheduleMock).toHaveBeenCalledWith('US', expect.anything());
  });

  it('is hidden while there are no names', () => {
    const { result } = renderHookWithStore(usePresenter);

    expect(result.current.isVisible).toBe(false);
  });

  it('offers the most popular names on the start page', () => {
    const { result } = renderHookWithStore(usePresenter, storeWithSchedule());

    expect(result.current.names).toEqual(['Show 1', 'Show 2']);
    expect(result.current.isVisible).toBe(true);
  });

  it('is hidden once a search has started', () => {
    const store = storeWithSchedule();
    store.dispatch(fetchShows.pending('request-1', 'lost'));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current.isVisible).toBe(false);
  });

  it('puts the selected name into the search field', () => {
    const { result, store } = renderHookWithStore(usePresenter, storeWithSchedule());

    act(() => {
      result.current.handleSelect('Show 2');
    });

    expect(store.getState().shows.draft).toBe('Show 2');
  });
});
