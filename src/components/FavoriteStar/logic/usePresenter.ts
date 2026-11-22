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
  // Ignores more clicks while the server is answering. Not `disabled`: a disabled button loses keyboard focus
  const [isPending, setIsPending] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = async () => {
    if (isPending) {
      return;
    }

    setIsPending(true);
    const result = await toggleFavorite(show);
    setIsPending(false);
    // Only a confirmed add flies to the counter; the toast follows once the star has arrived
    if (!result.error && result.isFavorite) {
      await flyToFavorites(buttonRef.current);
    }
    const message = toToastMessage(show.name, result);
    dispatch(toastShown(message, result.error ? 'error' : 'success'));
  };
  const label = isFavorite ? `Remove ${show.name} from favorites` : `Add ${show.name} to favorites`;

  return { isFavorite, isPending, label, buttonRef, handleClick };
};
