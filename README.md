# Momemade — Shopify theme (Online Store 2.0)

Built by Roys Studio from the Momemade Figma design.

## Install
1. Shopify admin → Online Store → Themes → Add theme → Upload zip.
2. Upload `Momemade-Shopify-Theme.zip` → Customize.

## Set up after upload
- Navigation: create menus `main-menu` and `footer` (Online Store → Navigation).
  Home anchors work in menus: `/#products`, `/#reviews`, `/#mission`, `/#story`.
- Home → "Two products": pick the Biscuits and Bandanas products (single-variant products add straight to the bag).
- Replace the built-in photos in each section with your own (image pickers). Built-in photos are fallbacks only.
- Theme settings → Cart: free-shipping threshold (default $50), drawer or page.
- Theme settings → Search: popular search chips.

## What's included
- Sections: announcement bar, header (transparent over hero, sticky), hero slideshow (auto-rotate, progress bar, swipe),
  ticker, two products, quote (word reveal), community signup + count-up stats, testimonials loop slider,
  mission (count-up), Meet Joni, footer with newsletter.
- AJAX cart drawer (qty, remove, free-shipping meter), predictive search overlay, mobile menu drawer.
- Templates: home, product (variants, gallery, accordions), collection (sort + pagination), collections list,
  cart, search, page, blog, article, 404, password, gift card, customer account pages.

## Motion
One easing everywhere: cubic-bezier(.2,.8,.2,1).
Hover .3s · drawers/menus/sliders .5s · scroll reveals .8–1s (fade + 36px rise) · hero zoom 7s.
Respects prefers-reduced-motion.

## Fonts
Jost (Google Fonts) + Century Gothic. Century Gothic is a paid font — if not licensed for web, Questrial is used as fallback.
To self-host, upload the .woff2 files to assets/ and add @font-face rules at the top of theme.css.
