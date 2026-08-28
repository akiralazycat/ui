# UI

Small, open-source interface primitives for the web.

UI is a collection of focused components that adapt to context instead of reproducing static marketing assets. Theme, device, operating system, distribution channel, region, accessibility, motion, and server rendering are treated as part of the component contract.

The public showcase is intended for ChatGPT Sites at `ui.manabeakira.com`. The repository itself stays deployment-runtime agnostic: the component core is plain React + TypeScript + CSS, while the local component lab uses Vite only as a lightweight development shell.

## First primitive: Availability

`Availability` models app availability independently across four dimensions:

1. **Device family** — phone, tablet, desktop, watch, TV, spatial, car, web
2. **Platform** — iOS, iPadOS, macOS, watchOS, tvOS, visionOS, Android, Wear OS, Android TV, ChromeOS, Windows, Linux, Fire OS, Fire TV, Vega OS, HarmonyOS, Web, PWA, or a custom ID
3. **Distribution** — App Store, Google Play, Microsoft Store, Galaxy Store, AppGallery, GetApps, OPPO App Market, vivo App Store, Tencent MyApp, Amazon Appstore, Flathub, Snap Store, F-Droid, direct download, web, or a custom ID
4. **Region** — optional per-target availability such as `regions: ["CN"]`

This prevents the component from treating an operating system and an app store as if they were the same concept.

```tsx
import { Availability } from "./components/availability";
import "./components/availability.css";

const targets = [
  { platform: "ios", distribution: "app-store", url: "https://apps.apple.com/app/id…" },
  { platform: "macos", distribution: "app-store", url: "https://apps.apple.com/app/id…" },
  { platform: "visionos", distribution: "app-store", url: "https://apps.apple.com/app/id…" },
  { platform: "android", distribution: "google-play", url: "https://play.google.com/store/apps/details?id=…" },
  { platform: "windows", distribution: "microsoft-store", url: "https://apps.microsoft.com/detail/…" },
  { platform: "linux", distribution: "flathub", url: "https://flathub.org/apps/…" },
  { platform: "harmonyos", distribution: "appgallery", url: "https://appgallery.huawei.com/…", regions: ["CN"] },
];

<Availability
  targets={targets}
  theme="auto"
  mode="adaptive"
  presentation="platform"
/>
```

## Modes

- `adaptive` — all supported destinations remain visible; the currently detected platform becomes primary and the rest become secondary
- `all` — every supported destination is shown at equal priority, useful for announcing cross-platform support
- `current` — after hydration, only the currently detected platform remains visible
- `grouped` — all destinations are shown in labeled groups; `groupBy` can be `ecosystem`, `device`, or `distribution`

## Presentation

- `presentation="platform"` — one destination per platform, e.g. iOS / macOS / visionOS / Android / Windows / Linux
- `presentation="store"` — targets that share the same distribution URL are collapsed into one store CTA with their supported platforms listed underneath

This is useful for universal store records: one App Store button can advertise iOS · iPadOS · macOS · watchOS · tvOS · visionOS without duplicating the same URL six times.

## Rendering contract

Automatic detection is best-effort and client-side. Before hydration, all available targets render in a stable structure. `adaptive` changes priority after detection; `current` changes visibility only after hydration. Hosts that already know the request platform can pass `initialPlatform` to start in the resolved state.

visionOS, watch, TV, embedded, and privacy-reduced user agents should not be assumed to be perfectly identifiable from browser UA strings. `initialPlatform` is the authoritative escape hatch for host-provided knowledge.

## Registry contract

`platformRegistry` and `distributionRegistry` contain common presets, but IDs are extensible strings. New regional stores or future operating systems can therefore be used immediately without waiting for a library release. Unknown IDs receive a readable fallback label and neutral rendering.

The built-in distribution registry includes both global and regional channels, including App Store, Google Play, Microsoft Store, Galaxy Store, AppGallery, Xiaomi GetApps, OPPO App Market, vivo App Store, Tencent MyApp, Amazon Appstore, Flathub, Snap Store, and F-Droid.

## StoreLinks compatibility wrapper

`StoreLinks` remains as the small iOS / Android convenience API and delegates rendering to `Availability`.

```tsx
<StoreLinks
  iosUrl="https://apps.apple.com/app/id…"
  androidUrl="https://play.google.com/store/apps/details?id=…"
  mode="adaptive"
/>
```

## Theme and brand assets

Light surfaces use a dark CTA; dark surfaces use a light CTA. Brand color is not used as the button background by default.

This project does not bundle Apple, Google, Microsoft, Huawei, Xiaomi, Samsung, Amazon, or other vendor logos or store badges. The renderer ships neutral device/store marks. Integrations can provide approved artwork through target-level `platformMark` or `distributionMark` slots.

## Hosting and framework policy

- Production showcase target: ChatGPT Sites / `ui.manabeakira.com`
- Component core: React + TypeScript + CSS
- No Next.js, router, image, middleware, server-action, or Vercel dependency in the component API
- Local lab: Vite, replaceable without changing the components
- SSR compatibility is a component behavior guarantee, not a dependency on a particular hosting framework

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run typecheck
npm run build
```

## License

MIT. Brand names and trademarks referenced by examples remain property of their respective owners.
