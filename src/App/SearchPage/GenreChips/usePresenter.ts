import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectGenres, selectSelectedGenre } from '../../../store/shows/selectors';
import { genreReset, genreSelected } from '../../../store/shows/showsSlice';

export const usePresenter = () => {
  const dispatch = useAppDispatch();
  const genres = useAppSelector(selectGenres);
  const selectedGenre = useAppSelector(selectSelectedGenre);

  const handleSelect = (genre: string) => {
    dispatch(genre === selectedGenre ? genreReset() : genreSelected(genre));
  };

  const handleReset = () => dispatch(genreReset());

  return { genres, selectedGenre, handleSelect, handleReset };
};
