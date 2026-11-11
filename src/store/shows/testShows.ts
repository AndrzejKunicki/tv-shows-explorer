import type { Show } from '../../api/types';

export const makeShow = (id: number, genres: string[]): Show => ({
  id,
  name: `Show ${id}`,
  genres,
  language: 'English',
  premiered: '2020-01-01',
  summary: null,
  url: `https://www.tvmaze.com/shows/${id}`,
  image: null,
  rating: { average: null },
});

export const testShows: Show[] = [
  makeShow(1, ['Drama', 'Crime']),
  makeShow(2, ['Comedy']),
  makeShow(3, ['Crime', 'Mystery']),
  makeShow(4, ['Comedy', 'Drama']),
  makeShow(5, ['Adventure']),
  makeShow(6, []),
  makeShow(7, ['Crime']),
];
