# gghere worlds tokens on ichina.co

Source: [gghere.com/worlds](https://gghere.com/worlds), stylesheet `game-F69C5s5j.css`, captured 2026-10-16. [jubuddy.com/planet](https://jubuddy.com/planet) ships the same bundle. The walk sheet that worlds does not use as its catalog ground is packed in [planet-paper.md](./planet-paper.md).

ichina.co keeps its own sentences. This pack is the color, type, radius, and motion system.

## Switch

| Mode | Selector | Ground | Accent |
| --- | --- | --- | --- |
| Dark (garden default) | `html.dark` | Plum night `#0E0B12` | Teal `#14b8a6` |
| Light | `html.light` | Rice paper `#F6F1E8` | Sakura `#C77891` |

Worlds itself defaults to rice paper and turns on plum night with `html.dark`. ichina stays dark-first. The Aa / 雅 toggle is the switch.

Runtime sheet: `app/styles/gghere-tokens.css`. Tailwind names in `app/globals.css` (`--color-bg`, `--color-fg`, `--color-accent`, …) point at that sheet.

## Files

- [raw.md](./raw.md) — raw palette, brand, HK, neko
- [dark.md](./dark.md) — semantic dark
- [light.md](./light.md) — semantic light
- [typography.md](./typography.md) — fonts and text styles
- [motion-radius.md](./motion-radius.md) — radius, motion, shadows
- [planet-paper.md](./planet-paper.md) — planet walk sheet

## ichina binding

The garden paints the **planet HUD**, measured on jubuddy.com/planet, not the sakura rice semantic light.

| Garden token | Day (default) | Night shell |
| --- | --- | --- |
| `--color-bg` | `#FFF8E8` paper, sky `#BFE3E0` | `#0A0A0A` |
| `--color-fg` | `#2C2720` | `#FFF8E8` |
| `--color-accent` | amber `#F5A623` | amber `#F5A623` |
| `--color-accent-deep` | focus teal `#4FB3A6` | `#4FB3A6` |
| `--color-ink` (on amber) | `#2C2720` | `#2C2720` |
| Buttons | pill, 1px ink border, weight 800 | same cream / amber pills |
| `--font-display` / `--font-sans` | Inter | Inter |

Worlds semantic light (rice `#F6F1E8`, sakura `#C77891`) stays in the token sheet. It is not what the planet controls paint.


TekO Art (`/tekoart`) keeps its Dawn paper. It does not use this sheet.
