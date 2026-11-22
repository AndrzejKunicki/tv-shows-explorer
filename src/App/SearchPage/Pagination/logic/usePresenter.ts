import { useAppSelector } from '@src/store/hooks';
import { selectPage, selectPageCount } from '@src/store/shows/selectors';
import { goToNextPage } from './tasks/goToNextPage';
import { goToPreviousPage } from './tasks/goToPreviousPage';

export const usePresenter = () => {
  const page = useAppSelector(selectPage);
  const pageCount = useAppSelector(selectPageCount);

  const isVisible = pageCount > 1;
  const label = `Page ${page} of ${pageCount}`;
  const canGoPrev = page > 1;
  const canGoNext = page < pageCount;
  const handlePrev = () => goToPreviousPage();
  const handleNext = () => goToNextPage();

  return { isVisible, label, canGoPrev, canGoNext, handlePrev, handleNext };
};
