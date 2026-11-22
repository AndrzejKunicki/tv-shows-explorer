import { fetchFavorites } from '@src/api/favoritesApi';
import { favoritesStore } from '@src/store/favorites/favoritesStore';

export type LoadFavoritesResult = { error: string | null };

/** Loads the favorites from the server once, and again only after a failure. */
export const loadFavorites = async (): Promise<LoadFavoritesResult> => {
  const status = favoritesStore.getStatus();
  const shouldLoad = status === 'idle' || status === 'failed';
  if (!shouldLoad) {
    return { error: null };
  }

  favoritesStore.startLoading();

  try {
    const shows = await fetchFavorites();
    favoritesStore.setFavorites(shows);

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    favoritesStore.failLoading();

    return { error: message };
  }
};
