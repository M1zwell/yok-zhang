# Typography

From the worlds stylesheet and the font stylesheets it loads.

## Families

| Role | Stack | Worlds class |
| --- | --- | --- |
| Body | Inter, system-ui, sans-serif | `html, body` |
| UI / Latin display | Plus Jakarta Sans, Inter | `.jub-font-display` |
| Wordmark | Plus Jakarta Sans, weight 800, tracking `-0.03em` | `.jub-wordmark` |
| CJK display | `"Noto Serif SC", Songti SC, STSong, serif`, tracking `0.08em` | `.font-yok-cjk` |
| Japanese display | `"Noto Serif JP", Inter, sans-serif` | `.jub-font-jp` |
| Mono | JetBrains Mono, ui-monospace | code |

Loaded weights: Inter 400–800, Plus Jakarta Sans 500–800, Noto Serif SC 400–700, Noto Serif JP 400 and 700.

## Text styles

| Style | Size | Weight | Tracking | Line height |
| --- | --- | --- | --- | --- |
| Body | inherited | 400 | normal | `1.5` |
| Display | Jakarta | 700 | `-0.02em` | tight |
| Wordmark | Jakarta | 800 | `-0.03em` | tight |
| Yok CJK | Noto Serif SC | 400–700 | `0.08em` | tight |
| Kicker | Jakarta | 600 | `0.2em`, uppercase | 1 |

## ichina

| Token | Stack |
| --- | --- |
| `--font-sans` | Inter, then Noto Sans SC / TC / JP / KR / Thai for body CJK |
| `--font-ui` | Plus Jakarta Sans, Inter, then the Noto Sans stack |
| `--font-display` | Plus Jakarta Sans, then Noto Serif SC, Noto Serif JP, then body CJK |
| `--font-serif` | Noto Serif SC, Noto Serif JP, Songti SC |
| `--font-mono` | JetBrains Mono |

Latin headlines stay Jakarta. Han and kana fall through to Noto Serif. Body copy stays Inter, with Noto Sans for Hangul, Thai, and long CJK paragraphs. Worlds does not ship those body faces; the garden keeps them so zh-Hans, zh-Hant, ja, ko, and th still render.

Classes:

- `.font-display` — Jakarta tracking `-0.02em`
- `.font-wordmark` — weight 800, tracking `-0.03em`
- `.font-yok-cjk` — Noto Serif, tracking `0.08em`

Space Grotesk is not part of this system.
