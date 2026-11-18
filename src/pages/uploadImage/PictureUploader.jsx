import React, { useEffect, useRef, useState } from 'react';
import { fieldClass, focusRing } from '../../components/wedding/styles';
import { useUploads } from '../../uploads/UploadProvider';

export const MAX_PHOTOS = 4;

let nextPhotoId = 0;

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

const THUMBNAIL_WIDTH = 240;

/**
 * A tiny preview image, so large phone photos show up quickly instead of the browser
 * drawing all 12+ megapixels into a small tile. Falls back to the photo itself.
 */
async function makeThumbnail(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, {
        resizeWidth: THUMBNAIL_WIDTH,
        resizeQuality: 'medium',
        imageOrientation: 'from-image',
      });
      // Some browsers ignore the resize hint, so scale while drawing as well.
      const width = THUMBNAIL_WIDTH;
      const height = Math.max(1, Math.round((bitmap.height * width) / bitmap.width));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
      bitmap.close?.();
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
      if (blob) return URL.createObjectURL(blob);
    } catch {
      // Fall through to the original file.
    }
  }
  return URL.createObjectURL(file);
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10 text-caramel">
      <path
        d="M8 16h7l3-5h12l3 5h7a2 2 0 0 1 2 2v17a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V18a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="26" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Small preview with a soft placeholder while a large photo is still being read. */
function PreviewTile({ photo, index, total, onRemove }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <li className="relative">
      <div className={`aspect-square w-full rounded-sm bg-sand shadow-sm ${loaded ? '' : 'animate-pulse motion-reduce:animate-none'}`}>
        {photo.preview && (
          <img
            src={photo.preview}
            alt={`Selected for upload (${index + 1} of ${total})`}
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full rounded-sm object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(photo.id)}
        aria-label={`Remove photo ${index + 1}`}
        className={`absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-espresso text-cream shadow-md ring-2 ring-white transition hover:bg-bronze ${focusRing}`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
          <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
}

/**
 * Lets a guest pick up to 4 photos, shows small previews, then hands them to the
 * background uploader (see UploadProvider) so the guest can keep browsing.
 */
const PictureUploader = () => {
  const { add } = useUploads();
  // Each entry: { id, file, preview }
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const [failureMessage, setFailureMessage] = useState('');
  const [notice, setNotice] = useState('');
  const photosRef = useRef(photos);
  // Ids still selected, updated immediately (photosRef only updates after a render).
  const liveIds = useRef(new Set());

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // Free preview memory when the page closes.
  useEffect(
    () => () => {
      liveIds.current.clear();
      photosRef.current.forEach((photo) => photo.preview && URL.revokeObjectURL(photo.preview));
    },
    []
  );

  const handleFileChange = (event) => {
    const chosen = Array.from(event.target.files || []);
    event.target.value = ''; // so choosing the same photo again still works
    if (chosen.length === 0) return;

    const room = Math.max(0, MAX_PHOTOS - photosRef.current.length);
    const added = chosen.slice(0, room).map((file) => ({ id: ++nextPhotoId, file, preview: '' }));
    added.forEach((photo) => {
      liveIds.current.add(photo.id);
      makeThumbnail(photo.file).then((url) => {
        if (!liveIds.current.has(photo.id)) {
          URL.revokeObjectURL(url); // removed or uploaded before its preview was ready
          return;
        }
        setPhotos((current) => current.map((p) => (p.id === photo.id ? { ...p, preview: url } : p)));
      });
    });
    setPhotos((current) => [...current, ...added]);
    setSentMessage('');
    setFailureMessage('');
    setNotice(
      chosen.length > room
        ? `You can upload up to ${MAX_PHOTOS} photos at a time, so only the first ${plural(added.length, 'photo')} ${added.length === 1 ? 'was' : 'were'} added.`
        : ''
    );
  };

  const removePhoto = (id) => {
    liveIds.current.delete(id);
    const photo = photosRef.current.find((p) => p.id === id);
    if (photo?.preview) URL.revokeObjectURL(photo.preview);
    setPhotos((current) => current.filter((p) => p.id !== id));
    setNotice('');
  };

  const handleUpload = (event) => {
    event.preventDefault();
    const selected = photosRef.current;
    if (selected.length === 0) {
      setSentMessage('');
      setFailureMessage('Kindly choose at least one photo.');
      return;
    }
    add(selected.map((p) => p.file), description.trim());
    selected.forEach((p) => {
      liveIds.current.delete(p.id);
      if (p.preview) URL.revokeObjectURL(p.preview);
    });
    setPhotos([]);
    setNotice('');
    setFailureMessage('');
    setSentMessage(
      `Sending your ${plural(selected.length, 'photo')} in the background. Feel free to keep browsing; we'll let you know when ${selected.length === 1 ? "it's" : "they're"} in.`
    );
  };

  const canAddMore = photos.length < MAX_PHOTOS;
  const uploadLabel = photos.length > 1 ? `Upload ${photos.length} photos` : 'Upload photo';

  return (
    <form onSubmit={handleUpload} noValidate className="space-y-6">
      <div className="rounded-sm has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-bronze">
        <input
          id="upload-file"
          type="file"
          accept="image/*"
          multiple
          disabled={!canAddMore}
          onChange={handleFileChange}
          className="sr-only"
        />

        {photos.length === 0 ? (
          <label
            htmlFor="upload-file"
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-espresso/30 bg-white px-6 py-10 text-center transition hover:border-bronze"
          >
            <CameraIcon />
            <span className="font-display text-2xl">Choose up to {MAX_PHOTOS} photos</span>
            <span className="text-sm text-espresso/60">Tap here to pick from your gallery or camera</span>
          </label>
        ) : (
          <div className="rounded-sm border border-espresso/10 bg-white px-4 pb-3 pt-5">
            <ul className="grid grid-cols-4 gap-3" aria-label="Photos to upload">
              {photos.map((photo, index) => (
                <PreviewTile key={photo.id} photo={photo} index={index} total={photos.length} onRemove={removePhoto} />
              ))}
              {canAddMore && (
                <li>
                  <label
                    htmlFor="upload-file"
                    className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-espresso/30 text-bronze transition hover:border-bronze hover:bg-sand/40"
                  >
                    <span aria-hidden="true" className="font-display text-3xl leading-none">+</span>
                    <span className="mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.15em]">Add</span>
                  </label>
                </li>
              )}
            </ul>
            <p className="mt-3 text-center text-xs text-espresso/60">
              {photos.length} of {MAX_PHOTOS} photos selected
            </p>
          </div>
        )}
      </div>

      {notice && (
        <p className="text-center text-sm text-bronze" role="status">{notice}</p>
      )}

      <div>
        <label htmlFor="upload-name" className="mb-2 block text-sm font-medium">
          Your name <span className="font-normal text-espresso/60">(optional)</span>
        </label>
        <input
          id="upload-name"
          type="text"
          autoComplete="name"
          maxLength={100}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={fieldClass}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-espresso px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-cream transition hover:bg-bronze"
      >
        {uploadLabel}
      </button>

      {sentMessage && (
        <p className="flex items-start justify-center gap-2 text-center text-sm font-medium text-bronze" role="status">
          {sentMessage}
        </p>
      )}
      {failureMessage && (
        <p className="text-center text-sm font-medium text-red-700" role="alert">{failureMessage}</p>
      )}
    </form>
  );
};

export default PictureUploader;
