import { fetchTopRated } from '@src/api/showsApi';
import { loadFeed } from './loadFeed';

/** Loads the top rated shows: the "Fan favorites" row and the poster wall. */
export const loadTopRated = async () => {
  const result = await loadFeed('topRated', fetchTopRated);

  return result;
};
