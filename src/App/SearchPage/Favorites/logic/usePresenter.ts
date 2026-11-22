import { useEffect, useRef, useState } from 'react';
import { selectFavoriteCount } from '@src/store/favorites/selectors';
import { useAppSelector } from '@src/store/hooks';
import { loadFavorites } from '@src/tasks/loadFavorites';

export const usePresenter = () => {
  const count = useAppSelector(selectFavoriteCount);
  // Whether the list is open is UI state of this component only
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Closing returns keyboard focus to the button that opened the list
  const close = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

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
        close();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const handleToggle = () => setIsOpen((open) => !open);
  const handleClose = close;
  const buttonLabel = `Favorites: ${count} ${count === 1 ? 'show' : 'shows'}`;

  return { count, isOpen, buttonRef, buttonLabel, handleToggle, handleClose };
};
