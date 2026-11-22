import type { Show } from '@src/api/types';
import { stripHtml } from './stripHtml';

export const usePresenter = ({ show }: { show: Show }) => {
  const { name, url } = show;
  const year = show.premiered?.slice(0, 4);
  const rating = show.rating.average ? show.rating.average.toFixed(1) : null;
  const imageUrl = show.image?.medium ?? null;
  const meta = [year, show.language].filter(Boolean).join(' · ');
  const genres = show.genres.join(', ');
  const summary = show.summary ? stripHtml(show.summary) : null;

  return { name, url, imageUrl, rating, meta, genres, summary };
};
