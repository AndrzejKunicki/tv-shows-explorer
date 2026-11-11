import type { SearchResult, Show } from './types';

const BASE_URL = 'https://api.tvmaze.com';

export const searchShows = async (query: string, signal?: AbortSignal): Promise<Show[]> => {
  const url = `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`TVmaze API error: ${response.status}`);
  }

  const results: SearchResult[] = await response.json();
  return results.map((result) => result.show);
};
