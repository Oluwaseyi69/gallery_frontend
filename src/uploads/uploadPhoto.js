import axios from 'axios';
import { API_URL, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from '../config';

/**
 * Uploads one photo to Cloudinary, then records its link in the backend.
 * onProgress(bytesSent) is called while the photo is being sent. Throws on failure.
 */
export async function uploadPhoto(file, name, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => onProgress?.(event.loaded),
  });
  const link = response.data.secure_url;

  // Wait for the backend to record the link. Without this, a failed save
  // leaves the photo in Cloudinary but missing from the gallery.
  const saveResponse = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ link, name }),
  });
  const saved = await saveResponse.json();
  if (!saveResponse.ok || saved.status !== 'Success') {
    throw new Error(saved.message || 'The server could not save the image');
  }
}
