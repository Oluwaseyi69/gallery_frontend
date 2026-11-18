// Backend address. Set REACT_APP_API_URL to override it, e.g. in .env.development
// to use a backend running on your machine. Falls back to the live Render server.
export const API_URL = (process.env.REACT_APP_API_URL || 'https://gallery-backend-z7i7.onrender.com').replace(/\/$/, '');

// Where guests' photos are uploaded. Override to use a different Cloudinary account or preset.
export const CLOUDINARY_UPLOAD_URL =
  process.env.REACT_APP_CLOUDINARY_UPLOAD_URL || 'https://api.cloudinary.com/v1_1/da9pykf1q/image/upload';
export const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'wedding_preset';
