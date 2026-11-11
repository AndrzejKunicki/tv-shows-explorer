import { useAppSelector } from '@src/store/hooks';
import { selectPagedShows } from '@src/store/shows/selectors';

export const usePresenter = () => {
  const shows = useAppSelector(selectPagedShows);

  return { shows };
};
