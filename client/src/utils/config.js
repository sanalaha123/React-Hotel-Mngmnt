// Centralised runtime/build-time configuration.
//
// Resolution order (first non-empty wins):
//   1. window.configs.*  -> runtime override from /config.js (edit without rebuild)
//   2. import.meta.env.VITE_*  -> Vite build-time env (set in the Choreo build config)
//   3. local development defaults
//
// In Choreo, point these at your backend Service's public URL, e.g.:
//   API_BASE_URL  -> https://<backend-url>/api
//   SOCKET_URL    -> https://<backend-url>
const runtime = (typeof window !== 'undefined' && window.configs) || {};

export const API_BASE_URL =
  runtime.apiUrl || import.meta.env.VITE_API_BASE_URL || '/api';

export const SOCKET_URL =
  runtime.socketUrl || import.meta.env.VITE_SOCKET_URL || 'http://localhost:5005';
