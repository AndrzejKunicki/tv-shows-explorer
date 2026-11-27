import { act } from '@testing-library/react';
import { genreSelected, resultsReceived } from '@src/store/shows/showsSlice';
import { makeSearchPage } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { showAllGenres } from './tasks/showAllGenres';
import { toggleGenre } from './tasks/toggleGenre';
import { usePresenter } from './usePresenter';

vi.mock('./tasks/showAllGenres', () => ({ showAllGenres: vi.fn() }));
vi.mock('./tasks/toggleGenre', () => ({ toggleGenre: vi.fn() }));

const renderWithResults = () => {
  const store = createStore();
  store.dispatch(resultsReceived(makeSearchPage({ genres: ['Comedy', 'Crime', 'Drama'] })));

  return renderHookWithStore(usePresenter, store);
};

describe('GenreChips usePresenter', () => {
  it('returns the genres sent by the server and no selection', () => {
    const { result } = renderWithResults();

    expect(result.current.genres).toEqual(['Comedy', 'Crime', 'Drama']);
    expect(result.current.selectedGenre).toBeNull();
  });

  it('returns the selected genre', () => {
    const { result, store } = renderWithResults();

    act(() => {
      store.dispatch(genreSelected('Drama'));
    });

    expect(result.current.selectedGenre).toBe('Drama');
  });

  it('toggles the clicked genre', () => {
    const { result } = renderWithResults();

    act(() => result.current.handleSelect('Drama'));

    expect(toggleGenre).toHaveBeenCalledWith('Drama');
  });

  it('shows all genres on reset', () => {
    const { result } = renderWithResults();

    act(() => result.current.handleReset());

    expect(showAllGenres).toHaveBeenCalledTimes(1);
  });
});
