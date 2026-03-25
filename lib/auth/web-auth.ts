/**
 * True when running in a browser (Expo web). React Native has no `document`.
 * Used so auth fetches use `credentials: 'include'` and httpOnly cookies reliably.
 */
export function isWebAuthEnvironment(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as { document?: unknown }).document !== 'undefined' &&
    (globalThis as { document?: unknown }).document != null
  );
}
