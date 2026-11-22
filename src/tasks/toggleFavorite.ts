import { addFavorite, removeFavorite } from '@src/api/favoritesApi';
import type { Show } from '@src/api/types';
import { favoritesStore } from '@src/store/favorites/favoritesStore';

/** `isFavorite` is the state after the call: unchanged when the request failed. */
export type ToggleFavoriteResult = { error: string | null; isFavorite: boolean };

/**
 * Adds the show to the favorites or removes it, on the server. The local copy changes only after the
 * server has confirmed, so a failed request leaves the star as it was. Returns the new state for the toast.
 */
export const toggleFavorite = async (show: Show): Promise<ToggleFavoriteResult> => {
  const wasFavorite = favoritesStore.isFavorite(show.id);

  try {
    if (wasFavorite) {
      await removeFavorite(show.id);
      favoritesStore.remove(show.id);
    } else {
      const saved = await addFavorite(show.id);
      favoritesStore.add(saved);
    }

    return { error: null, isFavorite: !wasFavorite };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message, isFavorite: wasFavorite };
  }
};
