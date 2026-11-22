import { showsStore } from '@src/store/shows/showsStore';

/** Filters the results by the genre, or shows all genres again when it is already selected. */
export const toggleGenre = (genre: string) => {
  const isSelected = showsStore.getSelectedGenre() === genre;
  if (isSelected) {
    showsStore.resetGenre();

    return;
  }

  showsStore.selectGenre(genre);
};
