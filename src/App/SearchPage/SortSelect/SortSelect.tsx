import styles from './SortSelect.module.css';
import { usePresenter } from './usePresenter';

export const SortSelect = () => {
  const { value, options, handleChange } = usePresenter();

  return (
    <label className={styles.sort}>
      <span className={styles.label}>Sort by</span>
      <select className={styles.select} value={value} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
