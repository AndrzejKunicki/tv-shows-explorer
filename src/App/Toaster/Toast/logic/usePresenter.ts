import { useEffect } from 'react';
import { useAppDispatch } from '@src/store/hooks';
import { toastHidden, type Toast } from '@src/store/toasts/toastsSlice';

/** How long a toast stays on screen. */
export const TOAST_DURATION_MS = 3000;

export const usePresenter = ({ toast }: { toast: Toast }) => {
  const dispatch = useAppDispatch();

  // A timer is an external source: it hides the toast on its own, the cleanup stops it if closed earlier
  useEffect(() => {
    const timer = setTimeout(() => dispatch(toastHidden(toast.id)), TOAST_DURATION_MS);

    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  const handleClose = () => dispatch(toastHidden(toast.id));

  return { message: toast.message, tone: toast.tone, handleClose };
};
