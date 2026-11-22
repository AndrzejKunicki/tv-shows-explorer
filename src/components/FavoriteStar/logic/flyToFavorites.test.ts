import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FAVORITES_TARGET_SELECTOR, FLY_DURATION_MS, flyToFavorites } from './flyToFavorites';

const animate = vi.fn<HTMLElement['animate']>(() => ({ finished: Promise.resolve() }) as unknown as Animation);

const addElement = (attribute?: string) => {
  const element = document.createElement('button');
  if (attribute) {
    element.setAttribute(attribute, '');
  }
  element.animate = animate;
  document.body.append(element);

  return element;
};

const setReducedMotion = (matches: boolean) => {
  window.matchMedia = vi.fn(() => ({ matches }) as MediaQueryList);
};

describe('flyToFavorites', () => {
  beforeEach(() => {
    animate.mockClear();
    setReducedMotion(false);
    // jsdom has no Web Animations API; the flying star is a new element, so it gets it here
    HTMLElement.prototype.animate = animate;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it("flies a star from the button to the counter, removes it and makes the counter's star grow", async () => {
    const star = addElement();
    const target = addElement('data-favorites-target');
    const icon = document.createElement('span');
    icon.setAttribute('data-favorites-icon', '');
    target.append(icon);
    let flyingStars = 0;
    animate.mockImplementationOnce(() => {
      flyingStars = document.body.querySelectorAll('div[aria-hidden="true"]').length;

      return { finished: Promise.resolve() } as unknown as Animation;
    });

    await flyToFavorites(star);

    expect(flyingStars).toBe(1);
    expect(animate).toHaveBeenCalledTimes(2);
    expect(animate.mock.calls[0][1]).toMatchObject({ duration: FLY_DURATION_MS });
    expect(document.body.querySelector('div[aria-hidden="true"]')).toBeNull();
    expect(document.querySelector(FAVORITES_TARGET_SELECTOR)).toBe(target);
    expect(animate.mock.contexts[1]).toBe(icon);
  });

  it('resolves and cleans up when the flight is cancelled', async () => {
    const star = addElement();
    addElement('data-favorites-target');
    animate.mockReturnValueOnce({ finished: Promise.reject(new DOMException('Aborted', 'AbortError')) } as unknown as Animation);

    await expect(flyToFavorites(star)).resolves.toBeUndefined();

    expect(document.body.querySelector('div[aria-hidden="true"]')).toBeNull();
  });

  it('does nothing without a counter on the page or without a button', async () => {
    const star = addElement();

    await flyToFavorites(star);
    await flyToFavorites(null);

    expect(animate).not.toHaveBeenCalled();
  });

  it('does nothing when the user prefers reduced motion', async () => {
    setReducedMotion(true);
    const star = addElement();
    addElement('data-favorites-target');

    await flyToFavorites(star);

    expect(animate).not.toHaveBeenCalled();
  });
});
