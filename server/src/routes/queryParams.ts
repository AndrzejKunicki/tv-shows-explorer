import type { SortBy } from '#src/api/types.ts';
import type { FindShowsPageParams } from '#src/tasks/findShowsPage.ts';

type Query = Record<string, unknown>;
type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

const readString = (value: unknown) => (typeof value === 'string' ? value : undefined);

/** A whole number not below `min`; `fallback` when the parameter is missing. */
export const parseInteger = (value: unknown, min: number, fallback: number): number | null => {
  if (value === undefined || value === '') {
    return fallback;
  }

  const text = readString(value);
  if (text === undefined) {
    return null;
  }

  const number = Number(text);
  const isValid = Number.isInteger(number) && number >= min;

  return isValid ? number : null;
};

const SORT_OPTIONS: SortBy[] = ['relevance', 'rating'];

/** Reads `q`, `genre`, `sort` and `page` of the search request. */
export const parseSearchParams = (query: Query): Parsed<FindShowsPageParams> => {
  const text = readString(query.q)?.trim() ?? '';
  const genre = readString(query.genre) || null;
  const sort = readString(query.sort) ?? 'relevance';
  const page = parseInteger(query.page, 1, 1);

  if (!text) {
    return { ok: false, error: 'The "q" parameter is required' };
  }
  if (!SORT_OPTIONS.includes(sort as SortBy)) {
    return { ok: false, error: `The "sort" parameter must be one of: ${SORT_OPTIONS.join(', ')}` };
  }
  if (page === null) {
    return { ok: false, error: 'The "page" parameter must be a whole number from 1' };
  }

  return { ok: true, value: { query: text, genre, sort: sort as SortBy, page } };
};
