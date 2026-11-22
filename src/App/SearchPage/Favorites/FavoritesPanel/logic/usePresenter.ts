import { useEffect, useRef } from 'react';
import type { FavoritesStatus } from '@src/store/favorites/favoritesSlice';
import { selectFavorites, selectFavoritesStatus } from '@src/store/favorites/selectors';
import { useAppSelector } from '@src/store/hooks';

const getMessage = (status: FavoritesStatus, count: number) => {
  if (status === 'loading' && count === 0) {
    return 'Loading favorites…';
  }
  if (status === 'failed') {
    return 'Could not load favorites. Try again later.';
  }
  if (count === 0) {
    return 'No favorites yet. Tap the star on any show to add it.';
  }

  return null;
};

export const usePresenter = () => {
  const shows = useAppSelector(selectFavorites);
  const status = useAppSelector(selectFavoritesStatus);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Keyboard focus moves into the panel when it opens
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const message = getMessage(status, shows.length);

  return { shows, message, closeRef };
};
