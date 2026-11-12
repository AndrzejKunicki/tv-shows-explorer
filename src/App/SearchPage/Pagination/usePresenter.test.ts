import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { pageChanged, PAGE_SIZE, resultsRestored } from '@src/store/shows/showsSlice';
import { makeShow } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { usePresenter } from './usePresenter';

const renderWithShows = (count: number, page = 1) => {
  const store = createStore();
  const items = Array.from({ length: count }, (_, index) => makeShow(index + 1, []));
  store.dispatch(resultsRestored({ query: 'q', items }));
  store.dispatch(pageChanged(page));

  return renderHookWithStore(usePresenter, store);
};

describe('Pagination usePresenter', () => {
  it('is hidden when everything fits on one page', () => {
    const { result } = renderWithShows(PAGE_SIZE);

    expect(result.current.isVisible).toBe(false);
  });

  it('describes the first of several pages', () => {
    const { result } = renderWithShows(PAGE_SIZE * 2 + 1);

    expect(result.current).toMatchObject({ isVisible: true, label: 'Page 1 of 3', canGoPrev: false, canGoNext: true });
  });

  it('goes to the next and previous page', () => {
    const { result, store } = renderWithShows(PAGE_SIZE * 3, 2);

    act(() => result.current.handleNext());

    expect(store.getState().shows.page).toBe(3);

    act(() => result.current.handlePrev());

    expect(store.getState().shows.page).toBe(2);
  });

  it('does not go past the first or last page', () => {
    const first = renderWithShows(PAGE_SIZE * 2, 1);
    act(() => first.result.current.handlePrev());

    const last = renderWithShows(PAGE_SIZE * 2, 2);
    act(() => last.result.current.handleNext());

    expect(first.store.getState().shows.page).toBe(1);
    expect(last.store.getState().shows.page).toBe(2);
  });
});
