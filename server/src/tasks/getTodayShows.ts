import { fetchSchedule } from '#src/api/tvmaze.ts';
import type { Show } from '#src/api/types.ts';
import { getCached } from './getCached.ts';

const fetchScheduleShows = async (country: string) => {
  const episodes = await fetchSchedule(country);
  const shows = episodes.map((episode) => episode.show);

  return shows;
};

/** Shows with an episode airing today in the country, through the cache. */
export const getTodayShows = async (country: string): Promise<Show[]> => {
  const shows = await getCached(`schedule:${country}`, () => fetchScheduleShows(country));

  return shows;
};
