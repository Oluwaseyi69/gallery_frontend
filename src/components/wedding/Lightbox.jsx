import React, { useEffect, useRef } from 'react';
import { focusRing } from './styles';

export function Chevron({ direction }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
      <path
        d={direction === 'left' ? 'M10 3 L5 8 L10 13' : 'M6 3 L11 8 L6 13'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Button style for use on the lightbox's dark background (e.g. extra actions). */
export const lightButton = `inline-flex h-11 min-w-[2.75rem] items-center justify-center gap-2 rounded-full border border-cream/30 text-cream transition hover:bg-cream hover:text-espresso ${focusRing}`;

/**
 * Full-screen view of one photo, uncropped, with close / previous / next.
 * photos: [{ large, alt, fallback? }]. onClose and onStep should be stable (useCallback).
 * actions: optional extra buttons shown top-left (e.g. Download).
 */
export default function Lightbox({ photos, index, onClose, onStep, actions = null }) {
  const closeButton = useRef(null);
  const touchStartX = useRef(null);
  const several = photos.length > 1;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButton.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [onClose, onStep]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (several && Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      className="fixed inset-0 z-50 flex flex-col bg-espresso/95"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between gap-3 p-4 sm:p-6">
        <div onClick={(e) => e.stopPropagation()}>{actions}</div>
        <button ref={closeButton} type="button" onClick={onClose} className={`${lightButton} w-11`} aria-label="Close photo">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
            <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <img
          key={photos[index].large}
          src={photos[index].large}
          onError={(e) => {
            // Optional photos[i].fallback: shown if the main image can't load.
            const { fallback } = photos[index];
            if (fallback && !e.currentTarget.dataset.usedFallback) {
              e.currentTarget.dataset.usedFallback = 'true';
              e.currentTarget.src = fallback;
            }
          }}
          alt={photos[index].alt}
          className="max-h-full max-w-full rounded-sm object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="flex items-center justify-center gap-6 p-5 sm:p-6" onClick={(e) => e.stopPropagation()}>
        {several && (
          <button type="button" onClick={() => onStep(-1)} className={`${lightButton} w-11`} aria-label="Previous photo">
            <Chevron direction="left" />
          </button>
        )}
        <p className="min-w-[4rem] text-center text-xs uppercase tracking-[0.25em] text-cream/70">
          {index + 1} / {photos.length}
        </p>
        {several && (
          <button type="button" onClick={() => onStep(1)} className={`${lightButton} w-11`} aria-label="Next photo">
            <Chevron direction="right" />
          </button>
        )}
      </div>
    </div>
  );
}
