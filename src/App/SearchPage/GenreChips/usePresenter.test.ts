import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { resultsRestored } from '@src/store/shows/showsSlice';
import { makeShow } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { usePresenter } from './usePresenter';

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

  it('selects a genre', () => {
    const { result, store } = renderWithResults();

    act(() => result.current.handleSelect('Drama'));

    expect(store.getState().shows.selectedGenre).toBe('Drama');
    expect(result.current.selectedGenre).toBe('Drama');
  });

  it('deselects the genre when it is selected again', () => {
    const { result, store } = renderWithResults();

    act(() => result.current.handleSelect('Drama'));
    act(() => result.current.handleSelect('Drama'));

    expect(store.getState().shows.selectedGenre).toBeNull();
  });

  it('resets the selection', () => {
    const { result, store } = renderWithResults();

    act(() => result.current.handleSelect('Comedy'));
    act(() => {
      result.current.handleReset();
    });

    expect(store.getState().shows.selectedGenre).toBeNull();
  });
});
