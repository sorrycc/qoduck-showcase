# Design

## Theme

dense-ledger — picked 2026-11-08. Why: an all-day ops console; dense tables, tabular numbers, calm neutrals with one accent, status colour reserved for status.

## Changed tokens

- `--font-display` / `--font-body` / `--font-mono` — local system stacks instead of the Geist webfont link: the deliverable is a single self-contained `index.html` with no external resources.
- `--success: #166534` (light) — the theme's `#15803d` measured 4.47:1 on `--surface-2` (table row hover); the darker green clears 4.5:1 on every surface it sits on.
- Added `--series-1…--series-5` — five district hues (teal, blue, amber, magenta, lime) reused by chips, district bars, table dots and tooltips so the palette is the same everywhere.
- Added `--scrim`, `--topbar-h`, `--chart-h` — drawer overlay and layout sizing.

## Packaging

The brief requires one self-contained HTML file, so `tokens.css` and `primitives.css` are inlined verbatim as `<style id="tokens">` and `<style id="primitives">`, followed by `<style id="page">`. Token names and load order are unchanged.

## Rejected

Nothing rejected by the user yet.

## Accepted

- `.gate/1440.png`, `.gate/1440-dark.png` — KPI strip + trips chart + dock-state wall on the left, district breakdown + rebalance queue on the right, full-width station table below.

## Gate

`node /tmp/fr-skill/gate/run.mjs index.html --type app --dark` → 0 errors, 0 warnings at 1440 / 768 / 390 in light and dark (2026-11-08). No ignores, no bans.

```gate
# no ignores
```

## Notes

- Charts are hand-drawn SVG (no chart library): daily/hourly trips with crosshair tooltip, district bars, dock-state wall, drawer sparklines.
- Feed states (live / syncing / no data / fault) are reachable from the top-bar "Feed" select and the refresh button; each panel has a designed skeleton, empty and error state.
- Data is generated in JS from seed 20261107 and always ends Sat 7 Nov 2026, so every load is identical.