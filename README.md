# Yok Zhang

Digital garden for Yok Zhang — Hong Kong. Builds AI. Lives the rest.

Static Next.js (App Router). Notes in `content/posts/`. No backend, no CMS, no env secrets.

Intended production domain: **ichina.co** (apex). Current Vercel deploy: `yok-zhang.vercel.app`. Parent attaches the apex in Vercel — this repo does not mint DNS.

## Routes

- `/` garden home
- `/writing` one stream: notes, tag filters, and the live research desk
- `/writing/[slug]` notes
- `/blog` redirects to `/writing` (old links)
- `/tools` workspace (tacit — universe launcher, HK district jump, live frames)
- `/products` live product directory with framed previews

## How to run

1. Install Node dependencies in this folder.

2. Start the development server (port 3100). Script name: `dev`

3. Open http://localhost:3100

4. Production: run the build script. Static files land in `out/` (output export is on).

This is Yok Zhang personal brand and garden site.
