import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { favoriteAdded } from '@src/store/favorites/favoritesSlice';
import { makeShow } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { toggleFavorite } from '@src/tasks/toggleFavorite';
import { usePresenter } from './usePresenter';

vi.mock('@src/tasks/toggleFavorite', () => ({ toggleFavorite: vi.fn() }));
const toggleFavoriteMock = vi.mocked(toggleFavorite);

const show = { ...makeShow(1, []), name: 'Lost' };

describe('FavoriteStar usePresenter', () => {
  beforeEach(() => {
    toggleFavoriteMock.mockReset();
  });

  it('shows whether the show is a favorite', () => {
    const store = createStore();

    const { result } = renderHookWithStore(() => usePresenter({ show }), store);

    expect(result.current).toMatchObject({ isFavorite: false, label: 'Add Lost to favorites' });

    act(() => {
      store.dispatch(favoriteAdded(show));
    });

    expect(result.current).toMatchObject({ isFavorite: true, label: 'Remove Lost from favorites' });
  });

  it('toggles the favorite and shows a toast with the result', async () => {
    toggleFavoriteMock.mockResolvedValue({ error: null, isFavorite: true });
    const { result, store } = renderHookWithStore(() => usePresenter({ show }));

    await act(() => result.current.handleClick());

    expect(toggleFavoriteMock).toHaveBeenCalledWith(show);
    expect(store.getState().toasts.items).toMatchObject([{ message: '"Lost" added to favorites', tone: 'success' }]);
  });

  it('shows a removal toast', async () => {
    toggleFavoriteMock.mockResolvedValue({ error: null, isFavorite: false });
    const { result, store } = renderHookWithStore(() => usePresenter({ show }));

    await act(() => result.current.handleClick());

    expect(store.getState().toasts.items[0].message).toBe('"Lost" removed from favorites');
  });

  it('shows an error toast when the server fails', async () => {
    toggleFavoriteMock.mockResolvedValue({ error: 'API error: 502', isFavorite: false });
    const { result, store } = renderHookWithStore(() => usePresenter({ show }));

    await act(() => result.current.handleClick());

    expect(store.getState().toasts.items).toMatchObject([
      { message: 'Could not update favorites: API error: 502', tone: 'error' },
    ]);
  });

  it('is pending while the server answers', async () => {
    let finish = (_value: { error: null; isFavorite: boolean }) => {};
    toggleFavoriteMock.mockReturnValue(new Promise((resolve) => (finish = resolve)));
    const { result } = renderHookWithStore(() => usePresenter({ show }));

    let click = Promise.resolve();
    act(() => {
      click = result.current.handleClick();
    });

    expect(result.current.isPending).toBe(true);

    // A second click while the server is answering is ignored
    await act(() => result.current.handleClick());

    expect(toggleFavoriteMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      finish({ error: null, isFavorite: true });
      await click;
    });

    expect(result.current.isPending).toBe(false);
  });
});
