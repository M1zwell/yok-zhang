# Planet paper

[jubuddy.com/planet](https://jubuddy.com/planet) uses the same CSS bundle as worlds. The catalog at `/worlds` sits on rice paper (`#F6F1E8`) and plum night (`#0E0B12`). The walk surface adds a warmer sheet, scoped in the bundle as `html.light .planet-paper`.

ichina keeps rice paper in the token sheet for the worlds semantic light. The garden itself paints this planet sheet: paper `#fff8e8`, sky `#bfe3e0`, ink `#2c2720`, amber pills `#f5a623` with ink type, focus teal `#4fb3a6`. Those are the colors computed off the live planet controls.

| Token | Value |
| --- | --- |
| `--planet-ink` | `#2c2720` |
| `--planet-paper` | `#fff8e8` |
| `--planet-paper-hot` | `#fff4d4` |
| `--planet-paper-wash` | `rgba(255, 247, 222, 0.94)` |
| `--planet-muted` | `#5f584b` |
| `--planet-whisper` | `#8a8172` |
| `--planet-track` | `#d8ceb3` |
| `--planet-amber` | `#f5a623` |
| `--planet-amber-light` | `#ffd34d` |
| `--planet-accent` | `#f5a623` |
| `--planet-focus` | `#4fb3a6` |
| `--planet-cta-fill` | `#f5a623` |
| `--planet-cta-ink` | `#2c2720` |
| `--planet-shadow` | `0 8px 28px rgba(44, 39, 32, 0.2)` |

On that sheet the bundle also remaps `--surface-primary` to `--planet-paper`, `--accent-gold` to amber, and `--jub-ink` to `--planet-ink`. The garden does not take that remap. Amber is the planet call-to-action; sakura remains the garden light accent.
