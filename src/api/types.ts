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

export type SortBy = 'relevance' | 'rating';

export interface SearchParams {
  query: string;
  genre: string | null;
  sort: SortBy;
  page: number;
}

/** One page of search results from the server, already filtered by genre and sorted. */
export interface SearchPage {
  query: string;
  items: Show[];
  /** 1-based; the server keeps it within 1..pageCount. */
  page: number;
  pageCount: number;
  /** All results of the query, before the genre filter. */
  total: number;
  /** Genres of all results of the query, sorted. */
  genres: string[];
}
