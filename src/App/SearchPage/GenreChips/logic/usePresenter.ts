import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { selectGenres, selectSelectedGenre } from '@src/store/shows/selectors';
import { genreReset } from '@src/store/shows/showsSlice';
import { toggleGenre } from './tasks/toggleGenre';

export const usePresenter = () => {
  const dispatch = useAppDispatch();
  const genres = useAppSelector(selectGenres);
  const selectedGenre = useAppSelector(selectSelectedGenre);

  const handleSelect = (genre: string) => toggleGenre(genre);
  // A single write without any logic stays in the presenter
  const handleReset = () => dispatch(genreReset());

  return { genres, selectedGenre, handleSelect, handleReset };
};
