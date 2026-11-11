import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectPage, selectPageCount } from '../../../store/shows/selectors';
import { pageChanged } from '../../../store/shows/showsSlice';

export const usePresenter = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectPage);
  const pageCount = useAppSelector(selectPageCount);

  const canGoPrev = page > 1;
  const canGoNext = page < pageCount;

  const handlePrev = () => {
    if (canGoPrev) dispatch(pageChanged(page - 1));
  };

  const handleNext = () => {
    if (canGoNext) dispatch(pageChanged(page + 1));
  };

  return {
    isVisible: pageCount > 1,
    label: `Page ${page} of ${pageCount}`,
    canGoPrev,
    canGoNext,
    handlePrev,
    handleNext,
  };
};
