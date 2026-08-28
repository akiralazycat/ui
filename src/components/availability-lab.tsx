import { useMemo, useState } from "react";
import {
  Availability,
  type AvailabilityMarkContext,
  type AvailabilityMarkStrategy,
  type AvailabilityMode,
  type AvailabilityPresentation,
  type AvailabilityTarget,
  type AvailabilityTheme,
} from "./availability";
import type { DetectedPlatform } from "../lib/platform";

const appleUniversal = "https://apps.apple.com/";
const googlePlay = "https://play.google.com/store/apps";

const demoTargets: AvailabilityTarget[] = [
  { platform: "ios", distribution: "app-store", url: appleUniversal },
  { platform: "ipados", distribution: "app-store", url: appleUniversal },
  { platform: "macos", distribution: "app-store", url: appleUniversal },
  { platform: "watchos", distribution: "app-store", url: appleUniversal },
  { platform: "tvos", distribution: "app-store", url: appleUniversal },
  { platform: "visionos", distribution: "app-store", url: appleUniversal },
  { platform: "android", distribution: "google-play", url: googlePlay },
  { platform: "wearos", distribution: "google-play", url: googlePlay },
  { platform: "androidtv", distribution: "google-play", url: googlePlay },
  { platform: "windows", distribution: "microsoft-store", url: "https://apps.microsoft.com/" },
  { platform: "linux", distribution: "flathub", url: "https://flathub.org/" },
  { platform: "harmonyos", distribution: "appgallery", url: "https://appgallery.huawei.com/", regions: ["CN"] },
  { platform: "web", distribution: "web", url: "https://example.com/app" },
];

function DemoCustomMark({ presentation }: AvailabilityMarkContext) {
  return presentation === "store" ? (
    <svg viewBox="0 0 24 24" role="presentation">
      <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 12h8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" role="presentation">
      <path d="M12 3.8 20 18H4L12 3.8Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function AvailabilityLab() {
  const [theme, setTheme] = useState<AvailabilityTheme>("auto");
  const [mode, setMode] = useState<AvailabilityMode>("adaptive");
  const [presentation, setPresentation] = useState<AvailabilityPresentation>("platform");
  const [markStrategy, setMarkStrategy] = useState<AvailabilityMarkStrategy>("neutral");
  const [region, setRegion] = useState<"all" | "CN">("all");
  const [resolved, setResolved] = useState<DetectedPlatform>("unknown");

  const snippet = useMemo(
    () => `<Availability\n  targets={targets}\n  theme=\"${theme}\"\n  mode=\"${mode}\"\n  presentation=\"${presentation}\"\n  markStrategy=\"${markStrategy}\"${region === "CN" ? '\n  region="CN"' : ""}\n/>`,
    [markStrategy, mode, presentation, region, theme],
  );

  async function copySnippet() {
    await navigator.clipboard?.writeText(snippet);
  }

  return (
    <section className="lab" id="availability">
      <div className="lab__intro">
        <p className="eyebrow">01 · Availability</p>
        <h2>Every platform. One primitive.</h2>
        <p>Model devices, operating systems, stores, and regions separately, then choose whether the UI adapts to the current device or advertises the full surface area.</p>
      </div>

      <div className="lab__grid">
        <div className={`preview preview--${theme}`}>
          <div className="preview__chrome">
            <span>Preview</span>
            <span>{presentation} · {mode} · {markStrategy}</span>
          </div>
          <div className="preview__stage preview__stage--availability">
            <Availability
              targets={demoTargets}
              theme={theme}
              mode={mode}
              presentation={presentation}
              markStrategy={markStrategy}
              renderMark={DemoCustomMark}
              region={region === "all" ? undefined : region}
              onPlatformResolved={setResolved}
            />
          </div>
        </div>

        <aside className="controls" aria-label="Availability controls">
          <fieldset>
            <legend>Theme</legend>
            <div className="segmented">
              {(["auto", "light", "dark"] as const).map((value) => (
                <button key={value} type="button" aria-pressed={theme === value} onClick={() => setTheme(value)}>{value}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Mode</legend>
            <div className="segmented segmented--wrap">
              {(["adaptive", "all", "current", "grouped"] as const).map((value) => (
                <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)}>{value}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Presentation</legend>
            <div className="segmented segmented--two">
              {(["platform", "store"] as const).map((value) => (
                <button key={value} type="button" aria-pressed={presentation === value} onClick={() => setPresentation(value)}>{value}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Marks</legend>
            <div className="segmented">
              {(["neutral", "custom", "none"] as const).map((value) => (
                <button key={value} type="button" aria-pressed={markStrategy === value} onClick={() => setMarkStrategy(value)}>{value}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Region filter</legend>
            <div className="segmented segmented--two">
              {(["all", "CN"] as const).map((value) => (
                <button key={value} type="button" aria-pressed={region === value} onClick={() => setRegion(value)}>{value}</button>
              ))}
            </div>
          </fieldset>

          <div className="rule-card">
            <span>Resolved platform</span>
            <strong>{resolved}</strong>
            <small>Detection is best-effort. SSR hosts can pass initialPlatform for authoritative hints.</small>
          </div>
        </aside>
      </div>

      <div className="code-card">
        <div className="code-card__bar"><span>React + CSS</span><button type="button" onClick={copySnippet}>Copy</button></div>
        <pre><code>{snippet}</code></pre>
      </div>

      <div className="notes">
        <article><span>A</span><h3>Registry first.</h3><p>Platforms and distribution channels are data, not component branches. Unknown future stores can use custom string IDs without changing the renderer.</p></article>
        <article><span>B</span><h3>Adapt or announce.</h3><p>Adaptive mode emphasizes the current platform, all mode advertises every supported target, and current mode narrows the CTA when space matters.</p></article>
        <article><span>C</span><h3>Neutral by default.</h3><p>Device/store glyphs are bundled. Custom marks are an integration hook, not a license or a bundled brand-asset catalog.</p></article>
      </div>
    </section>
  );
}
