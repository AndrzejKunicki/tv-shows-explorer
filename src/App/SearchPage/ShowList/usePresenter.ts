import { useAppSelector } from '../../../store/hooks';
import { selectPagedShows } from '../../../store/shows/selectors';

export const usePresenter = () => {
  const shows = useAppSelector(selectPagedShows);

  return { shows };
};
