import type { ScheduleEpisode, SearchResult, Show } from './types.ts';

const BASE_URL = 'https://api.tvmaze.com';

const getJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TVmaze API error: ${response.status}`);
  }

  const body = (await response.json()) as T;

  return body;
};

/** Shows matching the query, best match first. */
export const searchShows = async (query: string): Promise<Show[]> => {
  const results = await getJson<SearchResult[]>(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
  const shows = results.map((result) => result.show);

  return shows;
};

/** Lists one page (up to 250 shows) of the TVMaze show index. */
export const fetchShowIndex = async (page: number): Promise<Show[]> => {
  const shows = await getJson<Show[]>(`${BASE_URL}/shows?page=${page}`);

  return shows;
};

/** Episodes airing today in the given country (ISO code, e.g. "US"). */
export const fetchSchedule = async (country: string): Promise<ScheduleEpisode[]> => {
  const episodes = await getJson<ScheduleEpisode[]>(`${BASE_URL}/schedule?country=${encodeURIComponent(country)}`);

  return episodes;
};
