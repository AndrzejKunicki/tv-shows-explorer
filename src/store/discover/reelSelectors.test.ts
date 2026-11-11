import { describe, expect, it } from 'vitest';
import type { Show } from '@src/api/types';
import { REEL_POSTERS_PER_ROW, REEL_ROWS, selectReelRows } from './reelSelectors';
import { discoverState, withPoster } from './testState';

const rootState = (shows: Show[]) => discoverState({ index: shows });

const manyShows = Array.from({ length: 60 }, (_, index) => withPoster(index + 1, (index % 9) + 1));

describe('selectReelRows', () => {
  it('splits the best rated posters into rows, each repeated twice for a seamless loop', () => {
    const rows = selectReelRows(rootState(manyShows));

    expect(rows).toHaveLength(REEL_ROWS);
    rows.forEach((row) => expect(row.posters).toHaveLength(REEL_POSTERS_PER_ROW * 2));
  });

  it('skips shows without a poster or a rating', () => {
    const shows = [...manyShows.slice(0, 10), { ...withPoster(100, 9), image: null }, withPoster(101, null)];
    const urls = selectReelRows(rootState(shows)).flatMap((row) => row.posters.map((poster) => poster.imageUrl));

    expect(urls).not.toContain('medium-100.jpg');
    expect(urls).not.toContain('medium-101.jpg');
  });

  it('puts the highest rated show first', () => {
    const shows = [withPoster(1, 5), withPoster(2, 9.5), ...manyShows.slice(2, 12)];

    expect(selectReelRows(rootState(shows))[0].posters[0].imageUrl).toBe('medium-2.jpg');
  });

  it('marks some posters as playing', () => {
    const posters = selectReelRows(rootState(manyShows)).flatMap((row) => row.posters);

    expect(posters.some((poster) => poster.isPlaying)).toBe(true);
    expect(posters.every((poster) => poster.isPlaying)).toBe(false);
  });

  it('returns no rows when there are too few posters to fill the wall', () => {
    expect(selectReelRows(rootState(manyShows.slice(0, 3)))).toEqual([]);
  });

  it('gives every poster a unique key', () => {
    const keys = selectReelRows(rootState(manyShows)).flatMap((row) => row.posters.map((poster) => poster.key));

    expect(new Set(keys).size).toBe(keys.length);
  });
});
