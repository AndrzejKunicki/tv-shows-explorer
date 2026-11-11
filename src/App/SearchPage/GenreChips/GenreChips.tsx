import { Chip } from './Chip/Chip';
import styles from './GenreChips.module.css';
import { usePresenter } from './usePresenter';

export const GenreChips = () => {
  const { genres, selectedGenre, handleSelect, handleReset } = usePresenter();

  if (genres.length === 0) {
    return null;
  }

  return (
    <div className={styles.chips} role="group" aria-label="Filter by genre">
      <Chip label="All" isActive={selectedGenre === null} onClick={handleReset} />
      {genres.map((genre) => (
        <Chip
          key={genre}
          label={genre}
          isActive={genre === selectedGenre}
          onClick={() => handleSelect(genre)}
        />
      ))}
    </div>
  );
};
