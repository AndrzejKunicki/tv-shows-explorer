import type { Show } from './types.ts';

export const makeShow = (id: number, genres: string[], rating: number | null = null): Show => ({
  id,
  name: `Show ${id}`,
  genres,
  language: 'English',
  premiered: '2020-01-01',
  summary: null,
  url: `https://www.tvmaze.com/shows/${id}`,
  image: null,
  rating: { average: rating },
  weight: 50,
});
