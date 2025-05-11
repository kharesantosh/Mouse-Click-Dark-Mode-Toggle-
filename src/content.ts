/// <reference types="chrome" />

const STATE_KEY = 'dm_dark_state';
const STYLE_ID = 'dm-dark-style-ext';
const CLASS = 'dm-dark-active';

let styleEl: HTMLStyleElement | null = null;
let clickCount = 0;
let timer: number | null = null;

function hostname(): string {
  return location.hostname;
}

function ensureStyle() {
  if (styleEl && document.contains(styleEl)) return;
  styleEl = document.createElement('style');
  styleEl.id = STYLE_ID;
  styleEl.textContent = `
    html.${CLASS} {
      background: #111 !important;
      color: #eee !important;
      filter: invert(1) hue-rotate(180deg) !important;
    }
    /* Re-invert media and bg images */
    html.${CLASS} img,
    html.${CLASS} video,
    html.${CLASS} canvas,
    html.${CLASS} svg,
    html.${CLASS} picture,
    html.${CLASS} [style*="background-image"],
    html.${CLASS} *[style*="url("] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
  `;
  document.documentElement.appendChild(styleEl);
}

async function setDarkState(on: boolean) {
  const store = await chrome.storage.sync.get([STATE_KEY]) as { [key: string]: any };
  const map: Record<string, boolean> = store[STATE_KEY] || {};
  map[hostname()] = on;
  await chrome.storage.sync.set({ [STATE_KEY]: map });
}

function isDark(): boolean {
  return document.documentElement.classList.contains(CLASS);
}

async function applyDark(on: boolean) {
  ensureStyle();
  document.documentElement.classList.toggle(CLASS, on);
  await setDarkState(on);
}

async function toggleDark() {
  await applyDark(!isDark());
}

// Triple **left click**
window.addEventListener('click', (e) => {
  // ignore ctrl/alt/meta to avoid messing with special clicks
  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;

  clickCount++;
  if (timer) window.clearTimeout(timer);

  timer = window.setTimeout(() => {
    if (clickCount >= 3) {
      toggleDark();
    }
    clickCount = 0;
  }, 400); // 3 clicks within 400ms
}, true);

// Restore last state
(async function init() {
  ensureStyle();
  const store = await chrome.storage.sync.get([STATE_KEY]) as { [key: string]: any };
  const map: Record<string, boolean> = store[STATE_KEY] || {};
  const prev = map[hostname()];
  if (typeof prev === 'boolean') {
    await applyDark(prev);
  }
})();
