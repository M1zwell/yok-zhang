# Video Demo

Mirrors `D:\JubuddyAssetFactory\Video Demo`.

**你来拍：** `docs/planet-demo-factory/FILM_ON_PC.md`。短条打勾 `SHOT_LIST.md`；一条超长再切 `LONG_TAKE.md`。云端 Linux 成片太慢，只当目录。

See also `docs/planet-demo-factory/SOCIAL_AND_CLAIM.md`.

Binaries (`*.mp4` / stills) are gitignored. Pull them from the Cloud Agent artifacts for this run, then copy the whole tree onto D:.

```
00-masters/     超长母带 + long-take-marks.txt（不直接发）
01-modes/       Immersive, Overview, All HK, Kart, Siege, NYC Coin Rally, Courier, Tokyo, Paris
02-hud-tools/   Weather, Photo, Interior, Pet, tram, live pin, Stargaze constellations, full HUD
03-hero-pet/    Hero picker + Grey Hour + Bastion / Depths roster
04-depths-build Depths enter + inside dungeon, Bastion, Grey Hour interior, Print / 3D
05-flows/       Sign-in / 404 signup / Print $6 / Google 2FA phone verify
06-highlights/  8–18s posting tray (`01`–`13`)
```

Post these first from pass 2:

- `08_bastion_depths_inside.mp4` — dungeon, not just the picker
- `10_paris_ile_de_la_cite.mp4` — second-city proof
- `14_courier_rush_roster.mp4` — Courier Rush start on Lower Manhattan
- `still_coin_rally_nyc_street.png` — Rally that actually drove (video master later lost the route)

Pass 3 (localhost / 30fps kiosk, 8–9s):

- `localhost_film_en.mp4` / `localhost_film_zh_hans.mp4` — Remotion from `http://localhost:3100/film`
- `localhost_overview_central.mp4` — Central night overview
- `localhost_paris_overview.mp4` — Paris Île de la Cité
- `smooth_*.mp4` — cropped 1.45× recuts of pass-2 keepers (Depths dungeon, Courier, live pin, …)

Skip `localhost_depths.mp4` (Paris duplicate). Rally proof remains `still_coin_rally_nyc_street.png`.
