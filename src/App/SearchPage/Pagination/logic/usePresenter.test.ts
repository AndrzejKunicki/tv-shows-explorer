import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { pageChanged, PAGE_SIZE, resultsRestored } from '@src/store/shows/showsSlice';
import { makeShow } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { goToNextPage } from './tasks/goToNextPage';
import { goToPreviousPage } from './tasks/goToPreviousPage';
import { usePresenter } from './usePresenter';

vi.mock('./tasks/goToNextPage', () => ({ goToNextPage: vi.fn() }));
vi.mock('./tasks/goToPreviousPage', () => ({ goToPreviousPage: vi.fn() }));

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

  it('shows the last page when the stored page is out of range', () => {
    const { result } = renderWithShows(PAGE_SIZE * 2, 5);

    expect(result.current).toMatchObject({ label: 'Page 2 of 2', canGoPrev: true, canGoNext: false });
  });

  it('calls the tasks for the next and previous page', () => {
    const { result } = renderWithShows(PAGE_SIZE * 3, 2);

    act(() => result.current.handleNext());
    act(() => result.current.handlePrev());

    expect(goToNextPage).toHaveBeenCalledTimes(1);
    expect(goToPreviousPage).toHaveBeenCalledTimes(1);
  });
});
