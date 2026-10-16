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

| Garden token | Dark | Light |
| --- | --- | --- |
| `--color-bg` | `#0E0B12` | `#F6F1E8` |
| `--color-surface` | `#1A1620` card | `#FCF8EE` card |
| `--color-elevated` | `#1E1925` | `#FCFAF5` |
| `--color-tertiary` | `#16121C` | `#E4D9C3` |
| `--color-fg` | `#FAF3EF` | `#1F1A17` |
| `--color-secondary` | `#ECE0D8` | `#3A3027` |
| `--color-muted` | `#B5A3B0` | `#5C5247` |
| `--color-accent` | `#14b8a6` | `#C77891` |
| `--color-accent-hover` | `#2dd4bf` | `#B8657F` |
| `--color-gold` | `#fbbf24` | `#C7A25B` |
| `--color-line` | `#2A2433` | `#D9CDB6` |
| `--color-ink` (on accent) | `#ffffff` | `#ffffff` |
| `--font-display` | Plus Jakarta Sans, then Noto Serif SC / JP | same |
| `--font-sans` | Inter | same |
| `--font-ui` | Plus Jakarta Sans | same |
| `--font-mono` | JetBrains Mono | same |

TekO Art (`/tekoart`) keeps its Dawn paper. It does not use this sheet.
