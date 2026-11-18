import React, { useEffect, useRef, useState } from 'react';
import { API_URL } from '../../config';
import { fieldClass } from '../../components/wedding/styles';

const SUBMITTED_KEY = 'rsvpSubmitted';
const GUEST_OPTIONS = [1, 2, 3, 4, 5];

const readSubmitted = () => {
  try {
    return JSON.parse(localStorage.getItem(SUBMITTED_KEY));
  } catch {
    return null;
  }
};

const saveSubmitted = (value) => {
  try {
    if (value) localStorage.setItem(SUBMITTED_KEY, JSON.stringify(value));
    else localStorage.removeItem(SUBMITTED_KEY);
  } catch {
    // Storage unavailable; the thank-you note just won't be remembered.
  }
};

export default function RsvpForm() {
  const [submitted, setSubmitted] = useState(readSubmitted);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState(null);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState('');
  const slowTimer = useRef(null);

  useEffect(() => () => clearTimeout(slowTimer.current), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Please enter your name.');
    if (attending === null) return setError('Please let us know if you can make it.');

    setSending(true);
    // The free Render server sleeps when idle and can take up to a minute to wake.
    slowTimer.current = setTimeout(() => setSlow(true), 6000);
    try {
      const response = await fetch(`${API_URL}/api/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, attending, guests: attending ? guests : 0, message }),
      });
      const result = await response.json();
      if (!response.ok || result.status !== 'Success') {
        setError(result.message || 'Something went wrong. Please try again.');
        return;
      }
      const record = { name: name.trim(), attending };
      saveSubmitted(record);
      setSubmitted(record);
    } catch {
      setError('We could not send your response. Please check your connection and try again.');
    } finally {
      clearTimeout(slowTimer.current);
      setSlow(false);
      setSending(false);
    }
  };

  const startOver = () => {
    saveSubmitted(null);
    setSubmitted(null);
    setName('');
    setPhone('');
    setAttending(null);
    setGuests(1);
    setMessage('');
  };

  if (submitted) {
    const firstName = submitted.name.split(' ')[0];
    return (
      <div className="text-center" role="status">
        <p className="font-display text-3xl sm:text-4xl">Thank you, {firstName}!</p>
        <p className="mx-auto mt-4 max-w-md text-espresso/80">
          {submitted.attending
            ? "We've saved your seat and can't wait to celebrate with you."
            : "We'll miss you, and we're grateful for your love and prayers."}
        </p>
        <button type="button" onClick={startOver} className="mt-8 text-sm text-bronze underline underline-offset-4 hover:text-espresso">
          Send a response for someone else
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 text-left">
      <div>
        <label htmlFor="rsvp-name" className="mb-2 block text-sm font-medium">Your name</label>
        <input id="rsvp-name" type="text" autoComplete="name" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="rsvp-phone" className="mb-2 block text-sm font-medium">
          Phone number <span className="font-normal text-espresso/60">(optional)</span>
        </label>
        <input id="rsvp-phone" type="tel" autoComplete="tel" maxLength={20} placeholder="+234…" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium">Will you be joining us?</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            [true, 'Joyfully accept'],
            [false, 'Regretfully decline'],
          ].map(([value, label]) => (
            <label
              key={label}
              className={`flex cursor-pointer items-center justify-center rounded-sm border px-4 py-3 text-center transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-bronze ${
                attending === value ? 'border-espresso bg-espresso text-cream' : 'border-espresso/20 bg-white hover:border-bronze'
              }`}
            >
              <input type="radio" name="attending" className="sr-only" checked={attending === value} onChange={() => setAttending(value)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {attending && (
        <div>
          <label htmlFor="rsvp-guests" className="mb-2 block text-sm font-medium">How many people, including you?</label>
          {/* Own arrow instead of the browser's, which sits right against the edge. */}
          <div className="relative">
            <select
              id="rsvp-guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className={`${fieldClass} cursor-pointer appearance-none pr-12`}
            >
              {GUEST_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-bronze"
            >
              <path d="M4 6 L8 10 L12 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="rsvp-message" className="mb-2 block text-sm font-medium">
          A message for the couple <span className="font-normal text-espresso/60">(optional)</span>
        </label>
        <textarea id="rsvp-message" rows={3} maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} className={fieldClass} />
      </div>

      {error && <p className="text-sm font-medium text-red-700" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-full bg-espresso px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-cream transition hover:bg-bronze disabled:cursor-wait disabled:opacity-70"
      >
        {sending ? 'Sending…' : 'Send RSVP'}
      </button>
      {slow && <p className="text-center text-sm text-espresso/70" role="status">Still sending. This can take up to a minute, please keep this page open.</p>}
    </form>
  );
}
