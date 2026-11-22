import { useEffect, useState } from 'react';
import { selectFavoriteCount } from '@src/store/favorites/selectors';
import { useAppSelector } from '@src/store/hooks';
import { loadFavorites } from '@src/tasks/loadFavorites';

export const usePresenter = () => {
  const count = useAppSelector(selectFavoriteCount);
  // Whether the list is open is UI state of this component only
  const [isOpen, setIsOpen] = useState(false);

  // The count is needed right away, so the favorites are loaded on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Escape closes the open list (a window event is an external source)
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const handleToggle = () => setIsOpen((open) => !open);
  const handleClose = () => setIsOpen(false);
  const buttonLabel = `Favorites: ${count} ${count === 1 ? 'show' : 'shows'}`;

  return { count, isOpen, buttonLabel, handleToggle, handleClose };
};
