import { useAppSelector } from '@src/store/hooks';
import { selectStatus } from '@src/store/shows/selectors';

export const usePresenter = () => {
  const status = useAppSelector(selectStatus);
  // During a search the hero shrinks to the logo, so results start higher
  const isCompact = status !== 'idle';

  return { isCompact };
};
