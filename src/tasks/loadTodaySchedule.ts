import { fetchTodayShows } from '@src/api/showsApi';
import { loadFeed } from './loadFeed';

/** Loads the shows with an episode airing today on US TV. */
export const loadTodaySchedule = async () => {
  const result = await loadFeed('schedule', fetchTodayShows);

  return result;
};
