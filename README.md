
# Dark Mode Mouse Click Toggle — Chrome Extension

Toggle **dark mode on any page with a simple mouse click**. Control it per-site with a React popup. The extension remembers your last dark/light state for each site.

## Features
- Tripple moue click to enable disab;e dark mode
- Remembers the last dark/light state on each site.
- Works on all pages (`<all_urls>`).
- React popup UI (built with Vite).

## How it works
- When enabled for a site, **any mouse click** toggles a `html.dm-dark-active` class.
- A small CSS snippet inverts colors and hue-rotates images/videos back.

## Build & Install
1. Ensure Node.js 18+ is installed.
2. Install dependencies:
   
   npm install
   
3. Build the extension:
   
   npm run build
   
   The output will be in `dist/`.
4. In Chrome, open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the `dist/` folder.

Enjoy the clicky darkness!
