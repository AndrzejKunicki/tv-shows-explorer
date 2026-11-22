import { configureStore } from '@reduxjs/toolkit';
import { discoverReducer } from './discover/discoverSlice';
import { favoritesReducer } from './favorites/favoritesSlice';
import { showsReducer } from './shows/showsSlice';
import { toastsReducer } from './toasts/toastsSlice';

export const createStore = () =>
  configureStore({
    reducer: { shows: showsReducer, discover: discoverReducer, favorites: favoritesReducer, toasts: toastsReducer },
  });

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
