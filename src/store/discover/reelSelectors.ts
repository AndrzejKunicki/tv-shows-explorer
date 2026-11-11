import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@src/store/store';

export const REEL_ROWS = 4;
export const REEL_POSTERS_PER_ROW = 10;
/** Every n-th poster "plays" (slow zoom + flicker), like a screen showing a trailer. */
export const REEL_PLAYING_EVERY = 4;

export interface ReelPoster {
  key: string;
  imageUrl: string;
  isPlaying: boolean;
}

export interface ReelRow {
  id: number;
  posters: ReelPoster[];
}

const selectReelShows = (state: RootState) => state.discover.index.shows;

/** Best rated shows that have a poster, split into rows for the background wall. */
export const selectReelRows = createSelector([selectReelShows], (shows): ReelRow[] => {
  const posters = shows
    .filter((show) => show.image && show.rating.average)
    .sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0))
    .slice(0, REEL_ROWS * REEL_POSTERS_PER_ROW)
    .map((show) => ({ id: show.id, imageUrl: show.image?.medium ?? '' }));

  const rowCount = posters.length >= REEL_ROWS * 2 ? REEL_ROWS : 0;
  const rows = Array.from({ length: rowCount }, (_, rowIndex) => {
    const rowPosters = posters.filter((_, index) => index % REEL_ROWS === rowIndex);
    // The track holds the row twice, so it can scroll by half its width and loop seamlessly
    const track = [...rowPosters, ...rowPosters].map((poster, index) => ({
      key: `${poster.id}-${index}`,
      imageUrl: poster.imageUrl,
      isPlaying: (index + rowIndex) % REEL_PLAYING_EVERY === 0,
    }));

    return { id: rowIndex, posters: track };
  });

  return rows;
});
