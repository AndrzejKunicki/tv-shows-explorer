import { describe, expect, it } from 'vitest';
import type { Show } from '@src/api/types';
import { REEL_POSTERS_PER_ROW, REEL_ROWS, selectReelRows } from './reelSelectors';
import { discoverState, withPoster } from './testState';

const rootState = (shows: Show[]) => discoverState({ topRated: shows });

const manyShows = Array.from({ length: 60 }, (_, index) => withPoster(index + 1, (index % 9) + 1));

describe('selectReelRows', () => {
  it('splits the top rated posters into rows, each repeated twice for a seamless loop', () => {
    const rows = selectReelRows(rootState(manyShows));

    expect(rows).toHaveLength(REEL_ROWS);
    rows.forEach((row) => expect(row.posters).toHaveLength(REEL_POSTERS_PER_ROW * 2));
  });

  it('keeps the order chosen by the server, starting with the first show', () => {
    const shows = [withPoster(1, 5), withPoster(2, 9.5), ...manyShows.slice(2, 12)];

    expect(selectReelRows(rootState(shows))[0].posters[0].imageUrl).toBe('medium-1.jpg');
  });

  it('uses only as many shows as the wall holds', () => {
    const urls = selectReelRows(rootState(manyShows)).flatMap((row) => row.posters.map((poster) => poster.imageUrl));

    expect(new Set(urls).size).toBe(REEL_ROWS * REEL_POSTERS_PER_ROW);
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
