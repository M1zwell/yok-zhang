# Planet landmarks — research pack (from the ichina.co garden)

Four briefs written against production `jubuddy.com/planet` / `gghere.com` between 2026-09-07 and 2026-09-14, moved here from `M1zwell/yok-zhang` `docs/research/`. Docs only; no app code.

| File | What it settles | Touches |
|------|-----------------|---------|
| `2026-09-07-hk-building-clickable-planet.md` | Clickable-building drill-down for HK. Centanet rasters are proprietary (no scrape). LandsD 3D Indoor WFS = 689 venues; MY CENTRAL not among them. Two-source naming rule. | `planet/scan`, `data/landmarks`, ADR (new) |
| `2026-09-07-planet-3d-traffic-simulation.md` | The uploaded video is depthmapX 0.7.0 (VGA), not a traffic sim. Split: globe / indoor VGA / SUMO. | `planet/engine`, out of scope for web |
| `2026-09-07-cesium-ion-planet.md` | ion is tiling + CDN, not the globe. HK HD stays CSDI. ion only as a Pro+ BIM-tileset lane. | `planet/engine/tiles`, ADR-0318 S3 follow-up |
| `2026-09-09-planet-landmark-buildings.md` | Landmark (G) card: 09-09 baseline, 09-14 update (Ask, Poster/Tiles, Real building, ju windows, Marble rooms), reconciled plan, **Real building sheet refinement** in three waves. | `scan/BuildingSheet.tsx`, `lib/forgeClient.ts`, `api/forge/*`, ADR-0318, Marble spec 2026-09-12 |

## How these map onto what is already on main

- ADR-0318 S1–S3 (`6f0b95`, `143803`, `91939b`) shipped what the 09-09 brief called plan items B and C. The 09-14 section of the landmark brief is the reconciliation; the "Real building sheet refinement" is the proposed S4.
- `docs/superpowers/specs/2026-09-12-marble-landmark-interiors-design.md` supersedes the "don't claim interiors" line — the brief now says: designed, not shipped, keep not claiming until a flagship room lands.
- Nothing here contradicts ADR-0319 (GLO-30 terrain) or the Ether Sea work.

## Suggested landing

1. Keep these four files here (`docs/RESEARCH/planet-landmarks/`), same convention as `docs/RESEARCH/marble/`.
2. Open ADR-03xx "Real building sheet: gates before upload, server-side landing, fit preview" from the refinement section; wave 1 is front-end + i18n only.
3. Link this README from `docs/RESEARCH/README.md` if one exists.

## Cloud Agent environment for this repo — checklist for the first agent that lands here

The garden repo already has a verified environment (`.cursor/environment.json` + `scripts/cloud-agent-install.sh`). This repo needs its own; nothing below is confirmed against this tree yet — the first agent must read the lockfile and CI before writing `.cursor/environment.json`.

- [ ] Package manager and Node version from the lockfile / `packageManager` / `.nvmrc` (workspace has `apps/web` and `buddy-core`; commits mention vitest, eslint `--max-warnings=0`, web typecheck, `validate-push`).
- [ ] `install`: frozen-lockfile install at the workspace root; any codegen the web app needs (i18n types, supabase types) if it is source-derived.
- [ ] `terminals`: `apps/web` dev server on its port; expose it in `ports`.
- [ ] Supabase: local stack only if tests need it; production migrations (`supabase/migrations/20260911000001_*`, `20260911000002_*`) are an operator step, never part of `install`.
- [ ] Secrets the verify scripts need go in Cloud Agent Secrets, not in `environment.json`. Forge lanes read `WORLDLABS_API_KEY` and the forge proxy config; leave them optional for docs-only agents.
- [ ] Prove it: draft build → fresh agent runs typecheck + `vitest` for `apps/web/src/planet/scan/**` + starts the dev server → propose with the build id → Save.
- [ ] If the garden and this repo should be reachable from one agent, add `github.com/Jubit-AI/jubuddy-game` to the garden's `repositoryDependencies` (already done in `M1zwell/yok-zhang` PR #12) and install the Cursor GitHub App on the `Jubit-AI` org so the generated token covers it.
