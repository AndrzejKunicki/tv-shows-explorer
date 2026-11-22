import { showsStore } from '@src/store/shows/showsStore';

/** Shows the previous page of the results, unless the first one is already shown. */
export const goToPreviousPage = () => {
  const page = showsStore.getPage();
  const canGoPrev = page > 1;
  if (!canGoPrev) {
    return;
  }

  showsStore.setPage(page - 1);
};
