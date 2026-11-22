import { request } from './request';
import type { Show } from './types';

/** All favorite shows, the most recently added first. */
export const fetchFavorites = async (): Promise<Show[]> => {
  const shows = await request<Show[]>('/api/favorites');

  return shows;
};

/** Adds the show to the favorites on the server and returns it. */
export const addFavorite = async (id: number): Promise<Show> => {
  const show = await request<Show>(`/api/favorites/${id}`, { method: 'PUT' });

  return show;
};

/** Removes the show from the favorites on the server. */
export const removeFavorite = async (id: number): Promise<void> => {
  await request<void>(`/api/favorites/${id}`, { method: 'DELETE' });
};
