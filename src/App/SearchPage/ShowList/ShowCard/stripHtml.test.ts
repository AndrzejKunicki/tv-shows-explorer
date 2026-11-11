import { describe, expect, it } from 'vitest';
import { stripHtml } from './stripHtml';

describe('stripHtml', () => {
  it('removes tags and decodes basic entities', () => {
    expect(stripHtml('<p><b>Tom &amp; Jerry</b> &quot;classic&quot;</p>')).toBe('Tom & Jerry "classic"');
  });
});
