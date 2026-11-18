import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import RsvpList from '../rsvps/RsvpList';
import BackButton from '../../../components/wedding/BackButton';
import Lightbox, { lightButton } from '../../../components/wedding/Lightbox';
import { Eyebrow, Ornament, PageFrame } from '../../../components/wedding/Decor';
import { fieldClass, focusRing, smallLink } from '../../../components/wedding/styles';
import { WEDDING } from '../../Invitation/weddingDetails';

const loginUrl = `${API_URL}/user/login`;
const getImagesUrl = `${API_URL}/api/images`;

// Keeps the login for this browser tab so a refresh doesn't log you out.
const TOKEN_KEY = 'galleryToken';

const readStoredToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

const storeToken = (token) => {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage unavailable (e.g. private mode); the login just won't survive a refresh.
  }
};

// Cloudinary resizes on the fly when a transformation is added after "/upload/".
// The grid and viewer use smaller versions; downloads keep the original.
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;
const THUMBNAIL = 'c_limit,w_600,q_auto,f_auto';
const FULL_SCREEN = 'c_limit,w_1600,q_auto,f_auto';
export const cloudinarySized = (url, transformation) => {
  const match = typeof url === 'string' ? url.match(CLOUDINARY_UPLOAD) : null;
  return match ? `${match[1]}${transformation}/${match[2]}` : url;
};

// If the resized version can't load (e.g. resizing is switched off in Cloudinary), show the original.
const showOriginalOnError = (original) => (event) => {
  const img = event.currentTarget;
  if (img.dataset.usedOriginal) return;
  img.dataset.usedOriginal = 'true';
  img.src = original;
};

const fileName = (image, index) => {
  const who = (image.name || 'guest').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'guest';
  const ext = (image.link.match(/\.([a-z0-9]{3,4})(?:\?|$)/i) || [])[1] || 'jpg';
  return `${who}-photo-${index + 1}.${ext}`;
};

const TABS = [
  ['photos', 'Photos'],
  ['rsvps', 'RSVPs'],
];

const pillButton = `inline-flex items-center gap-2 rounded-full border border-espresso/20 bg-cream/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-espresso backdrop-blur transition hover:border-espresso hover:bg-espresso hover:text-cream ${focusRing}`;

function PhotoGrid({ images, error, onOpen, onDownload, downloadError }) {
  if (error) return <p className="text-center font-medium text-red-700" role="alert">{error}</p>;
  if (!images) return <p className="text-center text-espresso/60">Loading photos…</p>;
  if (images.length === 0) {
    return (
      <div className="text-center">
        <p className="font-display text-3xl">No photos yet</p>
        <p className="mx-auto mt-3 max-w-sm text-espresso/70">
          Photos guests share on the <Link to="/upload" className={smallLink}>upload page</Link> will appear here.
        </p>
      </div>
    );
  }
  return (
    <>
      {downloadError && <p className="mb-4 text-center font-medium text-red-700" role="alert">{downloadError}</p>}
      <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <li key={image.id || image.link}>
            <button
              type="button"
              onClick={() => onOpen(index)}
              aria-label={`View photo ${index + 1} full size`}
              className={`group block w-full overflow-hidden rounded-sm bg-sand shadow-md shadow-espresso/10 ${focusRing}`}
            >
              <img
                src={cloudinarySized(image.link, THUMBNAIL)}
                onError={showOriginalOnError(image.link)}
                alt={image.name ? `Shared by ${image.name}` : 'Shared by a guest'}
                loading="lazy"
                className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
            </button>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="truncate text-sm text-espresso/80">From {image.name || 'a guest'}</p>
              <button
                type="button"
                onClick={() => onDownload(image, index)}
                aria-label={`Download photo ${index + 1}`}
                title="Download"
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-bronze transition hover:bg-sand hover:text-espresso ${focusRing}`}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
                  <path d="M8 2.5 V10 M4.5 6.8 L8 10.3 L11.5 6.8 M3 13.2 H13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

const ImageGallery = () => {
  const [token, setToken] = useState(readStoredToken);
  const isLoggedIn = Boolean(token);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [tab, setTab] = useState('photos');
  const [images, setImages] = useState(null);
  const [imagesError, setImagesError] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const slowTimer = useRef(null);

  useEffect(() => () => clearTimeout(slowTimer.current), []);

  const handleUnauthorized = useCallback(() => {
    storeToken('');
    setToken('');
    setImages(null);
    setLoginError('Your session has expired. Please log in again.');
  }, []);

  const logOut = () => {
    storeToken('');
    setToken('');
    setImages(null);
    setTab('photos');
    setLoginError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    // The free Render server sleeps when idle and can take up to a minute to wake.
    slowTimer.current = setTimeout(() => setSlow(true), 8000);
    try {
      const response = await fetch(loginUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (!response.ok || result.status !== 'Success') {
        setLoginError(result.message || 'Login failed. Please check your details.');
        return;
      }

      storeToken(result.data.token);
      setToken(result.data.token);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Could not reach the server. Please try again.');
    } finally {
      clearTimeout(slowTimer.current);
      setSlow(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    setImagesError('');

    const fetchImages = async () => {
      try {
        const response = await axios.get(getImagesUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Newest first.
        if (!cancelled) setImages([...(response.data.data || [])].reverse());
      } catch (error) {
        if (cancelled) return;
        console.error('Error fetching image URLs:', error);
        if (error.response?.status === 401) handleUnauthorized();
        else setImagesError('Failed to load photos. Please try again.');
      }
    };

    fetchImages();
    return () => {
      cancelled = true;
    };
  }, [token, handleUnauthorized]);

  const handleDownload = (image, index) => {
    setDownloadError('');
    fetch(image.link)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName(image, index);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      })
      .catch((error) => {
        console.error('Download failed:', error);
        setDownloadError('That photo could not be downloaded. Please try again.');
      });
  };

  const imageCount = images ? images.length : 0;
  const closeLightbox = useCallback(() => setOpenIndex(null), []);
  const stepLightbox = useCallback(
    (delta) => setOpenIndex((index) => (index + delta + imageCount) % imageCount),
    [imageCount]
  );
  const lightboxPhotos = (images || []).map((image) => ({
    large: cloudinarySized(image.link, FULL_SCREEN),
    fallback: image.link,
    alt: image.name ? `Shared by ${image.name}` : 'Shared by a guest',
  }));

  return (
    <div className="relative min-h-screen bg-cream font-body text-espresso antialiased">
      <PageFrame />
      <div className="absolute left-10 top-10 z-50 sm:left-14 sm:top-14">
        <BackButton />
      </div>
      {isLoggedIn && (
        <div className="absolute right-10 top-10 z-50 sm:right-14 sm:top-14">
          <button type="button" onClick={logOut} className={pillButton}>
            Log out
          </button>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
        <header className="text-center">
          <Eyebrow>
            {WEDDING.groom.firstName} &amp; {WEDDING.bride.firstName}
          </Eyebrow>
          <h1 className="mt-3 text-balance font-display text-5xl font-medium sm:text-6xl">
            {isLoggedIn ? 'Guest photos & RSVPs' : "Couple's login"}
          </h1>
          <Ornament className="mt-5 text-caramel" />
        </header>

        {!isLoggedIn ? (
          <form
            onSubmit={handleLogin}
            noValidate
            className="mx-auto mt-10 max-w-sm space-y-5 rounded-sm border border-espresso/10 bg-white/60 p-6 sm:p-8"
          >
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium">Username</label>
              <input
                type="text"
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClass}
              />
            </div>
            {loginError && <p className="text-sm font-medium text-red-700" role="alert">{loginError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-espresso px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-cream transition hover:bg-bronze disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>
            {slow && (
              <p className="text-center text-sm text-espresso/70" role="status">
                Waking up the server. This can take up to a minute.
              </p>
            )}
            <p className="text-center text-xs uppercase tracking-[0.25em] text-espresso/50">For the couple only</p>
          </form>
        ) : (
          <>
            <div className="mt-10 flex justify-center">
              <div role="tablist" aria-label="Sections" className="inline-flex rounded-full border border-espresso/15 bg-white/60 p-1">
                {TABS.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={tab === key}
                    onClick={() => setTab(key)}
                    className={`rounded-full px-6 py-2 text-xs font-medium uppercase tracking-[0.2em] transition ${
                      tab === key ? 'bg-espresso text-cream' : 'text-espresso/70 hover:text-espresso'
                    } ${focusRing}`}
                  >
                    {label}
                    {key === 'photos' && images ? ` · ${images.length}` : ''}
                  </button>
                ))}
              </div>
            </div>

            <section className="mt-10">
              {tab === 'rsvps' ? (
                <RsvpList token={token} onUnauthorized={handleUnauthorized} />
              ) : (
                <PhotoGrid
                  images={images}
                  error={imagesError}
                  onOpen={setOpenIndex}
                  onDownload={handleDownload}
                  downloadError={downloadError}
                />
              )}
            </section>
          </>
        )}
      </main>

      {openIndex !== null && images && images[openIndex] && (
        <Lightbox
          photos={lightboxPhotos}
          index={openIndex}
          onClose={closeLightbox}
          onStep={stepLightbox}
          actions={
            <button type="button" onClick={() => handleDownload(images[openIndex], openIndex)} className={`${lightButton} px-4 text-xs font-medium uppercase tracking-[0.2em]`}>
              Download
            </button>
          }
        />
      )}
    </div>
  );
};

export default ImageGallery;
