import styles from './Chip.module.css';

interface ChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const Chip = ({ label, isActive, onClick }: ChipProps) => (
  <button
    type="button"
    className={isActive ? `${styles.chip} ${styles.active}` : styles.chip}
    aria-pressed={isActive}
    onClick={onClick}
  >
    {label}
  </button>
);
