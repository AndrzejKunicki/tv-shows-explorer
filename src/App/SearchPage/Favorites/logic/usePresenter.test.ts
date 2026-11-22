import { act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { favoritesLoaded } from '@src/store/favorites/favoritesSlice';
import { makeShow } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { loadFavorites } from '@src/tasks/loadFavorites';
import { usePresenter } from './usePresenter';

vi.mock('@src/tasks/loadFavorites', () => ({ loadFavorites: vi.fn() }));

describe('Favorites usePresenter', () => {
  it('loads the favorites on mount', () => {
    renderHookWithStore(usePresenter);

    expect(loadFavorites).toHaveBeenCalled();
  });

  it('shows the number of favorites', () => {
    const store = createStore();
    store.dispatch(favoritesLoaded([makeShow(1, []), makeShow(2, [])]));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current).toMatchObject({ count: 2, buttonLabel: 'Favorites: 2 shows' });
  });

  it('uses the singular for one favorite', () => {
    const store = createStore();
    store.dispatch(favoritesLoaded([makeShow(1, [])]));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current.buttonLabel).toBe('Favorites: 1 show');
  });

  it('opens and closes the list', () => {
    const { result } = renderHookWithStore(usePresenter);

    act(() => result.current.handleToggle());

    expect(result.current.isOpen).toBe(true);

    act(() => result.current.handleClose());

    expect(result.current.isOpen).toBe(false);
  });

  it('closes the open list on Escape', () => {
    const { result } = renderHookWithStore(usePresenter);
    act(() => result.current.handleToggle());

    fireEvent.keyDown(window, { key: 'Enter' });

    expect(result.current.isOpen).toBe(true);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(result.current.isOpen).toBe(false);
  });
});
