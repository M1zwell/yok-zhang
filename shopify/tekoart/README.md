# TekO Beehive Desk — Shopify theme

Drop-in replacement for the live **Dawn 13** theme on [tekoart.com](https://tekoart.com).

## What this is

Beehive TCG (`beehivetcg.com`) is a **custom Shopify theme** (not Dawn): two-row header, search, collection hubs, sticky cart count, bilingual merchandising.

TekO now paints the **planet HUD** measured on [jubuddy.com/planet](https://jubuddy.com/planet):

- Paper `#FFF8E8` · sky wash `#BFE3E0`
- Ink `#2C2720`
- Amber CTA `#F5A623` (hover `#FFD34D`)
- Focus teal `#4FB3A6`
- Heading `DM Serif Display` · body `Inter`
- Pill buttons (`--buttons-radius: 999px`) with 1px ink border
- Soft cards (`--product-card-corner-radius: 18px`)

Structure stays Beehive-grade (announcement, search header, hexagon face hubs, product grid, how-it-works, cart). Tiny **Buy me a coffee** → `https://buymeacoffee.com/tekoart`.

## Install on tekoart.com

1. Zip the `shopify/tekoart` folder.
2. Shopify admin → Online Store → Themes → Add theme → Upload zip.
3. Preview. Confirm cream paper, amber pills, mint sky.
4. Theme settings: keep Planet HUD swatches (paper / amber / teal).
5. Home sections: attach the Pictorial Book Window collection, Juju/Qilin/Yutu images, and the three guide videos already on the shop.
6. Publish when the preview matches the garden desk at `/tekoart`.

The garden preview (`ichina.co/tekoart`) is the same UX against the live catalog, with checkout still on Shopify.

## Jubit family SSO — `/auth/callback`

Hub contract (same as dseek / jubuddy / ichina):

1. Visitor leaves TekO for `https://www.jubit.ai/auth/sso?redirect_uri=https://tekoart.com/<path>&client_id=tekoart`.
2. After sign-in, hub mints `auth-jubit-sso` `create_token` and sends the browser to  
   `https://tekoart.com/auth/callback?sso_token=<one-time>&next=<path>`.
3. This theme calls `validate_token`, stores `tekoart.family.session` in `localStorage`, then `location.replace(next)` (same-origin path only).

### How Shopify hosts the callback

Shopify Online Store has **no arbitrary app routes**. Pages live under `/pages/…`. This theme supports the hub path in two layers:

| Layer | Path | HTTP | When it works |
| --- | --- | --- | --- |
| **404 interceptor** | `/auth/callback` stays in the address bar; `templates/404.json` → `sections/main-404.liquid` detects the path and renders `snippets/jubit-auth-callback.liquid` | 404 (functional) | As soon as **this theme is published** |
| **Page + URL redirect** (preferred) | Admin creates page handle `jubit-sso` with template **page.jubit-auth-callback**, then URL redirect `/auth/callback` → `/pages/jubit-sso` (Shopify preserves the query string) | 200 | After the one-time Admin steps below |

### One-time Admin steps (preferred 200)

1. Publish this theme (or copy `jubit-sso-callback.js`, the snippet/section, and `page.jubit-auth-callback` into the live Dawn theme).
2. Online Store → Pages → Add page  
   - Title: `Jubit SSO`  
   - Visibility: hidden from menus / password not required  
   - Theme template: `page.jubit-auth-callback`  
   - Handle: `jubit-sso` → public URL `/pages/jubit-sso`
3. Online Store → Navigation → URL redirects → Add  
   - From: `/auth/callback`  
   - To: `/pages/jubit-sso`  
   - (Optional) also `/auth/sso-callback` → same target
4. Smoke: open  
   `https://tekoart.com/auth/callback`  
   → should show “No sign-in token…” (not the stock Dawn 404).

GoTrue already allowlists `https://tekoart.com/**` and `https://www.tekoart.com/**` on project `uqtk`.

### Files

- `assets/jubit-sso-callback.js` — `validate_token` exchange + safe `next`
- `snippets/jubit-auth-callback.liquid` — UI shell
- `sections/jubit-auth-callback.liquid` — page section wrapper
- `sections/main-404.liquid` — path detect for hub URL
- `templates/page.jubit-auth-callback.json` — assignable page template

Verify locally: `npm run verify:tekoart-sso`.
