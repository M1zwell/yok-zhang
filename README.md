# Yok Zhang

Digital garden for Yok Zhang — Hong Kong. Builds AI. Lives the rest.

Static Next.js (App Router). Notes in `content/posts/`. No backend, no CMS, no env secrets.

Intended production domain: **ichina.co** (apex). Current Vercel deploy: `yok-zhang.vercel.app`. Parent attaches the apex in Vercel — this repo does not mint DNS.

The improved dseek mark lives on this garden only — it is not deployed to dseek.ai.

## Routes

- `/` garden home (English, unprefixed)
- `/hometown` 秀陇张家 this-room tree (hourglass + map + 字辈 + family check-in). Locales: `/zh-Hans/hometown`, `/zh-Hant/hometown`, `/th/hometown`, …
- `/writing` one stream: notes, research theme chips, and the live dseek research desk
- `/writing/[slug]` notes
- `/blog` redirects to `/writing` (old links)
- `/tools` workspace (tacit — universe launcher, HK district jump, live frames)
- `/products` live product directory; city-planet / worlds first
- `/share` omni-channel publish desk (YouTube / TikTok / Xiaohongshu / X copy kits)
- `/tools` and Writing: Studio outputs via jubit.ai/terminal (NotebookLM-class)
- `/{locale}/...` marketing UI in 简体 / 繁體 / 日本語 / 한국어 / ไทย / Nederlands  
  Examples: `/zh-Hans/writing`, `/ja/products`, `/ko`, `/th/tools`, `/nl/writing`, `/zh-Hant`

Locale is stored in a `locale` cookie and reflected in the URL. Default English has no prefix. Markdown post bodies stay English.

## How to run

1. Install Node dependencies in this folder.

2. Start the development server (port 3100). Script name: `dev`

3. Open http://localhost:3100

4. Production: run the build script. Static files land in `out/` (output export is on).

Family check-in on `/hometown` is optional. Apply `supabase/hometown_checkins.sql`, then set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` at build. The public board never reads WeChat, phone, or email. The tree still works without keys.

This is Yok Zhang personal brand and garden site.
