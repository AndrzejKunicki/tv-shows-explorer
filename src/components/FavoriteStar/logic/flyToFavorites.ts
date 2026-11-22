/** The element the star flies to (the favorites counter); marked in its view with this attribute. */
export const FAVORITES_TARGET_SELECTOR = '[data-favorites-target]';
/** The star icon inside the counter; it grows when the flying star lands. */
export const FAVORITES_ICON_SELECTOR = '[data-favorites-icon]';
export const FLY_DURATION_MS = 650;

const STAR_PATH = 'm12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z';

const center = (rect: DOMRect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

/** A gold star drawn over the page at the clicked star, so it can fly above everything. */
const createFlyingStar = (rect: DOMRect) => {
  const star = document.createElement('div');
  star.setAttribute('aria-hidden', 'true');
  star.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="${STAR_PATH}" fill="#f2b544"/></svg>`;
  Object.assign(star.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    zIndex: '40',
    pointerEvents: 'none',
    filter: 'drop-shadow(0 0 8px rgb(242 181 68 / 0.9))',
  });
  document.body.append(star);

  return star;
};

/**
 * Flies a star from the clicked button to the favorites counter, then makes the counter's star grow.
 * Resolves when the star has arrived; at once when there is nothing to animate (no counter on the page,
 * reduced motion, no Web Animations API). Never rejects: it is decoration and must not break adding.
 */
export const flyToFavorites = async (from: HTMLElement | null): Promise<void> => {
  const target = document.querySelector<HTMLElement>(FAVORITES_TARGET_SELECTOR);
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  if (!from || !target || reduceMotion || typeof from.animate !== 'function') {
    return;
  }

  const fromRect = from.getBoundingClientRect();
  const start = center(fromRect);
  const end = center(target.getBoundingClientRect());
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const star = createFlyingStar(fromRect);

  // An arc: first up and a little forward, then down into the counter, shrinking on the way
  const flight = star.animate(
    [
      { transform: 'translate(0, 0) scale(1.2) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 80}px) scale(1.4) rotate(180deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.5) rotate(360deg)`, opacity: 0.6 },
    ],
    { duration: FLY_DURATION_MS, easing: 'cubic-bezier(0.5, 0, 0.3, 1)' },
  );

  try {
    await flight.finished;
  } catch {
    // A cancelled animation rejects `finished`; the favorite is saved anyway
  } finally {
    star.remove();
  }

  const icon = target.querySelector<HTMLElement>(FAVORITES_ICON_SELECTOR) ?? target;
  icon.animate(
    [
      { transform: 'scale(1)', filter: 'drop-shadow(0 0 0 transparent)' },
      { transform: 'scale(1.9)', filter: 'drop-shadow(0 0 6px rgb(242 181 68 / 0.95))', offset: 0.35 },
      { transform: 'scale(1)', filter: 'drop-shadow(0 0 0 transparent)' },
    ],
    { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  );
};
