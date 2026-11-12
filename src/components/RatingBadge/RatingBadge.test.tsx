import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RatingBadge } from './RatingBadge';

describe('RatingBadge', () => {
  it('shows the rating with a full text for screen readers', () => {
    const { container } = render(<RatingBadge rating="8.4" />);

    expect(container.textContent).toBe('Rated 8.4 out of 10');
  });
});
