import { fetchSchedule } from '@src/api/tvmaze';
import { loadFeed } from './loadFeed';

const fetchTodayShows = async () => {
  const episodes = await fetchSchedule('US');
  const shows = episodes.map((episode) => episode.show);

  return shows;
};

/** Loads the shows with an episode airing today on US TV. */
export const loadTodaySchedule = async () => {
  const result = await loadFeed('schedule', fetchTodayShows);

  return result;
};
