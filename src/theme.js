import { useSyncExternalStore } from 'react';

const KEY = 'showscout-theme';
const listeners = new Set();
const validModes = new Set(['light', 'dark']);
const canUseDom = typeof window !== 'undefined';
const systemIsDark = () => canUseDom && window.matchMedia('(prefers-color-scheme: dark)').matches;
const readMode = () => { try { const value = window.localStorage.getItem(KEY); return validModes.has(value) ? value : (systemIsDark() ? 'dark' : 'light'); } catch { return systemIsDark() ? 'dark' : 'light'; } };
let mode = canUseDom ? readMode() : 'system';
if (mode === 'system') mode = 'light';
let resolved = mode;
let snapshot = { mode, resolved };

function applyTheme(nextResolved) {
  if (!canUseDom) return;
  document.documentElement.dataset.theme = nextResolved;
  document.documentElement.style.colorScheme = nextResolved;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute('content', nextResolved === 'dark' ? '#140A1C' : '#FAF7F8');
  document.querySelectorAll('[data-theme-color]').forEach((element) => element.setAttribute('content', nextResolved === 'dark' ? '#140A1C' : '#FAF7F8'));
}
function publish(nextMode, announce = true) {
  mode = validModes.has(nextMode) ? nextMode : 'light';
  resolved = mode;
  snapshot = { mode, resolved };
  applyTheme(resolved);
  try { window.localStorage.setItem(KEY, mode); } catch { /* private mode is still fully functional */ }
  listeners.forEach((listener) => listener());
  if (announce && canUseDom) window.dispatchEvent(new CustomEvent('showscout:theme-change', { detail: { mode, resolved } }));
}
if (canUseDom) {
  applyTheme(resolved);
  window.addEventListener('storage', (event) => { if (event.key === KEY) publish(event.newValue || (systemIsDark() ? 'dark' : 'light'), false); });
}
export function useTheme() { return useSyncExternalStore((listener) => { listeners.add(listener); return () => listeners.delete(listener); }, () => snapshot, () => ({ mode: 'light', resolved: 'light' })); }
export function setThemeMode(nextMode) { publish(nextMode); }
export function toggleTheme() { publish(resolved === 'dark' ? 'light' : 'dark'); }
export function themeStorageKey() { return KEY; }
