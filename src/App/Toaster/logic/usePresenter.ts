import { useAppSelector } from '@src/store/hooks';
import { selectToasts } from '@src/store/toasts/selectors';

export const usePresenter = () => {
  const toasts = useAppSelector(selectToasts);

  return { toasts };
};
