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

export type SortBy = 'relevance' | 'rating';

/** One page of search results, already filtered by genre and sorted. */
export interface SearchPage {
  query: string;
  items: Show[];
  /** 1-based; kept within 1..pageCount. */
  page: number;
  pageCount: number;
  /** All results of the query, before the genre filter. */
  total: number;
  /** Genres of all results of the query, sorted. */
  genres: string[];
}
