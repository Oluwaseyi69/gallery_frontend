// Calendar, map, phone and WhatsApp links for the invitation.

const venueLine = (w) => `${w.venue.building}, ${w.venue.hall}, ${w.venue.address}`;
const eventTitle = (w) => `${w.groom.firstName} & ${w.bride.firstName}: ${w.eventName}`;

// 2026-11-28T11:00:00.000Z -> 20261128T110000Z
const toUtcStamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function mapsUrl(w) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueLine(w))}`;
}

export function googleCalendarUrl(w) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(w),
    dates: `${toUtcStamp(new Date(w.startsAt))}/${toUtcStamp(new Date(w.endsAt))}`,
    location: venueLine(w),
    details: `Dress code: ${w.dressCode}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

const escapeIcs = (text) =>
  text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

// iCalendar lines must be folded at 75 characters.
const foldIcs = (line) => line.match(/.{1,73}/g).join('\r\n ');

export function buildIcs(w, now = new Date()) {
  const start = toUtcStamp(new Date(w.startsAt));
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${start}-${w.groom.firstName}-${w.bride.firstName}@invitation`.toLowerCase(),
    `DTSTAMP:${toUtcStamp(now)}`,
    `DTSTART:${start}`,
    `DTEND:${toUtcStamp(new Date(w.endsAt))}`,
    `SUMMARY:${escapeIcs(eventTitle(w))}`,
    `LOCATION:${escapeIcs(venueLine(w))}`,
    `DESCRIPTION:${escapeIcs(`Dress code: ${w.dressCode}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(foldIcs).join('\r\n') + '\r\n';
}

export function downloadIcs(w) {
  const blob = new Blob([buildIcs(w)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${w.groom.firstName}-${w.bride.firstName}.ics`.toLowerCase();
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// +2348160612143 -> +234 816 061 2143. Numbers that don't fit the pattern are shown as given.
export function formatPhone(phone) {
  const match = phone.match(/^\+234(\d{3})(\d{3})(\d{4})$/);
  return match ? `+234 ${match[1]} ${match[2]} ${match[3]}` : phone;
}

export const whatsappUrl = (phone) => `https://wa.me/${phone.replace(/\D/g, '')}`;
