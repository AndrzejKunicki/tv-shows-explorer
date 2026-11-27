import {
  DISCOVER_ROW_SIZE,
  POPULAR_TODAY_COUNT,
  selectAiringToday,
  selectFanFavorites,
  selectFeedStatus,
  selectHiddenGems,
  selectPopularToday,
  selectTopRated,
} from './selectors';
import { discoverState, withPoster } from './testState';

const shows = (count: number) => Array.from({ length: count }, (_, index) => withPoster(index + 1, 8));

describe('discover selectors', () => {
  it('return the rows as the server sent them', () => {
    const state = discoverState({ airingToday: shows(2), topRated: shows(3), hiddenGems: shows(4) });

    expect(selectAiringToday(state)).toHaveLength(2);
    expect(selectTopRated(state)).toHaveLength(3);
    expect(selectHiddenGems(state)).toHaveLength(4);
  });

  it('offer the names of the first shows airing today as suggestions', () => {
    const state = discoverState({ airingToday: shows(POPULAR_TODAY_COUNT + 3) });

    expect(selectPopularToday(state)).toEqual(['Show 1', 'Show 2', 'Show 3', 'Show 4', 'Show 5']);
  });

  it('fill the "Fan favorites" row with the top of the top rated list', () => {
    const state = discoverState({ topRated: shows(DISCOVER_ROW_SIZE * 2) });

    expect(selectFanFavorites(state)).toEqual(shows(DISCOVER_ROW_SIZE));
  });

  it('return the status of a feed', () => {
    const state = discoverState({ hiddenGems: shows(1) });

    expect(selectFeedStatus(state, 'hiddenGems')).toBe('succeeded');
    expect(selectFeedStatus(state, 'topRated')).toBe('idle');
  });
});
