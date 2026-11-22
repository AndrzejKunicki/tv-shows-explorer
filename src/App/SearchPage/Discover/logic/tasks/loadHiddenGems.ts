import { fetchHiddenGems } from '@src/api/showsApi';
import { loadFeed } from '@src/tasks/loadFeed';

/** Loads the hidden gems row (the server picks different shows on every visit). */
export const loadHiddenGems = async () => {
  const result = await loadFeed('hiddenGems', fetchHiddenGems);

  return result;
};
