import type { Show } from '@src/api/types';
import { initialState as showsInitialState } from '@src/store/shows/showsSlice';
import { makeShow } from '@src/store/shows/testShows';
import type { RootState } from '@src/store/store';
import { initialState, type FeedName } from './discoverSlice';

export const withPoster = (id: number, rating: number | null, weight = 95): Show => ({
  ...makeShow(id, []),
  image: { medium: `medium-${id}.jpg`, original: `original-${id}.jpg` },
  rating: { average: rating },
  weight,
});

/** Root state with the given discover feeds loaded. */
export const discoverState = (feeds: Partial<Record<FeedName, Show[]>>): RootState => {
  const discover = { ...initialState };
  for (const [feed, shows] of Object.entries(feeds) as [FeedName, Show[]][]) {
    discover[feed] = { shows, status: 'succeeded' };
  }

  const state = { shows: showsInitialState, discover };

  return state;
};
