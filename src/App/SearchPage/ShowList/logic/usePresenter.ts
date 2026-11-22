import { useAppSelector } from '@src/store/hooks';
import { selectItems } from '@src/store/shows/selectors';

export const usePresenter = () => {
  const shows = useAppSelector(selectItems);

  return { shows };
};
