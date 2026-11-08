# Design

## Theme

warm-craft — picked 2026-11-08. Why: the skill's index names it for cafés, shops and food; a harbor coffee roaster is exactly that. Retuned from "friendly café" to "working boat shed": deeper paper, a tide teal beside the terracotta, and a deep-sea panel for the subscription.

Page type: **landing**, archetype "local business" (hero → what we offer → hours and location → contact), with the subscription as the closing action.

## Changed tokens

- `--font-display`, `--font-body`, `--font-mono` — replaced the Google Fonts stacks with local serif / sans / mono stacks. The deliverable must be one self-contained file with no external resources, so no font `<link>` is loaded.
- `--fs-5xl: 4.25rem` — added for the hero tagline; steps down at 900px and 600px.
- `--tide: #1d5b60`, `--tide-deep`, `--tide-subtle` — harbor water. Used for origins, the week strip's open days, the quay diagram and the water lines.
- `--sea-panel: #123f45`, `--sea-panel-ink`, `--sea-panel-muted` — the subscription band. Kept dark in both schemes so it reads as a painted panel, not an inverted card.
- `--rope`, `--paper-line`, `--scrim` — mooring rope, ledger rules, drawer scrim.
- Dark scheme deepened (`--bg: #14100c`) so the hero illustration reads as a night harbor rather than a grey inversion.

## Rejected

Nothing rejected by the user yet.

## Accepted

- The bean ledger rows (seal · name · origin · notes · price · action) instead of a card grid.
- The week strip in the hours card: seven cells, roasting days in terracotta, open days in tide teal, today ringed.
- The hand-drawn SVGs: shed on the quay, 1962 Probat plate, roast-week curve, quay diagram, bean seals, roaster's-choice stamp.

## Gate

`node /tmp/frontend-rails-skill/gate/run.mjs index.html --type landing --dark` → 0 errors, 0 warnings at 1440 / 768 / 390, light and dark.

```gate
# no ignores, no bans
```

## Notes

- All artwork is inline SVG or CSS; the only `url()` is a data-URI noise filter for paper grain. No images, no fonts, no scripts fetched.
- Opening hours are computed from the visitor's local clock (Wed–Sun 08:00–15:00, closed Mon–Tue), refreshed every 30s, with a "closing soon" state inside the last hour.
- The bag lives in `localStorage`, guards the sold-out bean, and hands off to `mailto:hello@lowtide.coffee` with the order in the body. No payment or shipping facts are invented.