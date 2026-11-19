import { fetchShowIndex } from '@src/api/tvmaze';
import { loadFeed } from './loadFeed';

/** Loads the first page of the TVMaze index: well known, popular shows. */
export const loadShowIndex = async () => {
  const result = await loadFeed('index', () => fetchShowIndex(0));

  return result;
};
