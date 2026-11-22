import type { Show } from '@src/api/types';

export const usePresenter = ({ show }: { show: Show }) => {
  const { name, url } = show;
  const imageUrl = show.image?.medium ?? null;
  const year = show.premiered?.slice(0, 4);
  const meta = [year, show.genres.slice(0, 2).join(', ')].filter(Boolean).join(' · ');

  return { name, url, imageUrl, meta };
};
