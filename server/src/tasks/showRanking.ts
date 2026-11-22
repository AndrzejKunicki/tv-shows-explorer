import type { Show } from '#src/api/types.ts';

/** How many shows a discovery row offers. */
export const DISCOVER_ROW_SIZE = 20;

/** Each show once (a show with several episodes today comes several times from the schedule). */
export const uniqueById = (shows: Show[]): Show[] => {
  const unique = [...new Map(shows.map((show) => [show.id, show])).values()];

  return unique;
};

/** Only shows with a poster: the discovery rows and the poster wall are made of images. */
export const withPoster = (shows: Show[]): Show[] => {
  const posters = shows.filter((show) => show.image);

  return posters;
};

export const byRatingDesc = (a: Show, b: Show) => (b.rating.average ?? 0) - (a.rating.average ?? 0);
export const byPopularityDesc = (a: Show, b: Show) => b.weight - a.weight;
