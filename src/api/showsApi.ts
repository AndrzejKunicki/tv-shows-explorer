import { request } from './request';
import type { SearchPage, SearchParams, Show } from './types';

/** One page of search results, filtered by genre and sorted on the server. */
export const searchShows = async (params: SearchParams, signal?: AbortSignal): Promise<SearchPage> => {
  const query = new URLSearchParams({ q: params.query, sort: params.sort, page: String(params.page) });
  if (params.genre) {
    query.set('genre', params.genre);
  }

  const page = await request<SearchPage>(`/api/shows/search?${query}`, { signal });

  return page;
};

/** Shows airing today on US TV, most popular first (chosen by the server). */
export const fetchAiringToday = async (): Promise<Show[]> => {
  const shows = await request<Show[]>('/api/discover/airing-today');

  return shows;
};

/** The highest rated well known shows, best first (chosen by the server). */
export const fetchTopRated = async (): Promise<Show[]> => {
  const shows = await request<Show[]>('/api/discover/top-rated');

  return shows;
};

/** Well rated, less known shows, different on every request (chosen by the server). */
export const fetchHiddenGems = async (): Promise<Show[]> => {
  const shows = await request<Show[]>('/api/discover/hidden-gems');

  return shows;
};
