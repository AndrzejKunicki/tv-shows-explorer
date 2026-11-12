import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { selectPage, selectPageCount } from '@src/store/shows/selectors';
import { pageChanged } from '@src/store/shows/showsSlice';

export const usePresenter = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectPage);
  const pageCount = useAppSelector(selectPageCount);

  const isVisible = pageCount > 1;
  const label = `Page ${page} of ${pageCount}`;
  const canGoPrev = page > 1;
  const canGoNext = page < pageCount;

  const handlePrev = () => {
    if (canGoPrev) {
      dispatch(pageChanged(page - 1));
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      dispatch(pageChanged(page + 1));
    }
  };

  return { isVisible, label, canGoPrev, canGoNext, handlePrev, handleNext };
};
