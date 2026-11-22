import { useAppSelector } from '@src/store/hooks';
import { selectGenres, selectSelectedGenre } from '@src/store/shows/selectors';
import { showAllGenres } from './tasks/showAllGenres';
import { toggleGenre } from './tasks/toggleGenre';

export const usePresenter = () => {
  const genres = useAppSelector(selectGenres);
  const selectedGenre = useAppSelector(selectSelectedGenre);

  const handleSelect = (genre: string) => {
    toggleGenre(genre);
  };
  const handleReset = () => {
    showAllGenres();
  };

  return { genres, selectedGenre, handleSelect, handleReset };
};
