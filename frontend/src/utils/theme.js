import { getCurrentUserId } from './auth';

function key() {
  const uid = getCurrentUserId() || 'guest';
  return `studybuddy_dark_mode:${uid}`;
}

export function getDarkMode() {
  try {
    const v = localStorage.getItem(key());
    return v === 'true';
  } catch (_e) {
    return false;
  }
}

export function setDarkMode(value) {
  try {
    localStorage.setItem(key(), value ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('theme:darkModeChanged', { detail: { value } }));
  } catch (_e) {
    // ignore
  }
}





