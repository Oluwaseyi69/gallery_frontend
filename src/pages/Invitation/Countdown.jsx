import React, { useEffect, useState } from 'react';

function splitTime(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return [
    { label: 'days', value: Math.floor(total / 86400) },
    { label: 'hours', value: Math.floor(total / 3600) % 24 },
    { label: 'minutes', value: Math.floor(total / 60) % 60 },
    { label: 'seconds', value: total % 60 },
  ];
}

export default function Countdown({ startsAt, endsAt }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();

  if (now >= end) {
    return <p className="font-display text-3xl italic sm:text-4xl">Thank you for celebrating with us</p>;
  }
  if (now >= start) {
    return <p className="font-display text-3xl italic sm:text-4xl">Today is the day!</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-6" role="timer" aria-label="Time left until the celebration">
      {splitTime(start - now).map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-display text-5xl lining-nums tabular-nums leading-none sm:text-7xl">
            {String(value).padStart(2, '0')}
          </span>
          <span className="mt-3 text-[0.65rem] uppercase tracking-[0.25em] text-caramel sm:text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}
