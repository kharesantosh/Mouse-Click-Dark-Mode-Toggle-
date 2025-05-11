
# Dark Mode Mouse Click Toggle — Chrome Extension (React + Vite, MV3)

Toggle **dark mode on any page with a simple mouse click**. Control it per-site with a React popup. The extension remembers your last dark/light state for each site.

## Features
- Per-site enable/disable for *click-to-toggle* behavior.
- Remembers the last dark/light state on each site.
- Works on all pages (`<all_urls>`).
- React popup UI (built with Vite).

## How it works
- When enabled for a site, **any mouse click** toggles a `html.dm-dark-active` class.
- A small CSS snippet inverts colors and hue-rotates images/videos back.
- State is persisted in `chrome.storage.sync` under two keys: `dm_click_sites` and `dm_dark_state`.

## Build & Install
1. Ensure Node.js 18+ is installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
   The output will be in `dist/`.
4. In Chrome, open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the `dist/` folder.

## Development
```bash
npm run dev
```
Use a separate Chrome profile with `chrome://extensions` to load the dev build via `dist` after each build, or run a build watcher.

## Folder layout
```
/ (project root)
├─ public/
│  └─ icons/                 # extension icons
├─ src/
│  ├─ content.ts             # content script: click-to-toggle logic
│  └─ popup/
│     ├─ App.tsx             # React UI
│     ├─ main.tsx            # entry
│     └─ styles.css          # popup styles
├─ popup.html                # extension popup (action)
├─ vite.config.ts            # Vite + CRX config; Manifest V3 embedded
├─ package.json
└─ tsconfig.json
```

## Notes
- No background service worker is necessary; the popup communicates directly with the content script.
- For pages with strict CSP, content scripts in MV3 still run; the CSS is injected via a `<style>` element and uses class toggling.
- You can change the invert strategy in `src/content.ts` if a site looks odd; this approach is broadly compatible.

---
Enjoy the clicky darkness!
