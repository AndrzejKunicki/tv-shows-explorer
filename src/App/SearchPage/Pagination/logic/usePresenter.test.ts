import { act } from '@testing-library/react';
import { resultsReceived } from '@src/store/shows/showsSlice';
import { makeSearchPage } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { goToNextPage } from './tasks/goToNextPage';
import { goToPreviousPage } from './tasks/goToPreviousPage';
import { usePresenter } from './usePresenter';

vi.mock('./tasks/goToNextPage', () => ({ goToNextPage: vi.fn() }));
vi.mock('./tasks/goToPreviousPage', () => ({ goToPreviousPage: vi.fn() }));

const renderOnPage = (page: number, pageCount: number) => {
  const store = createStore();
  store.dispatch(resultsReceived(makeSearchPage({ page, pageCount })));

  return renderHookWithStore(usePresenter, store);
};

describe('Pagination usePresenter', () => {
  it('is hidden when everything fits on one page', () => {
    const { result } = renderOnPage(1, 1);

    expect(result.current.isVisible).toBe(false);
  });

  it('describes the first of several pages', () => {
    const { result } = renderOnPage(1, 3);

    expect(result.current).toMatchObject({ isVisible: true, label: 'Page 1 of 3', canGoPrev: false, canGoNext: true });
  });

  it('describes the last page', () => {
    const { result } = renderOnPage(2, 2);

    expect(result.current).toMatchObject({ label: 'Page 2 of 2', canGoPrev: true, canGoNext: false });
  });

  it('calls the tasks for the next and previous page', () => {
    const { result } = renderOnPage(2, 3);

    act(() => result.current.handleNext());
    act(() => result.current.handlePrev());

    expect(goToNextPage).toHaveBeenCalledTimes(1);
    expect(goToPreviousPage).toHaveBeenCalledTimes(1);
  });
});
