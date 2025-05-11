
/// <reference types="chrome" />
import React, { useEffect, useState } from 'react';

type SiteMap = Record<string, boolean>;
const SITES_KEY = 'dm_click_sites';
const STATE_KEY = 'dm_dark_state';

async function getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

function getHostname(url?: string): string | null {
  try {
    if (!url) return null;
    const u = new URL(url);
    return u.hostname;
  } catch {
    return null;
  }
}

export default function App() {
  const [hostname, setHostname] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tab = await getActiveTab();
      const host = getHostname(tab?.url || '');
      setHostname(host);
      const store = await chrome.storage.sync.get([SITES_KEY, STATE_KEY]) as { [key: string]: any };
      const map: SiteMap = store[SITES_KEY] || {};
      const darkMap: Record<string, boolean> = store[STATE_KEY] || {};
      if (host) {
        setEnabled(!!map[host]);
        setIsDark(!!darkMap[host]);
      }
      setLoading(false);
    })();
  }, []);

  async function toggleEnable(value: boolean) {
    setEnabled(value);
    const tab = await getActiveTab();
    if (!hostname || !tab?.id) return;
    const store = await chrome.storage.sync.get([SITES_KEY]) as { [key: string]: any };
    const map: SiteMap = store[SITES_KEY] || {};
    map[hostname] = value;
    await chrome.storage.sync.set({ [SITES_KEY]: map });
    await chrome.tabs.sendMessage(tab.id, { type: 'APPLY_ENABLE', enable: value });
  }

  async function toggleNow() {
    const tab = await getActiveTab();
    if (!tab?.id) return;
    await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_NOW' });
    // Update local state from content
    const store = await chrome.storage.sync.get([STATE_KEY]) as { [key: string]: any };
    const darkMap: Record<string, boolean> = store[STATE_KEY] || {};
    if (hostname) setIsDark(!!darkMap[hostname]);
  }

  if (loading) return <div className="wrap">Loading…</div>;

  return (
    <div className="wrap">
      <h1>Dark Mode</h1>
      <div className="row">
        <span className="label">Site</span>
        <code className="host">{hostname || 'unknown'}</code>
      </div>
      <label className="switch">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => toggleEnable(e.target.checked)}
        />
        <span>Enable click-to-toggle on this site</span>
      </label>

      <button className="primary" onClick={toggleNow}>
        Toggle dark now
      </button>

      <div className="hint">
        When enabled, ANY mouse click on this site toggles dark mode.
        State is remembered per-site.
      </div>

      <div className={"status " + (isDark ? "on" : "off")}>
        Current: {isDark ? "Dark" : "Light"}
      </div>
    </div>
  );
}
