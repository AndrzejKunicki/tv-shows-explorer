import { showsStore } from '@src/store/shows/showsStore';
import { loadResults } from '@src/tasks/loadResults';

/** Removes the genre filter and loads the first page of all results. */
export const showAllGenres = async () => {
  showsStore.resetGenre();
  const result = await loadResults();

  return result;
};
