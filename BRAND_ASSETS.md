# Brand asset integration policy

`ui` is an interface library, not a vendor-logo pack.

The default rendering is intentionally brand-neutral. Platform presentation uses a neutral device-family glyph plus a text label. Store presentation uses a neutral distribution/store glyph plus a text label. This keeps the component useful without implying that third-party marks are bundled, licensed, or endorsed by their owners.

## Mark strategies

`Availability` exposes three explicit strategies:

- `neutral` — use the bundled device/store glyphs. This is the default.
- `custom` — use artwork supplied by the integrating product, with a neutral fallback when no custom mark is provided.
- `none` — render text labels without a mark.

There is intentionally no `brand` strategy. A generic `brand` switch would imply that this package can determine whether a vendor logo is permitted in a particular product, territory, placement, or campaign. It cannot.

## Custom artwork

Custom marks can be supplied per target with `platformMark` / `distributionMark`, or centrally with `renderMark`.

Supplying a custom mark is a technical capability only. It does not grant trademark, copyright, marketing, or other rights to that artwork. The integrating product is responsible for confirming that it may use the asset and for following the current owner guidelines.

The component always keeps the platform/store name as visible text. Marks are treated as decorative and are placed in an `aria-hidden` frame, so replacing a mark does not replace the accessible label.

## Official badges

Official store badges are not the same thing as platform marks. Some owners require their official badge to be used as an intact, approved asset with prescribed spacing, sizing, colors, or surrounding treatment.

Do not recreate an official badge by placing a vendor logo inside the default `Availability` pill. When a product needs an official badge, use the owner-provided asset at the integration layer in the form permitted by the owner's current rules.

## Safe fallback

If permission or usage conditions are unclear, use `markStrategy="neutral"` or `markStrategy="none"` and keep the platform/store name in text.

Vendor names and trademarks remain property of their respective owners. This repository does not provide legal permission to use third-party marks.