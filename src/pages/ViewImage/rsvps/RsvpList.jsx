import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../config';
import { focusRing, outlineButton } from '../../../components/wedding/styles';

// Excel treats cells starting with = + - @ as formulas; prefix them so guest input stays text.
const csvCell = (value) => {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function downloadCsv(rsvps) {
  const header = ['Name', 'Phone', 'Attending', 'Guests', 'Message', 'Received'];
  const rows = rsvps.map((r) => [r.name, r.phone, r.attending ? 'Yes' : 'No', r.guests, r.message, r.createdAt]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'rsvps.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Stat({ label, value }) {
  return (
    <div className="rounded-sm border border-espresso/10 bg-white/60 px-3 py-5 text-center">
      <dt className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-bronze">{label}</dt>
      <dd className="mt-2 font-display text-4xl leading-none lining-nums">{value}</dd>
    </div>
  );
}

export default function RsvpList({ token, onUnauthorized }) {
  const [rsvps, setRsvps] = useState(null);
  const [error, setError] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/rsvps`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setRsvps(response.data.data || []);
      } catch (e) {
        if (cancelled) return;
        if (e.response?.status === 401) onUnauthorized();
        else setError('Failed to load RSVPs. Please try again.');
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [token, onUnauthorized]);

  const askToDelete = (id) => {
    setDeleteError('');
    setConfirmingId(id);
  };

  const deleteRsvp = async (id) => {
    setDeleteError('');
    setDeletingId(id);
    try {
      const response = await axios.delete(`${API_URL}/api/rsvps/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.status !== 'Success') {
        setDeleteError(response.data?.message || 'Could not delete the RSVP. Please try again.');
        return;
      }
      setRsvps((current) => current.filter((r) => r.id !== id));
      setConfirmingId(null);
    } catch (e) {
      if (e.response?.status === 401) onUnauthorized();
      else setDeleteError('Could not delete the RSVP. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (error) return <p className="text-center font-medium text-red-700" role="alert">{error}</p>;
  if (!rsvps) return <p className="text-center text-espresso/60">Loading RSVPs…</p>;

  const coming = rsvps.filter((r) => r.attending);
  const people = coming.reduce((sum, r) => sum + r.guests, 0);

  return (
    <div>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="People coming" value={people} />
        <Stat label="Said yes" value={coming.length} />
        <Stat label="Said no" value={rsvps.length - coming.length} />
        <Stat label="Replies" value={rsvps.length} />
      </dl>

      {rsvps.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button type="button" onClick={() => downloadCsv(rsvps)} className={outlineButton}>
            Download CSV
          </button>
        </div>
      )}

      {deleteError && <p className="mt-6 text-center font-medium text-red-700" role="alert">{deleteError}</p>}

      {rsvps.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="font-display text-3xl">No RSVPs yet</p>
          <p className="mx-auto mt-3 max-w-sm text-espresso/70">Replies from the invitation will appear here.</p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rsvps.map((r) => (
            <li key={r.id} className="flex flex-col rounded-sm border border-espresso/10 bg-white/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-2xl leading-tight">{r.name}</p>
                <span
                  className={`mt-1 shrink-0 rounded-full px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] ${
                    r.attending ? 'bg-espresso text-cream' : 'border border-espresso/20 text-espresso/60'
                  }`}
                >
                  {r.attending ? `Coming · ${r.guests}` : 'Not coming'}
                </span>
              </div>
              {r.phone && (
                <a href={`tel:${r.phone.replace(/[^\d+]/g, '')}`} className="mt-1 self-start text-sm text-bronze hover:text-espresso">
                  {r.phone}
                </a>
              )}
              {r.message && <p className="mt-3 font-display text-lg italic leading-snug text-espresso/80">“{r.message}”</p>}

              <div className="mt-auto flex min-h-[32px] items-center justify-between gap-3 pt-4">
                <p className="text-xs text-espresso/50">{formatDate(r.createdAt)}</p>
                {confirmingId === r.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-espresso/70">Delete?</span>
                    <button
                      type="button"
                      onClick={() => deleteRsvp(r.id)}
                      disabled={deletingId === r.id}
                      className={`rounded-full bg-red-700 px-3 py-1 text-xs font-medium text-white hover:bg-red-800 disabled:cursor-wait disabled:opacity-60 ${focusRing}`}
                    >
                      {deletingId === r.id ? 'Deleting…' : 'Yes, delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingId(null)}
                      disabled={deletingId === r.id}
                      className={`rounded-full border border-espresso/20 px-3 py-1 text-xs text-espresso/80 hover:bg-sand ${focusRing}`}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => askToDelete(r.id)}
                    aria-label={`Delete the RSVP from ${r.name}`}
                    className={`rounded-full px-2 py-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-red-700 hover:bg-red-50 ${focusRing}`}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
