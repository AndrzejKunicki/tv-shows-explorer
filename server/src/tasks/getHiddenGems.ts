import type { Show } from '#src/api/types.ts';
import { getShowIndex } from './getShowIndex.ts';
import { pickGemPages } from './pickGemPages.ts';
import { byRatingDesc, DISCOVER_ROW_SIZE, uniqueById, withPoster } from './showRanking.ts';

export const GEM_MIN_RATING = 7.8;
/** Below this TVMaze popularity a well rated show counts as "under the radar". */
export const GEM_MAX_WEIGHT = 90;
/** A row with fewer shows is not worth showing. */
export const GEM_MIN_COUNT = 6;

/** Later index pages, where less known shows live. Failed pages are skipped; it fails only when all do. */
const loadGemPages = async (pages: number[]) => {
  const responses = await Promise.allSettled(pages.map((page) => getShowIndex(page)));
  const loaded = responses.filter((response) => response.status === 'fulfilled');
  if (loaded.length === 0) {
    const [firstFailure] = responses as PromiseRejectedResult[];
    throw firstFailure.reason;
  }

  const shows = loaded.flatMap((response) => response.value);

  return shows;
};

const isGem = (show: Show) => (show.rating.average ?? 0) >= GEM_MIN_RATING && show.weight < GEM_MAX_WEIGHT;

/**
 * Well rated shows with lower popularity from random index pages, so every visit finds different ones.
 * Empty when there are too few to fill a row.
 */
export const getHiddenGems = async (random: () => number = Math.random): Promise<Show[]> => {
  const shows = await loadGemPages(pickGemPages(random));
  const gems = withPoster(uniqueById(shows)).filter(isGem).sort(byRatingDesc).slice(0, DISCOVER_ROW_SIZE);
  const rowGems = gems.length >= GEM_MIN_COUNT ? gems : [];

  return rowGems;
};
