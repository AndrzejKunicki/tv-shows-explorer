export const GEM_PAGE_RANGE = { min: 1, max: 10 };
export const GEM_PAGE_COUNT = 2;

/**
 * Picks distinct random TVMaze index pages to look for hidden gems in,
 * so every visit shows different shows.
 */
export const pickGemPages = (random: () => number = Math.random): number[] => {
  const { min, max } = GEM_PAGE_RANGE;
  const pages = new Set<number>();

  while (pages.size < GEM_PAGE_COUNT) {
    pages.add(min + Math.floor(random() * (max - min + 1)));
  }

  const picked = [...pages];

  return picked;
};
