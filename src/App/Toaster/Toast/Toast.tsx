import type { Toast as ToastData } from '@src/store/toasts/toastsSlice';
import styles from './Toast.module.css';
import { usePresenter } from './logic/usePresenter';

export const Toast = (props: { toast: ToastData }) => {
  const { message, tone, handleClose } = usePresenter(props);

  return (
    <div className={styles.toast} data-tone={tone}>
      <span className={styles.message}>{message}</span>
      <button type="button" className={styles.close} aria-label="Dismiss notification" onClick={handleClose}>
        ×
      </button>
    </div>
  );
};
