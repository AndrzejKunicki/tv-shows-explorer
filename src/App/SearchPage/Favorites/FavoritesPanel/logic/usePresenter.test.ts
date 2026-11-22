import { describe, expect, it } from 'vitest';
import { favoritesFailed, favoritesLoaded, favoritesRequested } from '@src/store/favorites/favoritesSlice';
import { makeShow } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { usePresenter } from './usePresenter';

const renderWith = (...actions: Parameters<ReturnType<typeof createStore>['dispatch']>[0][]) => {
  const store = createStore();
  actions.forEach((action) => store.dispatch(action));

  return renderHookWithStore(usePresenter, store).result.current;
};

describe('FavoritesPanel usePresenter', () => {
  it('returns the favorite shows without a message', () => {
    const result = renderWith(favoritesLoaded([makeShow(1, [])]));

    expect(result).toMatchObject({ shows: [makeShow(1, [])], message: null });
  });

  it('explains how to add favorites when there are none', () => {
    expect(renderWith(favoritesLoaded([])).message).toBe('No favorites yet. Tap the star on any show to add it.');
  });

  it('shows loading and failure messages', () => {
    expect(renderWith(favoritesRequested()).message).toBe('Loading favorites…');
    expect(renderWith(favoritesFailed()).message).toBe('Could not load favorites. Try again later.');
  });
});
