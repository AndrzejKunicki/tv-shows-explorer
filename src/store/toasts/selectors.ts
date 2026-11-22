import type { RootState } from '@src/store/store';

export const selectToasts = (state: RootState) => state.toasts.items;
