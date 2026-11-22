import type { SearchPage, SearchParams, Show } from './types';

/**
 * Our backend (see `server/`). Locally it is empty: the client calls /api/... and Vite proxies it to the
 * local server; the production build gets the server address from `VITE_API_URL`.
 */
const API_URL = import.meta.env.VITE_API_URL ?? '';

const getJson = async <T>(path: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, { signal });

  if (!response.ok) {
    const body: { error?: string } = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `API error: ${response.status}`);
  }

  const data = (await response.json()) as T;

  return data;
};

/** One page of search results, filtered by genre and sorted on the server. */
export const searchShows = async (params: SearchParams, signal?: AbortSignal): Promise<SearchPage> => {
  const query = new URLSearchParams({ q: params.query, sort: params.sort, page: String(params.page) });
  if (params.genre) {
    query.set('genre', params.genre);
  }

  const page = await getJson<SearchPage>(`/api/shows/search?${query}`, signal);

  return page;
};

/** One page (up to 250 shows) of the TVMaze show index. */
export const fetchShowIndex = async (page = 0): Promise<Show[]> => {
  const shows = await getJson<Show[]>(`/api/shows/index?page=${page}`);

  return shows;
};

/** Shows with an episode airing today on US TV. */
export const fetchTodayShows = async (): Promise<Show[]> => {
  const shows = await getJson<Show[]>('/api/schedule?country=US');

  return shows;
};
