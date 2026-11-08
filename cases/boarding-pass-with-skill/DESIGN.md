# Design

## Theme

cold-tool — picked 2026-11-08, retuned into a North Atlantic palette. Why: an app screen
where four facts must be read in two seconds; the theme's compact mono numerals and
status colors fit a boarding pass, and its neutral base let the brand hues carry the look.

## Changed tokens

- Brand hues added: `--basalt`, `--basalt-2`, `--aurora`, `--aurora-deep`, `--ice`,
  `--ice-deep`, `--ember`, `--lava`, `--spark`, `--on-band`, `--on-band-dim`,
  `--band-rule`, `--wallet`, `--wallet-text`, `--code-ink`, `--code-paper`, `--scrim`.
- `--accent` → glacial green `#0b7a57` (light) / `#37e0a0` (dark); the gate band and
  timeline borrow it, the delayed state swaps to `--ember` / `--lava`.
- Type scale extended with `--fs-2xs` (11) and `--fs-5xl`/`--fs-6xl` (44/56) for the
  gate and boarding numerals. Fonts are system stacks only — the artifact must be a
  single self-contained file with no external requests.
- Radii extended with `--radius-xl` (20) and `--radius-2xl` (28) for the pass and stub.
- `--shadow-2` deepened so the pass lifts off the aurora sky.

## Rejected

- Nothing rejected by the user yet.

## Accepted

- `.gate/390.png`, `.gate/1440-dark.png` — gate band hierarchy, perforated stub, code area.

## Gate

```gate
ignore: R16 .aurora    # ambient aurora drift is the page's living background; slow transform-only loop, disabled under prefers-reduced-motion
```