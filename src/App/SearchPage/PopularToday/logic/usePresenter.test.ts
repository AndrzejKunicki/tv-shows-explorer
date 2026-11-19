import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { feedLoaded } from '@src/store/discover/discoverSlice';
import { withPoster } from '@src/store/discover/testState';
import { searchStarted } from '@src/store/shows/showsSlice';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { loadTodaySchedule } from '@src/tasks/loadTodaySchedule';
import { pickSuggestion } from './tasks/pickSuggestion';
import { usePresenter } from './usePresenter';

vi.mock('@src/tasks/loadTodaySchedule', () => ({ loadTodaySchedule: vi.fn() }));
vi.mock('./tasks/pickSuggestion', () => ({ pickSuggestion: vi.fn() }));

const storeWithSchedule = () => {
  const store = createStore();
  store.dispatch(feedLoaded({ feed: 'schedule', shows: [withPoster(1, 8, 99), withPoster(2, 7, 80)] }));

  return store;
};

describe('PopularToday usePresenter', () => {
  it("loads today's schedule on mount", () => {
    renderHookWithStore(usePresenter);

    expect(loadTodaySchedule).toHaveBeenCalled();
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
    store.dispatch(searchStarted('lost'));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current.isVisible).toBe(false);
  });

  it('picks the selected name as the search', () => {
    const { result } = renderHookWithStore(usePresenter, storeWithSchedule());

    act(() => {
      result.current.handleSelect('Show 2');
    });

    expect(pickSuggestion).toHaveBeenCalledWith('Show 2');
  });
});
