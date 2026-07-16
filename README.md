# Momemade — Shopify Theme (Horizon base)

Custom Shopify theme for **Momemade** (dog biscuits & bandanas, Hudson Valley, NY) by Roys Studio.
Built on an optimized **Horizon 3.2.1** base, implementing Frame 1 of the Figma design
["Momemade — Roys Studio"](https://www.figma.com/design/5JFXE5GkCODG4RedeW9fxg/Momemade---Roys-Studio).

## Branches

| Branch | Purpose |
| --- | --- |
| `claude/epic-galileo-sgk6bo` | Working branch — Horizon base + Momemade design (connect this to Shopify) |
| `Momemade-theme-base` | Pristine snapshot of the optimized Horizon base theme (reference/backup) |
| `Momemade-v1-from-scratch` | The original from-scratch Momemade theme, preserved as-is |

## What was customized on top of Horizon

**All Momemade-facing sections are fully custom, self-contained builds** (same design/code as the original from-scratch theme) — they do NOT depend on Horizon's native sections, color schemes, or fonts:

| Section | File |
| --- | --- |
| Announcement bar | `sections/momemade-announcement.liquid` |
| Header (dark navbar + mobile menu) | `sections/momemade-header.liquid` |
| Hero (quote, 3 CTAs, sparkle/paw/vet badge) | `sections/momemade-hero.liquid` |
| Scrolling ticker (CSS marquee) | `sections/momemade-ticker.liquid` |
| "Two products. One standard" showcase | `sections/momemade-showcase.liquid` |
| Footer | `sections/momemade-footer.liquid` |

Supporting snippets: `snippets/momemade-icons.liquid`, `snippets/momemade-logo.liquid` (all inline SVG).

Wiring: `sections/header-group.json`, `sections/footer-group.json`, `templates/index.json` (photos already connected via `shopify://shop_images/`).

Also changed on the base:
- Color schemes in `config/settings_data.json` remapped to the Momemade palette (affects Horizon-rendered pages: product, collection, cart, search)
- Typography set to Poppins; cart type set to page (drawer lives in the unused Horizon header)
- Fixed a pre-existing trailing-comma JSON bug in `config/settings_schema.json`

Everything else is untouched Horizon 3.2.1.

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
