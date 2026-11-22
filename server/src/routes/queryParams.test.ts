import { describe, expect, it } from 'vitest';
import { parseInteger, parseSearchParams } from './queryParams.ts';

describe('parseInteger', () => {
  it('uses the fallback for a missing value', () => {
    expect(parseInteger(undefined, 1, 1)).toBe(1);
    expect(parseInteger('', 0, 0)).toBe(0);
  });

  it('reads a whole number not below the minimum', () => {
    expect(parseInteger('3', 1, 1)).toBe(3);
  });

  it('rejects other values', () => {
    expect(parseInteger('0', 1, 1)).toBeNull();
    expect(parseInteger('1.5', 1, 1)).toBeNull();
    expect(parseInteger('abc', 1, 1)).toBeNull();
    expect(parseInteger(['1', '2'], 1, 1)).toBeNull();
  });
});

describe('parseSearchParams', () => {
  it('reads all parameters', () => {
    expect(parseSearchParams({ q: ' lost ', genre: 'Drama', sort: 'rating', page: '2' })).toEqual({
      ok: true,
      value: { query: 'lost', genre: 'Drama', sort: 'rating', page: 2 },
    });
  });

  it('uses defaults for optional parameters', () => {
    expect(parseSearchParams({ q: 'lost', genre: '' })).toEqual({
      ok: true,
      value: { query: 'lost', genre: null, sort: 'relevance', page: 1 },
    });
  });

  it('requires a query', () => {
    expect(parseSearchParams({ q: '  ' })).toEqual({ ok: false, error: 'The "q" parameter is required' });
  });

  it('rejects an unknown sort order and a wrong page', () => {
    expect(parseSearchParams({ q: 'lost', sort: 'name' }).ok).toBe(false);
    expect(parseSearchParams({ q: 'lost', page: '0' }).ok).toBe(false);
  });
});
