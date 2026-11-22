import type { Show } from '#src/api/types.ts';
import { getShowIndex } from './getShowIndex.ts';
import { byRatingDesc, withPoster } from './showRanking.ts';

/** Enough for the "Fan favorites" row and the poster wall, which the client builds from this list. */
export const TOP_RATED_COUNT = 40;

/** The highest rated shows from the popular part of the TVMaze index (its first page). */
export const getTopRated = async (): Promise<Show[]> => {
  const shows = await getShowIndex(0);
  const rated = withPoster(shows).filter((show) => show.rating.average);
  const topRated = rated.sort(byRatingDesc).slice(0, TOP_RATED_COUNT);

  return topRated;
};
