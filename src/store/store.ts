import { configureStore, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit';
import { discoverReducer } from './discover/discoverSlice';
import { showsReducer } from './shows/showsSlice';

export const createStore = () =>
  configureStore({
    reducer: { shows: showsReducer, discover: discoverReducer },
  });

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, UnknownAction>;
