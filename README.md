# UI

Small, open-source interface primitives for the web.

UI is a collection of focused components that adapt to context instead of reproducing static marketing assets. Theme, platform, input, accessibility, and reduced-motion behavior are treated as part of the component contract.

## First component: Store Links

`StoreLinks` is an adaptive app-download primitive.

- Light surfaces: dark pill with light content
- Dark surfaces: light pill with dark content
- iPhone / iPad: show the iOS destination
- Android: show the Android destination
- Desktop / unknown: show both destinations
- Explicit `theme` and `platform` props can override automatic behavior
- 52 px minimum CTA height, visible keyboard focus, pressed state, and reduced-motion support
- Neutral bundled glyphs only; official Apple and Google brand artwork is intentionally not redistributed

```tsx
import { StoreLinks } from "@/components/store-links";

<StoreLinks
  iosUrl="https://apps.apple.com/app/id…"
  androidUrl="https://play.google.com/store/apps/details?id=…"
  theme="auto"
  platform="auto"
/>
```

## Brand asset policy

This project does not bundle Apple or Google logos or store badges. Those marks are governed by their respective owners and their current marketing / trademark rules. If a product requires official artwork, add approved assets at the integration layer rather than forking them into this repository.

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

## Stack

- Next.js App Router
- React + TypeScript
- No runtime UI dependencies

## License

MIT. Brand names and trademarks referenced by examples remain property of their respective owners.
