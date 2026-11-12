import { describe, expect, it } from 'vitest';
import {
  DISCOVER_ROW_SIZE,
  GEM_MIN_COUNT,
  POPULAR_TODAY_COUNT,
  selectAiringToday,
  selectFanFavorites,
  selectHiddenGems,
  selectPopularToday,
} from './selectors';
import { discoverState, withPoster } from './testState';

const ids = (shows: { id: number }[]) => shows.map((show) => show.id);

describe('discover selectors', () => {
  describe('selectAiringToday', () => {
    it('lists each show once, most popular first, skipping shows without a poster', () => {
      const schedule = [
        withPoster(1, 7, 60),
        withPoster(2, 7, 99),
        withPoster(1, 7, 60), // second episode of the same show today
        { ...withPoster(3, 9, 100), image: null },
      ];

      expect(ids(selectAiringToday(discoverState({ schedule })))).toEqual([2, 1]);
    });

    it('limits the row size', () => {
      const schedule = Array.from({ length: 40 }, (_, index) => withPoster(index + 1, 7));

      expect(selectAiringToday(discoverState({ schedule }))).toHaveLength(DISCOVER_ROW_SIZE);
    });
  });

  it('offers names of the most popular shows airing today as searches', () => {
    const schedule = Array.from({ length: 10 }, (_, index) => withPoster(index + 1, 7, index));
    const names = selectPopularToday(discoverState({ schedule }));

    expect(names).toHaveLength(POPULAR_TODAY_COUNT);
    expect(names[0]).toBe('Show 10');
  });

  it('sorts fan favorites by rating and skips unrated shows', () => {
    const index = [withPoster(1, 7.5), withPoster(2, null), withPoster(3, 9.1), withPoster(4, 8)];

    expect(ids(selectFanFavorites(discoverState({ index })))).toEqual([3, 4, 1]);
  });

  describe('selectHiddenGems', () => {
    const gems = Array.from({ length: GEM_MIN_COUNT }, (_, index) => withPoster(index + 1, 8, 70));

    it('keeps well rated shows that are not too popular', () => {
      const shows = [...gems, withPoster(50, 9, 95), withPoster(51, 7, 60)];
      const result = ids(selectHiddenGems(discoverState({ gems: shows })));

      expect(result).toHaveLength(GEM_MIN_COUNT);
      expect(result).not.toContain(50); // too popular
      expect(result).not.toContain(51); // rated too low
    });

    it('returns nothing when there are too few gems to fill a row', () => {
      expect(selectHiddenGems(discoverState({ gems: gems.slice(1) }))).toEqual([]);
    });
  });
});
