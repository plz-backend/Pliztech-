/**
 * Plz REST API base URL (no trailing slash).
 * Set EXPO_PUBLIC_API_BASE_URL in .env — restart Expo after changes.
 */
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'
)
  .trim()
  .replace(/\/$/, '');

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}
