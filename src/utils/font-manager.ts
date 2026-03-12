export type FontPreference = 'mono' | 'system';

const STORAGE_KEY = 'worldmonitor-font';
const DEFAULT_FONT: FontPreference = 'mono';

/**
 * Read the stored font preference from localStorage.
 */
export function getStoredFont(): FontPreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'mono' || stored === 'system') return stored;
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_FONT;
}

/**
 * Get the current font preference from the DOM.
 */
export function getCurrentFont(): FontPreference {
  const value = document.documentElement.dataset.font;
  if (value === 'mono' || value === 'system') return value;
  return DEFAULT_FONT;
}

/**
 * Apply a font preference by setting data-font on <html>.
 * Uses a data attribute instead of inline style so that CSS selectors
 * like [dir="rtl"] can naturally override --font-body in the cascade.
 */
export function setFont(font: FontPreference): void {
  if (font === DEFAULT_FONT) {
    delete document.documentElement.dataset.font;
  } else {
    document.documentElement.dataset.font = font;
  }
  try {
    localStorage.setItem(STORAGE_KEY, font);
  } catch {
    // localStorage unavailable
  }
  window.dispatchEvent(new CustomEvent('font-changed', { detail: { font } }));
}

/**
 * Apply stored font preference on startup (before components mount).
 */
export function applyStoredFont(): void {
  const font = getStoredFont();
  if (font !== DEFAULT_FONT) {
    document.documentElement.dataset.font = font;
  }
}
