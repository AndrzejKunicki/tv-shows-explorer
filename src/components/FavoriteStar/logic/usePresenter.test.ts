import { act } from '@testing-library/react';
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

/** Like the real task after a confirmed add: waits for the given step, then answers. */
const addConfirmed = () =>
  toggleFavoriteMock.mockImplementation(async (_show, waitBeforeAdding) => {
    await waitBeforeAdding?.();

    return { error: null, isFavorite: true };
  });

describe('FavoriteStar usePresenter', () => {
  beforeEach(() => {
    toggleFavoriteMock.mockReset();
    vi.mocked(flyToFavorites).mockReset().mockResolvedValue(undefined);
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

  it('gives the task the flight of this star, and shows the toast only after it', async () => {
    addConfirmed();
    let toastsWhileFlying = -1;
    const { result, store } = renderHookWithStore(() => usePresenter({ show }));
    const button = document.createElement('button');
    result.current.buttonRef.current = button;
    vi.mocked(flyToFavorites).mockImplementationOnce(async () => {
      toastsWhileFlying = store.getState().toasts.items.length;
    });

    await act(() => result.current.handleClick());

    expect(toggleFavoriteMock).toHaveBeenCalledWith(show, expect.any(Function));
    expect(flyToFavorites).toHaveBeenCalledWith(button);
    expect(toastsWhileFlying).toBe(0);
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

  it('ignores clicks while the server answers and during the flight', async () => {
    let answer = () => {};
    let land = () => {};
    const serverAnswer = new Promise<void>((resolve) => (answer = resolve));
    toggleFavoriteMock.mockImplementation(async (_show, waitBeforeAdding) => {
      await serverAnswer;
      await waitBeforeAdding?.();

      return { error: null, isFavorite: true };
    });
    vi.mocked(flyToFavorites).mockReturnValueOnce(new Promise<void>((resolve) => (land = resolve)));
    const { result } = renderHookWithStore(() => usePresenter({ show }));

    let click = Promise.resolve();
    act(() => {
      click = result.current.handleClick();
    });
    await act(() => result.current.handleClick());
    await act(async () => answer());
    await act(() => result.current.handleClick());

    expect(result.current).toMatchObject({ isPending: true, isFilling: true });
    expect(toggleFavoriteMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      land();
      await click;
    });

    expect(result.current).toMatchObject({ isPending: false, isFilling: false });
  });
});
