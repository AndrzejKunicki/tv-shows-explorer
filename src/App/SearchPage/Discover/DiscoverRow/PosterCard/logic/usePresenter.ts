import type { Show } from '@src/api/types';

export const usePresenter = ({ show }: { show: Show }) => {
  const { name, url } = show;
  const imageUrl = show.image?.medium ?? null;
  const rating = show.rating.average ? show.rating.average.toFixed(1) : null;
  const year = show.premiered?.slice(0, 4);
  const meta = [year, show.genres[0]].filter(Boolean).join(' · ');

  return { name, url, imageUrl, rating, meta };
};
