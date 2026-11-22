import { fetchAiringToday } from '@src/api/showsApi';
import { loadFeed } from './loadFeed';

/** Loads the shows airing today: the "Airing today" row and the "Popular on TV today" suggestions. */
export const loadAiringToday = async () => {
  const result = await loadFeed('airingToday', fetchAiringToday);

  return result;
};
