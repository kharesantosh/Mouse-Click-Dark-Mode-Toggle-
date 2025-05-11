
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: "Dark Mode Mouse Click Toggle",
  description: "Toggle dark mode on ANY page by mouse click. Per-site control, remembers state.",
  version: "1.0.0",
  action: {
    default_popup: "popup.html",
    default_title: "Dark Mode Toggle"
  },
  icons: {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  permissions: ["storage", "activeTab", "scripting"],
  host_permissions: ["<all_urls>"],
  content_scripts: [
    {
      "matches": ["<all_urls>"],
      "js": ["src/content.ts"],
      "run_at": "document_end"
    }
  ],
  web_accessible_resources: [
    {
      "resources": ["*"],
      "matches": ["<all_urls>"]
    }
  ]
});

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    minify: true,
    sourcemap: false,
    target: "es2020"
  }
});
