export interface ShowImage {
  medium: string;
  original: string;
}

export interface Show {
  id: number;
  name: string;
  genres: string[];
  language: string | null;
  premiered: string | null;
  summary: string | null;
  url: string;
  image: ShowImage | null;
  rating: { average: number | null };
  /** TVMaze popularity, 0–100. */
  weight: number;
}

export interface SearchResult {
  score: number;
  show: Show;
}

/** One episode from the TV schedule; only the show is used. */
export interface ScheduleEpisode {
  id: number;
  show: Show;
}
