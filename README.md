# Momemade — Shopify Theme (Horizon base)

Custom Shopify theme for **Momemade** (dog biscuits & bandanas, Hudson Valley, NY) by Roys Studio.
Built on an optimized **Horizon 3.2.1** base, implementing Frame 1 of the Figma design
["Momemade — Roys Studio"](https://www.figma.com/design/5JFXE5GkCODG4RedeW9fxg/Momemade---Roys-Studio).

## Branches

| Branch | Purpose |
| --- | --- |
| `claude/epic-galileo-sgk6bo` | Working branch — Horizon base + Momemade design (connect this to Shopify) |
| `Momemade-theme-base` | Pristine snapshot of the optimized Horizon base theme (reference/backup) |

## What was customized on top of Horizon

- **Color schemes** (`config/settings_data.json`) — remapped to the Momemade palette:
  - `scheme-1` Light (white) · `scheme-2` Blush `#F5DFE2` · `scheme-3` Dark `#090B00` · `scheme-4` Mint `#A0DBB3` · `scheme-5` Pink `#D49ED7` (announcement) · `scheme-6` Transparent header overlay
- **Typography** — Poppins (closest Shopify-library match to the design's Century Gothic)
- **Announcement bar** (`sections/header-group.json`) — free-shipping message on the pink scheme
- **Header** — dark scheme top & bottom rows
- **Homepage** (`templates/index.json`):
  1. `sections/momemade-hero.liquid` — custom split hero: quote heading, 3 CTAs, sparkle doodle, paw print, rotating "Approved by vet" badge (all inline SVG)
  2. Horizon's native `marquee` section — configured as the claims/testimonials ticker (32px, pink on dark)
  3. `sections/momemade-showcase.liquid` — custom "Two products. One standard" cards
- **Fixes** — removed trailing-comma JSON bug in `config/settings_schema.json`; theme rebranded to "Momemade" by Roys Studio

Everything else (product pages, cart drawer, search, performance optimizations) is untouched Horizon.

## After connecting to a store

1. **Upload photos** in the theme editor: hero image + one image per showcase card
2. **Set menus**: main menu → Shop Biscuits, Shop Bandanas, Find Your Biscuit, Our Story, Stockists
3. **Upload the Momemade logo** under Theme settings → Logo (falls back to store name text until then)
4. Link the hero/showcase buttons to their collections

## Development

```sh
shopify theme dev     # local preview against a store
shopify theme check   # lint
```
