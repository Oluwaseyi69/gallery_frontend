// Backend address.
// On the live site this is "/backend": Vercel forwards those requests to the Render server
// (see vercel.json), so guests' browsers only ever connect to the site's own address.
// Some networks and security filters block onrender.com directly.
// Set REACT_APP_API_URL to override it, e.g. in .env.development to use a backend on your machine.
export const API_URL = (process.env.REACT_APP_API_URL || '/backend').replace(/\/$/, '');

// Where guests' photos are uploaded. Override to use a different Cloudinary account or preset.
export const CLOUDINARY_UPLOAD_URL =
  process.env.REACT_APP_CLOUDINARY_UPLOAD_URL || 'https://api.cloudinary.com/v1_1/da9pykf1q/image/upload';
export const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'wedding_preset';
