import { configureStore } from '@reduxjs/toolkit';
import { showsReducer } from './shows/showsSlice';

export const createStore = () =>
  configureStore({
    reducer: { shows: showsReducer },
  });

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
