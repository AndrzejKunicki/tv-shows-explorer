import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type ToastTone = 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

/** Short notifications shown in the corner; any component can show one, the Toaster displays them. */
export interface ToastsState {
  items: Toast[];
}

export const initialState: ToastsState = { items: [] };

const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    toastShown: {
      reducer: (state, action: PayloadAction<Toast>) => {
        state.items.push(action.payload);
      },
      prepare: (message: string, tone: ToastTone = 'success') => ({ payload: { id: nanoid(), message, tone } }),
    },
    toastHidden: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { toastShown, toastHidden } = toastsSlice.actions;
export const toastsReducer = toastsSlice.reducer;
