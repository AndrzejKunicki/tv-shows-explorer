import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { genreSelected, resultsRestored } from '@src/store/shows/showsSlice';
import { makeShow } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { toggleGenre } from './tasks/toggleGenre';
import { usePresenter } from './usePresenter';

vi.mock('./tasks/toggleGenre', () => ({ toggleGenre: vi.fn() }));

const renderWithResults = () => {
  const store = createStore();
  store.dispatch(resultsRestored({ query: 'q', items: [makeShow(1, ['Drama', 'Crime']), makeShow(2, ['Comedy'])] }));

  return renderHookWithStore(usePresenter, store);
};

describe('GenreChips usePresenter', () => {
  it('returns sorted genres of the results and no selection', () => {
    const { result } = renderWithResults();

    expect(result.current.genres).toEqual(['Comedy', 'Crime', 'Drama']);
    expect(result.current.selectedGenre).toBeNull();
  });

  it('toggles the clicked genre', () => {
    const { result } = renderWithResults();

    act(() => result.current.handleSelect('Drama'));

    expect(toggleGenre).toHaveBeenCalledWith('Drama');
  });

  it('resets the selection', () => {
    const { result, store } = renderWithResults();

    act(() => {
      store.dispatch(genreSelected('Comedy'));
    });
    act(() => {
      result.current.handleReset();
    });

    expect(store.getState().shows.selectedGenre).toBeNull();
  });
});
