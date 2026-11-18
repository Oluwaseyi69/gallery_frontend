import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { API_URL } from '../config';
import { prepareForUpload } from './prepareForUpload';
import { uploadPhoto } from './uploadPhoto';
import UploadToast from './UploadToast';

const UploadContext = createContext(null);

/** { add(files, name), busy } — add() starts uploading in the background and returns immediately. */
export const useUploads = () => useContext(UploadContext);

const CONCURRENCY = 2;
const PENDING = new Set(['queued', 'preparing', 'uploading']);
const PROGRESS_EVERY_MS = 150;
let nextId = 0;

/**
 * Runs photo uploads at the top of the app, so they keep going while the guest moves
 * between pages, and shows their progress and result in a toast.
 * They stop only if the guest closes the site, which the browser warns about.
 */
export function UploadProvider({ children }) {
  // One entry per photo: { id, status, loaded, total }. The files themselves live in a ref.
  const [items, setItems] = useState([]);
  const itemsRef = useRef(items);
  const jobs = useRef(new Map()); // id -> { file, name }
  const queue = useRef([]);
  const active = useRef(0);
  const lastProgressAt = useRef(new Map());
  const pump = useRef(() => {});

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const update = useCallback((id, patch) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const runJob = async (id, job) => {
    try {
      update(id, { status: 'preparing' });
      const file = await prepareForUpload(job.file);
      update(id, { status: 'uploading', loaded: 0, total: file.size });
      await uploadPhoto(file, job.name, (loaded) => {
        const now = Date.now();
        if (now - (lastProgressAt.current.get(id) || 0) < PROGRESS_EVERY_MS) return;
        lastProgressAt.current.set(id, now);
        update(id, { loaded: Math.min(loaded, file.size) });
      });
      update(id, { status: 'done', loaded: file.size });
      jobs.current.delete(id); // free the file's memory
    } catch (error) {
      console.error('Error uploading file:', error);
      update(id, { status: 'failed', loaded: 0 });
    } finally {
      lastProgressAt.current.delete(id);
    }
  };

  // Start queued uploads, up to CONCURRENCY at a time.
  pump.current = () => {
    while (active.current < CONCURRENCY && queue.current.length > 0) {
      const id = queue.current.shift();
      const job = jobs.current.get(id);
      if (!job) continue;
      active.current += 1;
      runJob(id, job).finally(() => {
        active.current -= 1;
        pump.current();
      });
    }
  };

  const add = useCallback((files, name) => {
    const added = files.map((file) => {
      nextId += 1;
      jobs.current.set(nextId, { file, name });
      queue.current.push(nextId);
      return { id: nextId, status: 'queued', loaded: 0, total: file.size };
    });
    // Successes from an earlier round were already reported; start a fresh count.
    setItems((current) => [...current.filter((item) => item.status !== 'done'), ...added]);
    pump.current();
  }, []);

  const retryFailed = useCallback(() => {
    const failedIds = itemsRef.current.filter((item) => item.status === 'failed').map((item) => item.id);
    setItems((current) =>
      current
        .filter((item) => item.status !== 'done')
        .map((item) => (failedIds.includes(item.id) ? { ...item, status: 'queued', loaded: 0 } : item))
    );
    queue.current.push(...failedIds);
    pump.current();
  }, []);

  const dismiss = useCallback(() => {
    itemsRef.current.filter((item) => !PENDING.has(item.status)).forEach((item) => jobs.current.delete(item.id));
    setItems((current) => current.filter((item) => PENDING.has(item.status)));
  }, []);

  const busy = items.some((item) => PENDING.has(item.status));
  const done = items.filter((item) => item.status === 'done').length;
  const failed = items.filter((item) => item.status === 'failed').length;
  const totalBytes = items.reduce((sum, item) => sum + (item.status === 'failed' ? 0 : item.total || 0), 0);
  const sentBytes = items.reduce((sum, item) => sum + (item.status === 'done' ? item.total : item.status === 'failed' ? 0 : item.loaded), 0);
  const progress = totalBytes ? sentBytes / totalBytes : 0;

  // Hide the "thank you" message after a while; failures stay until dismissed or retried.
  useEffect(() => {
    if (busy || items.length === 0 || failed > 0) return undefined;
    const timer = setTimeout(dismiss, 7000);
    return () => clearTimeout(timer);
  }, [busy, items.length, failed, dismiss]);

  // Warn before the guest closes the site mid-upload.
  useEffect(() => {
    if (!busy) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [busy]);

  // While the toast is showing, add matching space at the bottom of the page so it never
  // covers links or buttons the guest needs (they can always scroll them above it).
  const toastRef = useRef(null);
  const toastVisible = items.length > 0;
  useEffect(() => {
    const toast = toastRef.current;
    if (!toastVisible || !toast) return undefined;
    const reserveSpace = () => {
      document.body.style.paddingBottom = `${toast.offsetHeight + 8}px`;
    };
    reserveSpace();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(reserveSpace);
    observer?.observe(toast);
    return () => {
      observer?.disconnect();
      document.body.style.paddingBottom = '';
    };
  }, [toastVisible]);

  // The free Render server sleeps when idle; wake it early so saving photos and RSVPs is quick.
  useEffect(() => {
    fetch(`${API_URL}/api/health`).catch(() => {});
  }, []);

  const value = useMemo(() => ({ add, busy }), [add, busy]);

  return (
    <UploadContext.Provider value={value}>
      {children}
      {items.length > 0 && (
        <UploadToast
          ref={toastRef}
          busy={busy}
          done={done}
          failed={failed}
          count={items.length}
          progress={progress}
          onRetry={retryFailed}
          onDismiss={dismiss}
        />
      )}
    </UploadContext.Provider>
  );
}
