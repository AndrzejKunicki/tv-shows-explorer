import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Backdrop } from './Backdrop';

describe('Backdrop', () => {
  it('is decorative and hidden from assistive technologies', () => {
    const { container } = render(<Backdrop />);
    const backdrop = container.firstElementChild;

    expect(backdrop?.getAttribute('aria-hidden')).toBe('true');
    expect(backdrop?.textContent).toBe('');
  });
});
