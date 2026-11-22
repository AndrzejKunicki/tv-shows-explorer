import { useState } from 'react';
import type { Show } from '@src/api/types';
import { selectIsFavorite } from '@src/store/favorites/selectors';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { toastShown } from '@src/store/toasts/toastsSlice';
import { toggleFavorite, type ToggleFavoriteResult } from '@src/tasks/toggleFavorite';

const toToastMessage = (name: string, result: ToggleFavoriteResult) => {
  if (result.error) {
    return `Could not update favorites: ${result.error}`;
  }

  return result.isFavorite ? `"${name}" added to favorites` : `"${name}" removed from favorites`;
};

export const usePresenter = ({ show }: { show: Show }) => {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, show.id));
  // Blocks double clicks while the server is answering
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    const result = await toggleFavorite(show);
    setIsPending(false);
    const message = toToastMessage(show.name, result);
    dispatch(toastShown(message, result.error ? 'error' : 'success'));
  };
  const label = isFavorite ? `Remove ${show.name} from favorites` : `Add ${show.name} to favorites`;

  return { isFavorite, isPending, label, handleClick };
};
