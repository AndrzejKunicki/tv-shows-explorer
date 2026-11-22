import { describe, expect, it } from 'vitest';
import { makePoster, makeShow } from '#src/api/testShows.ts';
import { byPopularityDesc, byRatingDesc, uniqueById, withPoster } from './showRanking.ts';

describe('showRanking', () => {
  it('keeps each show once', () => {
    const shows = [makeShow(1, []), makeShow(2, []), makeShow(1, [])];

    expect(uniqueById(shows).map((show) => show.id)).toEqual([1, 2]);
  });

  it('keeps only shows with a poster', () => {
    expect(withPoster([makeShow(1, []), makePoster(2, 8)]).map((show) => show.id)).toEqual([2]);
  });

  it('sorts by rating, unrated last, and by popularity', () => {
    const shows = [makePoster(1, 6, 50), makePoster(2, null, 99), makePoster(3, 9, 70)];

    expect([...shows].sort(byRatingDesc).map((show) => show.id)).toEqual([3, 1, 2]);
    expect([...shows].sort(byPopularityDesc).map((show) => show.id)).toEqual([2, 3, 1]);
  });
});
