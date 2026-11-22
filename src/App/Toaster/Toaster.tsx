import { Toast } from './Toast/Toast';
import styles from './Toaster.module.css';
import { usePresenter } from './logic/usePresenter';

/** Corner area for short notifications; screen readers announce new ones. */
export const Toaster = () => {
  const { toasts } = usePresenter();

  return (
    <div className={styles.toaster} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
