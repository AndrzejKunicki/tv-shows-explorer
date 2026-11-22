import { useRef, useState } from 'react';
import type { Show } from '@src/api/types';
import { selectIsFavorite } from '@src/store/favorites/selectors';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { toastShown } from '@src/store/toasts/toastsSlice';
import { toggleFavorite, type ToggleFavoriteResult } from '@src/tasks/toggleFavorite';
import { flyToFavorites } from './flyToFavorites';

const toToastMessage = (name: string, result: ToggleFavoriteResult) => {
  if (result.error) {
    return `Could not update favorites: ${result.error}`;
  }

  return result.isFavorite ? `"${name}" added to favorites` : `"${name}" removed from favorites`;
};

export const usePresenter = ({ show }: { show: Show }) => {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, show.id));
  // Ignores more clicks until the toast is shown (request + flight). Not `disabled`: it would lose keyboard focus
  const [isPending, setIsPending] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // The star on the card fills up like a liquid while its copy is flying to the counter
  const [isFilling, setIsFilling] = useState(false);

  const flyStar = async () => {
    setIsFilling(true);
    await flyToFavorites(buttonRef.current);
    setIsFilling(false);
  };

  const handleClick = async () => {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      // A confirmed add flies the star to the counter first; the count and the toast change once it has arrived
      const result = await toggleFavorite(show, flyStar);
      const message = toToastMessage(show.name, result);
      dispatch(toastShown(message, result.error ? 'error' : 'success'));
    } finally {
      setIsPending(false);
    }
  };
  const label = isFavorite ? `Remove ${show.name} from favorites` : `Add ${show.name} to favorites`;

  return { isFavorite, isPending, isFilling, label, buttonRef, handleClick };
};
