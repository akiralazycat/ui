import { useMemo, useState } from "react";
import { StoreLinks, type StoreLinksPlatform, type StoreLinksTheme } from "./store-links";
import type { StorePlatform } from "../lib/platform";

const demoIos = "https://apps.apple.com/";
const demoAndroid = "https://play.google.com/store";

export function StoreLinksLab() {
  const [theme, setTheme] = useState<StoreLinksTheme>("auto");
  const [platform, setPlatform] = useState<StoreLinksPlatform>("auto");
  const [resolved, setResolved] = useState<StorePlatform | "manual">("manual");

  const snippet = useMemo(
    () => `<StoreLinks\n  iosUrl=\"https://apps.apple.com/app/id…\"\n  androidUrl=\"https://play.google.com/store/apps/details?id=…\"\n  theme=\"${theme}\"\n  platform=\"${platform}\"\n/>`,
    [theme, platform],
  );

  async function copySnippet() {
    await navigator.clipboard?.writeText(snippet);
  }

  return (
    <section className="lab" id="store-links">
      <div className="lab__intro">
        <p className="eyebrow">01 · Store links</p>
        <h2>One pair. Every surface.</h2>
        <p>A high-contrast app-download primitive that inverts with the page theme and adapts platform priority without changing its hydration structure.</p>
      </div>

      <div className="lab__grid">
        <div className={`preview preview--${theme}`}>
          <div className="preview__chrome">
            <span>Preview</span>
            <span>{theme === "auto" ? "System theme" : `${theme[0].toUpperCase()}${theme.slice(1)} theme`}</span>
          </div>
          <div className="preview__stage">
            <StoreLinks
              iosUrl={demoIos}
              androidUrl={demoAndroid}
              theme={theme}
              platform={platform}
              onPlatformResolved={setResolved}
            />
          </div>
        </div>

        <aside className="controls" aria-label="Store link controls">
          <fieldset>
            <legend>Theme</legend>
            <div className="segmented">
              {(["auto", "light", "dark"] as const).map((value) => (
                <button key={value} type="button" aria-pressed={theme === value} onClick={() => setTheme(value)}>{value}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Platform</legend>
            <div className="segmented segmented--wrap">
              {(["auto", "all", "ios", "android"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={platform === value}
                  onClick={() => {
                    setPlatform(value);
                    if (value !== "auto") setResolved("manual");
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="rule-card">
            <span>Adaptive rule</span>
            <strong>Mobile → relevant store primary · other store secondary · desktop → both primary</strong>
            <small>{platform === "auto" && resolved !== "manual" ? `Resolved here: ${resolved}` : "Manual preview"}</small>
          </div>
        </aside>
      </div>

      <div className="code-card">
        <div className="code-card__bar"><span>React + CSS</span><button type="button" onClick={copySnippet}>Copy</button></div>
        <pre><code>{snippet}</code></pre>
      </div>

      <div className="notes">
        <article><span>A</span><h3>Invert, don’t tint.</h3><p>Light surfaces use a dark CTA; dark surfaces use a light CTA. Brand color does not become the background.</p></article>
        <article><span>B</span><h3>Hydration stays stable.</h3><p>Automatic platform detection changes priority after hydration instead of deleting one store link from the DOM.</p></article>
        <article><span>C</span><h3>Brand assets are slots.</h3><p>The core ships neutral marks. Approved Apple or Google artwork can be injected by the integrating product.</p></article>
      </div>
    </section>
  );
}
