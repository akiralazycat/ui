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

This prevents the component from treating an operating system and an app distribution channel as if they were the same concept.

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

## Priority mode

Priority and layout are separate axes.

- `adaptive` — all supported destinations remain visible; the currently resolved platform becomes primary and the rest become secondary
- `all` — every supported destination is shown at equal priority, useful for announcing cross-platform support
- `current` — after hydration, only the currently resolved platform remains visible

## Presentation

- `presentation="platform"` — one destination per platform, e.g. iOS / macOS / visionOS / Android / Windows / Linux
- `presentation="distribution"` — targets that share the same distribution URL are collapsed into one channel CTA with supported platforms listed underneath

This is useful for universal records: one App Store destination can advertise iOS · iPadOS · macOS · watchOS · tvOS · visionOS without duplicating the same URL six times.

`distribution` is intentionally broader than `store`: direct download and web are valid distribution channels too.

## Grouping

Grouping is independent from mode and presentation. Pass `groupBy="ecosystem"`, `"device"`, or `"distribution"` when a labeled layout is useful; omit `groupBy` for the flat layout.

```tsx
<Availability
  targets={targets}
  mode="adaptive"
  presentation="platform"
  groupBy="ecosystem"
/>
```

A collapsed distribution row can belong to multiple device or ecosystem groups when its targets span those groups. This keeps grouping semantically correct instead of assigning a universal destination to only its first target.

## Mark strategy

Platform/distribution identity is always carried by visible text. Marks are decorative assistance, not the only identifier.

- `markStrategy="neutral"` — default. Platform presentation uses a neutral device-family glyph; distribution presentation uses a neutral channel glyph.
- `markStrategy="custom"` — use target-level `platformMark` / `distributionMark` or the component-level `renderMark` callback. Missing custom artwork falls back to the neutral mark.
- `markStrategy="none"` — text-only rendering.

There is deliberately no `brand` strategy. The library does not decide whether a vendor logo is permitted for a given product, territory, placement, or campaign.

```tsx
<Availability
  targets={targets}
  markStrategy="custom"
  renderMark={({ presentation, distribution, platforms }) => {
    // Return artwork that your product is permitted to use.
    return myApprovedMarks[presentation === "distribution" ? distribution : platforms[0]];
  }}
/>
```

Custom artwork is automatically placed inside the component's decorative mark frame (`aria-hidden`); the visible platform/distribution label remains the accessible identifier.

See [BRAND_ASSETS.md](./BRAND_ASSETS.md) for the integration policy. Custom slots are a technical extension point, not a grant of rights to third-party artwork. Official store badges should remain intact owner-provided assets when the owner's current rules require that treatment rather than being reconstructed inside the neutral pill.

## Rendering contract

Automatic platform detection is best-effort and client-side. Before hydration, all available targets render in a stable structure. `adaptive` changes priority after detection; `current` changes visibility only after hydration.

Hosts that already know the request platform can pass `platformHint` to start in the resolved state and bypass client inference for that render path.

visionOS, watch, TV, embedded, and privacy-reduced user agents should not be assumed to be perfectly identifiable from browser UA strings. `platformHint` is the explicit host-provided escape hatch.

## Link behavior

Links open in the current browsing context by default so mobile store URLs can hand off naturally. Set `openInNewTab` when the integrating product explicitly wants `_blank` behavior.

## Registry contract

`platformRegistry` and `distributionRegistry` contain common presets, but IDs are extensible strings. New regional channels or future operating systems can therefore be used without waiting for a library release. Unknown IDs receive a readable fallback label and neutral rendering; targets can still provide an explicit device and visible label.

The built-in distribution registry includes both global and regional channels, including App Store, Google Play, Microsoft Store, Galaxy Store, AppGallery, Xiaomi GetApps, OPPO App Market, vivo App Store, Tencent MyApp, Amazon Appstore, Flathub, Snap Store, and F-Droid.

## Neutral mark set

The bundled visual vocabulary is device-first rather than vendor-first: phone, tablet, desktop, watch, TV, spatial, car, and web. The same device glyph can intentionally appear beside different operating-system names. The glyph answers “what kind of device?”, while the text answers “which platform?”.

The 24 × 24 mark set uses one restrained monoline grammar. Phone and tablet avoid vendor-specific hardware details; desktop and TV have distinct silhouettes; Web uses a neutral browser window. Distribution rendering uses a generic store/channel mark, with dedicated neutral variants for direct download and web.

`NeutralDeviceMark` and `NeutralDistributionMark` are exported for consumers that need the same visual language elsewhere.

## StoreLinks compatibility wrapper

`StoreLinks` remains as the small iOS / Android convenience API and delegates rendering to `Availability`.

```tsx
<StoreLinks
  iosUrl="https://apps.apple.com/app/id…"
  androidUrl="https://play.google.com/store/apps/details?id=…"
  mode="adaptive"
/>
```

`iosMark` / `androidMark` apply to platform presentation. If distribution presentation is used, `appStoreMark` / `googlePlayMark` are separate so platform logos are not accidentally reused as store artwork. Supplying any custom mark selects the custom mark strategy unless `markStrategy` is explicitly set.

## Candidate v1 API

The core axes are intentionally small and orthogonal:

```ts
mode: "adaptive" | "all" | "current"
presentation: "platform" | "distribution"
groupBy?: "ecosystem" | "device" | "distribution"
markStrategy: "neutral" | "custom" | "none"
theme: "auto" | "light" | "dark"
```

Supporting props such as `region`, `platformHint`, `renderMark`, `openInNewTab`, and `onPlatformResolved` extend those axes without changing their responsibilities.

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

The repository also runs the same typecheck and production build in GitHub Actions for pull requests and tracked branches.

## License

MIT. Brand names and trademarks referenced by examples remain property of their respective owners.
