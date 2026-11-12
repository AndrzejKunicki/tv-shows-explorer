import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { selectGenres, selectSelectedGenre } from '@src/store/shows/selectors';
import { genreReset, genreSelected } from '@src/store/shows/showsSlice';

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
