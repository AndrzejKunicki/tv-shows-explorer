import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { favoriteAdded } from '@src/store/favorites/favoritesSlice';
import { makeShow } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { toggleFavorite } from '@src/tasks/toggleFavorite';
import { flyToFavorites } from './flyToFavorites';
import { usePresenter } from './usePresenter';

vi.mock('@src/tasks/toggleFavorite', () => ({ toggleFavorite: vi.fn() }));
vi.mock('./flyToFavorites', () => ({ flyToFavorites: vi.fn().mockResolvedValue(undefined) }));
const toggleFavoriteMock = vi.mocked(toggleFavorite);

const show = { ...makeShow(1, []), name: 'Lost' };

describe('FavoriteStar usePresenter', () => {
  beforeEach(() => {
    toggleFavoriteMock.mockReset();
    vi.mocked(flyToFavorites).mockClear();
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

  it('flies the star to the counter after a confirmed add, and only then shows the toast', async () => {
    toggleFavoriteMock.mockResolvedValue({ error: null, isFavorite: true });
    let toastsWhileFlying = -1;
    const { result, store } = renderHookWithStore(() => usePresenter({ show }));
    const button = document.createElement('button');
    result.current.buttonRef.current = button;
    vi.mocked(flyToFavorites).mockImplementationOnce(async () => {
      toastsWhileFlying = store.getState().toasts.items.length;
    });

    await act(() => result.current.handleClick());

    expect(flyToFavorites).toHaveBeenCalledWith(button);
    expect(toastsWhileFlying).toBe(0);
    expect(store.getState().toasts.items).toHaveLength(1);
  });

  it('does not fly on remove or on an error', async () => {
    toggleFavoriteMock.mockResolvedValueOnce({ error: null, isFavorite: false });
    toggleFavoriteMock.mockResolvedValueOnce({ error: 'API error: 502', isFavorite: false });
    const { result } = renderHookWithStore(() => usePresenter({ show }));

    await act(() => result.current.handleClick());
    await act(() => result.current.handleClick());

    expect(flyToFavorites).not.toHaveBeenCalled();
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
