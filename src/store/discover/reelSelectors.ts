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

const selectReelShows = (state: RootState) => state.discover.topRated.shows;

/** The top rated shows (with posters, chosen by the server), laid out in rows for the background wall. */
export const selectReelRows = createSelector([selectReelShows], (shows): ReelRow[] => {
  const posters = shows
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
