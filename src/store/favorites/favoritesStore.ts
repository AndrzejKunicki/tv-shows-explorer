import type { Show } from '@src/api/types';
import { store } from '@src/store/store';
import {
  favoriteAdded,
  favoriteRemoved,
  favoritesFailed,
  favoritesLoaded,
  favoritesRequested,
} from './favoritesSlice';
import { selectFavoritesStatus, selectIsFavorite } from './selectors';

/**
 * Favorites for tasks: named reads and writes in terms of the domain. It is the only place where
 * tasks meet the Redux API, so switching the state library changes this file, not the tasks.
 */
export const favoritesStore = {
  getStatus: () => selectFavoritesStatus(store.getState()),
  isFavorite: (id: number) => selectIsFavorite(store.getState(), id),

  startLoading: () => {
    store.dispatch(favoritesRequested());
  },
  setFavorites: (shows: Show[]) => {
    store.dispatch(favoritesLoaded(shows));
  },
  failLoading: () => {
    store.dispatch(favoritesFailed());
  },
  add: (show: Show) => {
    store.dispatch(favoriteAdded(show));
  },
  remove: (id: number) => {
    store.dispatch(favoriteRemoved(id));
  },
};
