import { useRef } from 'react';

/** Share of the visible width scrolled by one click on the arrows. */
export const SCROLL_STEP = 0.85;

export const usePresenter = ({ id, title }: { id: string; title: string }) => {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollByStep = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    track.scrollBy({ left: direction * track.clientWidth * SCROLL_STEP, behavior: 'smooth' });
  };
  const handlePrev = () => scrollByStep(-1);
  const handleNext = () => scrollByStep(1);
  const titleId = `${id}-title`;
  const prevLabel = `Scroll ${title} back`;
  const nextLabel = `Scroll ${title} forward`;

  return { trackRef, titleId, prevLabel, nextLabel, handlePrev, handleNext };
};
