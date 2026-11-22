import { fetchShowIndex } from '#src/api/tvmaze.ts';
import type { Show } from '#src/api/types.ts';
import { getCached } from './getCached.ts';

/** One page of the TVMaze show index, through the cache. */
export const getShowIndex = async (page: number): Promise<Show[]> => {
  const shows = await getCached(`index:${page}`, () => fetchShowIndex(page));

  return shows;
};
