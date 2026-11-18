// Shrinks large phone photos before upload so they send much faster.
// A 4000px, 8 MB camera photo typically becomes 2560px and under 1 MB, which still
// looks sharp on any screen and prints well up to about 8x6 inches.
// Re-encoding also drops hidden metadata such as GPS location.

export const MAX_EDGE = 2560;
const QUALITY = 0.85;
const SMALL_ENOUGH_BYTES = 1.5 * 1024 * 1024;
// PNG (transparency) and GIF (animation) are sent untouched; so is anything we can't decode.
const COMPRESSIBLE = /^image\/(jpeg|jpg|heic|heif|webp)$/i;

const LOAD_TIMEOUT_MS = 20000;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    const finish = (error) => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      if (error) reject(error);
      else resolve(img);
    };
    // Never let a photo the browser can't read hold up the upload; the original is sent instead.
    const timer = setTimeout(() => finish(new Error('Timed out reading image')), LOAD_TIMEOUT_MS);
    img.onload = () => finish();
    img.onerror = () => finish(new Error('Could not read image'));
    img.src = url;
  });
}

const jpgName = (name) => `${(name || 'photo').replace(/\.[^.]+$/, '')}.jpg`;

/** Returns a smaller JPEG File when that helps, otherwise the original file. Never throws. */
export async function prepareForUpload(file) {
  if (file.type && !COMPRESSIBLE.test(file.type)) return file;
  try {
    const img = await loadImage(file);
    const longest = Math.max(img.naturalWidth, img.naturalHeight);
    if (longest <= MAX_EDGE && file.size <= SMALL_ENOUGH_BYTES) return file;

    const scale = Math.min(1, MAX_EDGE / longest);
    const width = Math.round(img.naturalWidth * scale);
    const height = Math.round(img.naturalHeight * scale);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    // Browsers apply the photo's rotation (EXIF orientation) when drawing it.
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY));
    canvas.width = 0; // release the canvas memory promptly (matters on iPhones)
    canvas.height = 0;

    if (!blob || blob.size >= file.size) return file;
    return new File([blob], jpgName(file.name), { type: 'image/jpeg', lastModified: file.lastModified });
  } catch {
    return file;
  }
}
