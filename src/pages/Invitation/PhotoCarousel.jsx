import React, { useCallback, useEffect, useRef, useState } from 'react';
import { focusRing, roundIconButton } from '../../components/wedding/styles';
import Lightbox, { Chevron } from '../../components/wedding/Lightbox';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function PhotoCarousel({ photos }) {
  const track = useRef(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);

  const goTo = useCallback((index) => {
    const el = track.current;
    const slide = el?.children[index];
    if (!slide) return;
    el.scrollTo({
      left: slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, []);

  const step = (delta) => goTo((active + delta + photos.length) % photos.length);

  // Work out which slide is closest to the middle as the visitor swipes or scrolls.
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = track.current;
      if (!el) return;
      const middle = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let best = Infinity;
      Array.from(el.children).forEach((slide, i) => {
        const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - middle);
        if (distance < best) {
          best = distance;
          closest = i;
        }
      });
      setActive(closest);
    });
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Open on the second photo so there are photos on both sides of the centre.
  useEffect(() => {
    const el = track.current;
    const slide = el?.children[1];
    if (slide) el.scrollLeft = slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2;
  }, []);

  const openIndexRef = useRef(null);
  useEffect(() => {
    openIndexRef.current = openIndex;
  }, [openIndex]);

  const closeLightbox = useCallback(() => {
    // Leave the carousel on the photo they were last viewing.
    if (openIndexRef.current !== null) goTo(openIndexRef.current);
    setOpenIndex(null);
  }, [goTo]);

  const stepLightbox = useCallback(
    (delta) => setOpenIndex((index) => (index + delta + photos.length) % photos.length),
    [photos.length]
  );

  const onTrackKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    <div aria-roledescription="carousel" aria-label="Our moments">
      <div
        ref={track}
        onScroll={onScroll}
        onKeyDown={onTrackKeyDown}
        tabIndex={0}
        aria-label="Photos. Use the arrow keys to move between them."
        className={`carousel-track scrollbar-none relative flex snap-x snap-mandatory gap-4 overflow-x-auto py-2 sm:gap-6 ${focusRing}`}
      >
        {photos.map((photo, index) => (
          <div
            key={photo.large}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${photos.length}`}
            className="carousel-slide shrink-0 snap-center"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className={`group block w-full overflow-hidden rounded-sm shadow-lg shadow-espresso/10 transition duration-500 motion-reduce:transition-none ${
                index === active ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-60'
              } ${focusRing}`}
              aria-label={`View photo ${index + 1} of ${photos.length} full size`}
            >
              <img
                src={photo.small}
                srcSet={`${photo.small} 600w, ${photo.large} 1400w`}
                sizes="(min-width: 1024px) min(30vw, 440px), (min-width: 640px) 44vw, 78vw"
                alt={photo.alt}
                loading="lazy"
                draggable="false"
                className="aspect-[4/5] w-full object-cover"
              />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        <button type="button" onClick={() => step(-1)} className={roundIconButton} aria-label="Previous photo">
          <Chevron direction="left" />
        </button>
        <div className="flex items-center gap-2">
          {photos.map((photo, index) => (
            <button
              key={photo.large}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to photo ${index + 1}`}
              aria-current={index === active}
              className={`h-2 rounded-full transition-all ${index === active ? 'w-6 bg-bronze' : 'w-2 bg-espresso/25 hover:bg-espresso/50'} ${focusRing}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => step(1)} className={roundIconButton} aria-label="Next photo">
          <Chevron direction="right" />
        </button>
      </div>
      <p className="mt-4 text-center text-xs uppercase tracking-[0.25em] text-espresso/60">Tap a photo to view it in full</p>

      {openIndex !== null && (
        <Lightbox photos={photos} index={openIndex} onClose={closeLightbox} onStep={stepLightbox} />
      )}
    </div>
  );
}
