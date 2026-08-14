# Remotion reel + a tighter garden — 14 Aug 2026

Date: Friday 14 August 2026 (Asia/Shanghai, UTC+8)

Live URLs: https://ichina.co · https://yok-zhang.vercel.app

---

## What changed

The previous product intro was a CSS reel pretending to be a film. Home was a pile: two intros, a flagship card, marquee, quotes, studio shelf, stat counters, and a long social list.

This pass ships a **real Remotion Player** and cuts the garden to one story, in the logged-out cursor.com / GitHub shape: one headline, two CTAs, the film, then a short rest.

---

## Real Remotion (not CSS)

Packages: `remotion@4.0.509`, `@remotion/player@4.0.509`.

- `remotion/Root.tsx` registers one composition: `CityPlanet`.
- `remotion/CityPlanet.tsx` is the composition: `AbsoluteFill`, `Sequence`, `interpolate`, `spring`, `Easing`, `useCurrentFrame`, `useVideoConfig`.
- 1920×1080, 30 fps, 270 frames (9 seconds). Two sequences only: gghere.com/worlds, then jubuddy.com/planet.
- Abstract motion: tiny planet, orbit, haze, film grain, ken-burns. No stock footage. No presenter face.
- HeyGen influence is captions only: lower-third bar, timed line, path label. No avatar, no HeyGen API, no talking head.
- `app/components/ProductIntro.tsx` embeds `@remotion/player`. Autoplay + loop. Quiet play/pause. Click-through to the live product for the active sequence. Locale copy via `inputProps`. `prefers-reduced-motion` pauses on frame 0 and does not autoplay.
- Static export kept (`output: "export"`). Client-only Player. No Remotion `prepare`, no Lambda, no Studio server. `transpilePackages: ["remotion", "@remotion/player"]`. Webpack ignores `@remotion/bundler` / `@remotion/renderer` and node fallbacks.

dseek and jubit stay in the i18n dictionary. They are not in the reel.

---

## Home cut list

Above the fold: one sentence headline (≤10 words, sentence case) + two CTAs + the film. No second subhead. No Pretext stack. No giant name plus claim.

- Filled CTA: Walk a city → gghere.com/worlds
- Ghost CTA: Writing
- Film starts at the fold and is the product intro

Removed from home:

- Second tacit Pretext on the hero
- Extra ghost buttons (View Projects, Open tools)
- Duplicate CityPlanetFlagship card
- ProductMarquee
- QuoteRotator
- StudioShelf (stays on /writing, /tools, /share)
- 3-stat counters row
- Long social channel list (YouTube / TikTok / Xiaohongshu / X stay on /share and the footer)
- ProductIntro CSS reel
- ProductStage iframes on home (replaced by a four-link row)

After the film, five sections then stop: compact products + /products, two writing cards + /writing, join, two-sentence about, emails + GitHub.

Huge air: ~120–140px between sections. One accent (teal).

---

## Products

No second Remotion reel. No ProductMarquee. CityPlanetFlagship card + ProductStage + grouped list. Shorter lead.

---

## How to verify

1. `/` and locale homes (`/zh-Hans`, `/zh-Hant`, `/ja`, `/ko`, `/th`, `/nl`) still export.
2. Home shows `@remotion/player`, not the old CSS ken-burns reel.
3. No talking head. Captions only.
4. Grep: no `linkedin` in app code.
5. `bun run build` with `output: "export"`.
