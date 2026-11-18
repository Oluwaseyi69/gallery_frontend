import React from 'react';
import { useNavigate } from 'react-router-dom';
import { focusRing } from './styles';

/**
 * Goes back to the previous page in the site. If the visitor arrived here directly
 * (e.g. from a QR code or shared link), it takes them to the invitation instead of
 * leaving the site.
 */
export default function BackButton({ className = '' }) {
  const navigate = useNavigate();

  const goBack = () => {
    const cameFromThisSite = (window.history.state?.idx ?? 0) > 0;
    if (cameFromThisSite) navigate(-1);
    else navigate('/');
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className={`inline-flex items-center gap-2 rounded-full border border-espresso/20 bg-cream/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-espresso backdrop-blur transition hover:border-espresso hover:bg-espresso hover:text-cream ${focusRing} ${className}`}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
        <path d="M10 3 L5 8 L10 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back
    </button>
  );
}
