import type { ScheduleEpisode, SearchResult, Show } from './types';

const BASE_URL = 'https://api.tvmaze.com';

export const searchShows = async (query: string, signal?: AbortSignal): Promise<Show[]> => {
  const url = `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`TVmaze API error: ${response.status}`);
  }

  const results: SearchResult[] = await response.json();
  const shows = results.map((result) => result.show);

  return shows;
};

/** Lists one page (up to 250 shows) of the TVMaze show index. */
export const fetchShowIndex = async (page = 0, signal?: AbortSignal): Promise<Show[]> => {
  const url = `${BASE_URL}/shows?page=${page}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`TVmaze API error: ${response.status}`);
  }

  const shows: Show[] = await response.json();

  return shows;
};

/** Episodes airing today in the given country (ISO code, e.g. "US"). */
export const fetchSchedule = async (country: string, signal?: AbortSignal): Promise<ScheduleEpisode[]> => {
  const url = `${BASE_URL}/schedule?country=${encodeURIComponent(country)}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`TVmaze API error: ${response.status}`);
  }

  const episodes: ScheduleEpisode[] = await response.json();

  return episodes;
};
