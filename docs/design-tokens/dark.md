# Dark tokens

Selector: `html.dark`. Ground is plum night, not neutral `#090908`. Accent is teal.

## Surfaces

| Token | Value |
| --- | --- |
| `--bg` | `#0E0B12` |
| `--bg-2` | `#16121C` |
| `--bg-3` | `#1E1925` |
| `--card` | `#1A1620` |
| `--surface-primary` | `var(--raw-neutral-950)` → `#0a0a0a` |
| `--surface-secondary` | `var(--raw-neutral-900)` → `#171717` |
| `--surface-tertiary` | `var(--raw-neutral-800)` → `#262626` |
| `--surface-elevated` | `var(--raw-neutral-800)` |
| `--surface-hover` | `rgba(255, 255, 255, 0.04)` |
| `--surface-active` | `rgba(255, 255, 255, 0.08)` |
| `--surface-overlay` | `rgba(0, 0, 0, 0.6)` |
| `--glass-bg` | `rgba(23, 23, 23, 0.72)` |
| `--glass-border` | `rgba(255, 255, 255, 0.08)` |
| `--glass-blur` | `blur(18px) saturate(1.2)` |

The garden page uses `--bg` / `--card` (plum), not the neutral surface ramp. The ramp stays available for panels that want a flatter dark.

## Text

| Token | Value |
| --- | --- |
| `--ink` | `#FAF3EF` |
| `--ink-soft` | `#ECE0D8` |
| `--ink-mid` | `#B5A3B0` |
| `--ink-light` | `#82748A` |
| `--ink-whisper` | `#5A4F66` |
| `--text-primary` | `var(--raw-neutral-100)` → `#f5f5f5` |
| `--text-secondary` | `var(--raw-neutral-300)` → `#d4d4d4` |
| `--text-muted` | `var(--raw-neutral-400)` → `#a3a3a3` |
| `--text-whisper` | `var(--raw-neutral-600)` → `#525252` |
| `--text-inverse` | `var(--raw-neutral-900)` |
| `--text-on-accent` | `#ffffff` |

Garden foreground is `--ink` (`#FAF3EF`).

## Lines

| Token | Value |
| --- | --- |
| `--line` | `#2A2433` |
| `--line-soft` | `#221C2A` |
| `--border-subtle` | `rgba(255, 255, 255, 0.06)` |
| `--border-default` | `rgba(255, 255, 255, 0.10)` |
| `--border-strong` | `rgba(255, 255, 255, 0.18)` |
| `--tabbar-bg` | `#16121C` |
| `--tabbar-line` | `#2A2433` |
| `--tabbar-ink` | `#6E6776` |
| `--tabbar-active` | `#FF4778` |
| `--pink-soft` | `#3A1F2E` |

## Accents

| Token | Value |
| --- | --- |
| `--accent-primary` | `#14b8a6` |
| `--accent-primary-hover` | `#2dd4bf` |
| `--accent-primary-muted` | `rgba(20, 184, 166, 0.16)` |
| `--accent-secondary` | `#ec4899` |
| `--accent-secondary-hover` | `#f472b6` |
| `--accent-secondary-muted` | `rgba(236, 72, 153, 0.16)` |
| `--accent-gold` | `#fbbf24` |
| `--accent-gold-muted` | `rgba(251, 191, 36, 0.16)` |
| `--gradient-primary` | teal → pink, 135deg |
| `--status-success` | `#4ade80` |
| `--status-warning` | `#fbbf24` |
| `--status-error` | `#f87171` |
| `--status-info` | `#60a5fa` |

## Named sub-palettes (in the worlds bundle, not the garden ground)

Fusion and sci-fi live on the same stylesheet. Peak-mist and neon atmospheres may lean on them. They are not the default night.

| Token | Dark value |
| --- | --- |
| `--fusion-bg` | `#1a0e1a` |
| `--fusion-bg-deep` | `#0a0610` |
| `--fusion-accent` | `#a060e0` |
| `--fusion-feminine` | `#e040a0` |
| `--fusion-masculine` | `#4080e0` |
| `--scifi-bg` | `#0f1422` |
| `--scifi-bg-deep` | `#0a1220` |
| `--scifi-text-primary` | `#a0c0e0` |
| `--scifi-border` | `#2a3a5a` |
