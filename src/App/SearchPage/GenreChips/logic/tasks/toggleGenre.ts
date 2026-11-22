import { selectSelectedGenre } from '@src/store/shows/selectors';
import { genreReset, genreSelected } from '@src/store/shows/showsSlice';
import { store } from '@src/store/store';

/** Filters the results by the genre, or shows all genres again when it is already selected. */
export const toggleGenre = (genre: string) => {
  const isSelected = selectSelectedGenre(store.getState()) === genre;
  const action = isSelected ? genreReset() : genreSelected(genre);

  store.dispatch(action);
};
