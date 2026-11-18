import React from 'react';
import { focusRing } from '../components/wedding/styles';

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

function Icon({ kind }) {
  if (kind === 'busy') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0 animate-spin text-caramel motion-reduce:animate-none">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
        <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'success') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 shrink-0 text-caramel">
        <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 10.5 L8.8 13 L14 7.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 shrink-0 text-red-300">
      <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 5.5 V11 M10 14 V14.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Bottom-of-screen message showing background upload progress and the result. */
const UploadToast = React.forwardRef(function UploadToast({ busy, done, failed, count, progress, onRetry, onDismiss }, ref) {
  const percent = Math.round(progress * 100);
  let kind = 'busy';
  let title;
  let detail = '';

  if (busy) {
    title = `Uploading ${plural(count, 'photo')}…`;
    detail = 'You can keep browsing. Please keep this site open until it finishes.';
  } else if (failed === 0) {
    kind = 'success';
    title = done === 1 ? 'Thank you! Your photo has been added to our gallery.' : `Thank you! Your ${done} photos have been added to our gallery.`;
  } else {
    kind = 'error';
    title = done === 0 ? `${failed === 1 ? 'Your photo' : `Your ${failed} photos`} couldn't be uploaded.` : `${done} of ${done + failed} photos uploaded.`;
    detail = done === 0 ? 'Please check your connection and try again.' : `${plural(failed, 'photo')} couldn't be sent. Please try again.`;
  }

  return (
    <div ref={ref} className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-10">
      <div className="pointer-events-auto w-full max-w-sm rounded-sm bg-espresso p-4 font-body text-cream shadow-2xl shadow-espresso/40">
        <div className="flex items-start gap-3">
          <Icon kind={kind} />
          <div className="min-w-0 flex-1" role="status" aria-live="polite">
            <p className="text-sm font-medium leading-snug">
              {title}
              {busy && <span aria-hidden="true" className="ml-1 tabular-nums text-cream/70">{percent}%</span>}
            </p>
            {detail && <p className="mt-1 text-xs leading-relaxed text-cream/70">{detail}</p>}
          </div>
          {!busy && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss"
              className={`-m-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-cream/70 transition hover:bg-cream/10 hover:text-cream ${focusRing}`}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
                <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        {busy && (
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-cream/15" aria-hidden="true">
            <div className="h-full rounded-full bg-caramel transition-[width] duration-300" style={{ width: `${Math.max(3, percent)}%` }} />
          </div>
        )}
        {!busy && failed > 0 && (
          <button
            type="button"
            onClick={onRetry}
            className={`mt-3 rounded-full bg-cream px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-espresso transition hover:bg-caramel ${focusRing}`}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
});

export default UploadToast;
