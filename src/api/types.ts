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
}

export interface SearchResult {
  score: number;
  show: Show;
}
