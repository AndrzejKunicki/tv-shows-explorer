import { useEffect } from 'react';
import { useAppDispatch } from '@src/store/hooks';
import { toastHidden, type Toast } from '@src/store/toasts/toastsSlice';

/** How long a toast stays on screen. */
export const TOAST_DURATION_MS = 3000;

/** A check mark for success, an exclamation mark for an error. */
export const ICON_PATHS = { success: 'm5 12.5 4.5 4.5L19 7.5', error: 'M12 7v6m0 4h.01' };

export const usePresenter = ({ toast }: { toast: Toast }) => {
  const dispatch = useAppDispatch();

  // A timer is an external source: it hides the toast on its own, the cleanup stops it if closed earlier
  useEffect(() => {
    const timer = setTimeout(() => dispatch(toastHidden(toast.id)), TOAST_DURATION_MS);

    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  const handleClose = () => dispatch(toastHidden(toast.id));

  const iconPath = ICON_PATHS[toast.tone];

  return { message: toast.message, tone: toast.tone, iconPath, handleClose };
};
