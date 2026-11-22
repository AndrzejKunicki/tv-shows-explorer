import { showsStore } from '@src/store/shows/showsStore';
import { loadResults } from '@src/tasks/loadResults';

/** Filters the results by the genre, or shows all genres again when it is already selected. */
export const toggleGenre = async (genre: string) => {
  const isSelected = showsStore.getSelectedGenre() === genre;
  if (isSelected) {
    showsStore.resetGenre();
  } else {
    showsStore.selectGenre(genre);
  }

  const result = await loadResults();

  return result;
};
