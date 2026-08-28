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
  markStrategy="neutral"
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

## Mark strategy

Platform/store identity is always carried by visible text. Marks are decorative assistance, not the only identifier.

- `markStrategy="neutral"` — default. Platform presentation uses a neutral device-family glyph; store presentation uses a neutral store glyph.
- `markStrategy="custom"` — use target-level `platformMark` / `distributionMark` or the component-level `renderMark` callback. Missing custom artwork falls back to the neutral mark.
- `markStrategy="none"` — text-only rendering.

There is deliberately no `brand` strategy. The library does not decide whether a vendor logo is licensed for a given product, territory, placement, or campaign.

```tsx
<Availability
  targets={targets}
  markStrategy="custom"
  renderMark={({ presentation, distribution, platforms }) => {
    // Return artwork that your product is permitted to use.
    // `presentation`, `distribution`, and `platforms` can drive your own map.
    return myApprovedMarks[presentation === "store" ? distribution : platforms[0]];
  }}
/>
```

Custom artwork is automatically placed inside the component's decorative mark frame (`aria-hidden`); the visible platform/store label remains the accessible identifier.

See [BRAND_ASSETS.md](./BRAND_ASSETS.md) for the integration policy. Custom slots are a technical extension point, not a grant of rights to third-party artwork. Official store badges should be used as intact owner-provided assets when their current rules require that treatment rather than being reconstructed inside the neutral pill.

## Rendering contract

Automatic detection is best-effort and client-side. Before hydration, all available targets render in a stable structure. `adaptive` changes priority after detection; `current` changes visibility only after hydration. Hosts that already know the request platform can pass `initialPlatform` to start in the resolved state.

visionOS, watch, TV, embedded, and privacy-reduced user agents should not be assumed to be perfectly identifiable from browser UA strings. `initialPlatform` is the authoritative escape hatch for host-provided knowledge.

## Registry contract

`platformRegistry` and `distributionRegistry` contain common presets, but IDs are extensible strings. New regional stores or future operating systems can therefore be used immediately without waiting for a library release. Unknown IDs receive a readable fallback label and neutral rendering.

The built-in distribution registry includes both global and regional channels, including App Store, Google Play, Microsoft Store, Galaxy Store, AppGallery, Xiaomi GetApps, OPPO App Market, vivo App Store, Tencent MyApp, Amazon Appstore, Flathub, Snap Store, and F-Droid.

## Neutral mark set

The bundled visual vocabulary is device-first rather than vendor-first: phone, tablet, desktop, watch, TV, spatial, car, web, plus a generic store mark. The same device glyph can intentionally appear beside different operating-system names. The glyph answers “what kind of device?”, while the text answers “which platform?”.

`NeutralDeviceMark` and `NeutralStoreMark` are exported for consumers that need the same visual language elsewhere.

## StoreLinks compatibility wrapper

`StoreLinks` remains as the small iOS / Android convenience API and delegates rendering to `Availability`.

```tsx
<StoreLinks
  iosUrl="https://apps.apple.com/app/id…"
  androidUrl="https://play.google.com/store/apps/details?id=…"
  mode="adaptive"
/>
```

If `iosMark` or `androidMark` is supplied, `StoreLinks` automatically uses the custom mark strategy unless `markStrategy` is explicitly set.

## Theme

Light surfaces use a dark CTA; dark surfaces use a light CTA. Brand color is not used as the button background by default.

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
