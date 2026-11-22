import type { Show } from '#src/api/types.ts';
import { getTodayShows } from './getTodayShows.ts';
import { byPopularityDesc, DISCOVER_ROW_SIZE, uniqueById, withPoster } from './showRanking.ts';

/** Shows with an episode airing today on US TV, most popular first, each once. */
export const getAiringToday = async (): Promise<Show[]> => {
  const shows = await getTodayShows('US');
  const airingToday = withPoster(uniqueById(shows)).sort(byPopularityDesc).slice(0, DISCOVER_ROW_SIZE);

  return airingToday;
};
