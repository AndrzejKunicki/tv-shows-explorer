import type { Show } from '../../../../api/types';
import { stripHtml } from './stripHtml';

export const usePresenter = ({ show }: { show: Show }) => {
  const year = show.premiered?.slice(0, 4);
  const rating = show.rating.average ? `★ ${show.rating.average}` : null;

  return {
    name: show.name,
    url: show.url,
    imageUrl: show.image?.medium ?? null,
    meta: [year, show.language, rating].filter(Boolean).join(' · '),
    genres: show.genres.join(', '),
    summary: show.summary ? stripHtml(show.summary) : null,
  };
};
