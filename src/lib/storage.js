/**
 * Progress persistence.
 *
 * Phones lock. Tabs get swiped away. Notifications happen. Losing four solved puzzles
 * because Safari reclaimed the tab would be miserable, so we keep a small breadcrumb in
 * localStorage and offer to resume.
 *
 * Every call is wrapped: iOS Safari in Private Browsing throws on setItem, and a birthday
 * card should never crash over that.
 */

const STORAGE_KEY = 'her.v21.build.state';
const STATE_VERSION = 1;

export function saveState(state) {
  try {
    const payload = JSON.stringify({ version: STATE_VERSION, ...state });
    window.localStorage.setItem(STORAGE_KEY, btoa(encodeURIComponent(payload)));
  } catch {
    /* Private mode, disabled storage, quota — all non-fatal. Progress just won't persist. */
  }
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(atob(raw)));
    if (parsed?.version !== STATE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}
