import { fetchShowIndex } from '@src/api/showsApi';
import { loadFeed } from '@src/tasks/loadFeed';
import { pickGemPages } from './pickGemPages';

/** Later index pages, where less known shows live. Failed pages are skipped; it fails only when all do. */
const fetchGemPages = async (pages: number[]) => {
  const responses = await Promise.allSettled(pages.map((page) => fetchShowIndex(page)));
  const loaded = responses.filter((response) => response.status === 'fulfilled');
  if (loaded.length === 0) {
    const [firstFailure] = responses as PromiseRejectedResult[];
    throw firstFailure.reason;
  }

  const shows = loaded.flatMap((response) => response.value);

  return shows;
};

/** Loads hidden gems from random later index pages, so every visit shows different shows. */
export const loadGems = async (random: () => number = Math.random) => {
  const result = await loadFeed('gems', () => fetchGemPages(pickGemPages(random)));

  return result;
};
