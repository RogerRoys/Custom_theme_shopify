# Momemade — Custom Shopify Theme

Custom Shopify Online Store 2.0 theme for **Momemade** (dog biscuits & bandanas, Hudson Valley, NY), built by Roys Studio from the Figma design ["Momemade — Roys Studio"](https://www.figma.com/design/5JFXE5GkCODG4RedeW9fxg/Momemade---Roys-Studio) — **Frame 1** (with decorations).

## Homepage sections (Frame 1)

| Section | File | Notes |
| --- | --- | --- |
| Announcement bar | `sections/announcement-bar.liquid` | Pink bar, free-shipping message |
| Header | `sections/header.liquid` | Dark navbar, mint links, search/cart/account icons, mobile menu |
| Hero | `sections/hero-momemade.liquid` | Quote heading, 3 CTA buttons, sparkle doodle, paw print, rotating "Approved by vet" badge |
| Ticker | `sections/ticker.liquid` | Infinite CSS marquee of claims + testimonials |
| Product showcase | `sections/product-showcase.liquid` | "Two products. One standard" — Biscuits & Bandanas cards |
| Footer | `sections/footer.liquid` | Minimal dark footer (not in the design; added for completeness) |

## Design tokens

| Token | Value |
| --- | --- |
| Dark background | `#090B00` |
| Primary pink | `#D49ED7` |
| Mint green | `#A0DBB3` |
| Blush (text on dark) | `#F5DBDF` |
| Section pink | `#F5DFE2` |
| Card cream | `#F4F0EA` / `#EDE8DF` |
| Card button pink | `#D4A0C0` |
| Card button green | `#84C99A` |

All editable under **Theme settings → Colors** in the theme editor.

The design uses **Century Gothic**, which is not web-licensable — the theme defaults to **Poppins** from the Shopify font library (closest non-deprecated match) with a local `Century Gothic` fallback in the font stack. Change it under **Theme settings → Typography**.

## Images

Figma-hosted photos (hero dog, biscuit/bandana cards) can't be committed here, so:

- All decorative graphics (logo wordmark, paw, sparkle, badge, icons) are **inline SVG** — no assets needed.
- Photo slots are **image pickers** with placeholders. Upload the real photos in the theme editor: hero image, and one image per showcase card.

## Development

```sh
shopify theme dev        # local preview against your store
shopify theme push       # upload to a theme
shopify theme check      # lint
```

Set the header menu to a navigation menu containing: Shop Biscuits, Shop Bandanas, Find Your Biscuit, Our Story, Stockists.
