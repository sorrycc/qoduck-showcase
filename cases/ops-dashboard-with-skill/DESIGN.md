# Design

## Theme

dense-ledger — picked 2026-11-08. Why: an all-day ops screen is mostly numbers in columns; this theme is dense, tabular and calm.

Single-file deliverable: `index.html` inlines `themes/dense-ledger/tokens.css` and `components/primitives.css` in one `<style>` block. The Google Fonts `<link>` from the top of `tokens.css` is deliberately omitted — the brief forbids external resources — so `"Geist"` falls back to `system-ui` and `"Geist Mono"` to `ui-monospace`. Token names and the rest of the scale are unchanged.

## Changed tokens

No theme token values were changed. Project tokens added (light + dark, same names in both):

- `--series-1…--series-5` — one hue per district (teal, blue, amber, magenta, olive); also used for table sparklines and station charts.
- `--heat-0…--heat-5` — sequential scale for the hour-by-day heatmap; runs quiet → busy in both schemes.
- `--grid-line`, `--chart-band`, `--chart-ghost` — chart gridlines, weekend/rush shading, and the "same day last week" dashed line.
- `--scrim` — drawer backdrop.

## Rejected

- Nothing rejected by the user yet.
- Self-imposed: no chart library (brief), no external requests (brief), no red flood for flagged stations — empty is amber, full is blue, red is reserved for the feed-error banner.

## Accepted

- `.gate/1440.png`, `.gate/768.png`, `.gate/390.png` and the `-dark` variants — gate passes with 0 errors, 0 warnings.
- Layout: sticky top bar → title + actions → one filter toolbar → 4-KPI strip → trips chart + district bars → heatmap + attention list → full-width station table.
- Phone (≤600px): the table drops to Station / Bikes / Trips / Status with a district + fill sub-line, rather than shrinking nine columns.

## Notes

- Data is generated in JS from `mulberry32(20261108)`; the anchor date is fixed at 8 Nov 2026 so every load is identical. Verified: 40 stations, 5 districts, capacity 12–30, 5 chronically empty/full stations, weekday peaks at 08:00 and 17:00, weekends −11.5%, two rain days.
- Week-on-week deltas always compare the newest 7 days with the 7 before them, in both range modes; the KPI caption says so.
- Loading / empty / error are reachable from the "Preview state" control in the footer, and also occur for real (boot and refresh skeleton, no-match empty, feed error with retry).

## Gate

Rules for `gate/run.mjs`. No ignores and no bans were needed.

```gate
# no ignores — the page passes clean at 1440 / 768 / 390 in light and dark
```