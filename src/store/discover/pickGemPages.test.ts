import { describe, expect, it } from 'vitest';
import { GEM_PAGE_COUNT, GEM_PAGE_RANGE, pickGemPages } from './pickGemPages';

describe('pickGemPages', () => {
  it('picks distinct pages within the range', () => {
    for (let run = 0; run < 50; run++) {
      const pages = pickGemPages();

      expect(new Set(pages).size).toBe(GEM_PAGE_COUNT);
      pages.forEach((page) => {
        expect(page).toBeGreaterThanOrEqual(GEM_PAGE_RANGE.min);
        expect(page).toBeLessThanOrEqual(GEM_PAGE_RANGE.max);
      });
    }
  });

  it('skips a page that was already picked', () => {
    const values = [0, 0, 0.99];
    const random = () => values.shift() ?? 0;

    expect(pickGemPages(random)).toEqual([GEM_PAGE_RANGE.min, GEM_PAGE_RANGE.max]);
  });
});
