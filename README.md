# UI

Small, open-source interface primitives for the web.

UI is a collection of focused components that adapt to context instead of reproducing static marketing assets. Theme, platform, input, accessibility, motion, and server rendering are treated as part of the component contract.

The public showcase is intended for ChatGPT Sites at `ui.manabeakira.com`. The repository itself stays deployment-runtime agnostic: the component core is plain React + TypeScript + CSS, while the local component lab uses Vite only as a lightweight development shell.

## First component: Store Links

`StoreLinks` is an adaptive app-download primitive.

- Light surfaces: dark pill with light content
- Dark surfaces: light pill with dark content
- iPhone / iPad: iOS is primary and Android becomes a secondary text link
- Android: Android is primary and iOS becomes a secondary text link
- Desktop / unknown: both destinations remain primary
- Explicit `theme` and `platform` props can override automatic behavior
- SSR-safe default: automatic mode renders the same two-link structure before hydration and only changes priority after platform detection
- Optional `initialPlatform` lets SSR frameworks provide a server-resolved platform without changing the component API
- Neutral bundled glyphs only; official Apple and Google brand artwork is intentionally not redistributed

```tsx
import { StoreLinks } from "./components/store-links";
import "./components/store-links.css";

<StoreLinks
  iosUrl="https://apps.apple.com/app/id…"
  androidUrl="https://play.google.com/store/apps/details?id=…"
  theme="auto"
  platform="auto"
/>
```

## Rendering contract

`platform="auto"` does not remove a destination during hydration. On the server and on the first client render, both available destinations are rendered as primary. After hydration, mobile platform detection only changes `data-priority` so the relevant store stays prominent and the other destination becomes secondary. This avoids hydration mismatch and minimizes layout shift.

If an SSR host already knows the request platform, pass `initialPlatform="ios"`, `"android"`, or `"desktop"` to start in the resolved state.

## Brand asset policy

This project does not bundle Apple or Google logos or store badges. Those marks are governed by their respective owners and their current marketing / trademark rules. Integrations can replace the neutral marks with approved artwork through `iosMark` and `androidMark`.

## Hosting and framework policy

- Production showcase target: ChatGPT Sites / `ui.manabeakira.com`
- Component core: React + TypeScript + CSS
- No Next.js, router, image, middleware, or server-action dependency in the component API
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
