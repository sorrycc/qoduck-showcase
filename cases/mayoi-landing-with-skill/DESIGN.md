# Design

## Theme

cold-tool — picked 2026-11-08, retuned to Mayoi's brand. Why: a developer-tool landing for technical buyers; the stock cool grey/blue was replaced with the app icon's palette (pixel gold on deep indigo) so the page could not be pasted onto another product.

## Changed tokens

- `--bg/--surface/--surface-2/--border` — dark: indigo night `#100c26 / #171233 / #201a45 / #2e2757`; light: warm ivory `#f5f1e8 / #fffcf5 / #ebe4d4 / #d8cfbc`
- `--accent: #ffb224` (dark) / `#f0a400` (light) — icon gold; `--accent-contrast: #201a3d` indigo ink on gold buttons
- `--link: #ffc233` (dark) / `#8a5800` (light) — gold fails small-text contrast on ivory, so light links use deep amber
- `--font-pixel: "Silkscreen"` added — pixel-art eyebrows and wordmark, matching the icon; body/display stay IBM Plex Sans, code IBM Plex Mono
- `--fs-5xl: 3rem`, `--fs-6xl: 4rem` added (mobile overrides in tokens.css) — hero display size
- `--space-11: 8rem` added — hero top padding clears the fixed two-row mobile nav
- Brand tokens added: `--gold`, `--indigo`, `--on-indigo`, `--on-indigo-muted`, `--violet`, `--teal`, `--night`, `--field`, `--rain`
- `--th-<theme>-{bg,bar,ink,dim,kw,str,fn,line}` × 12 themes — palettes for the live theme previewer; every role contrast-checked against its bg so the mock passes R09 in all twelve themes

## Rejected

- Nothing rejected by the user yet.
- Self-rejected during build: opacity-0 scroll reveals (they blank out full-page gate screenshots); `loading="lazy"` on the local screenshots (same reason, and print/save views); purple-blue gradients (gate R04) — the hero mesh mixes gold/violet/teal hues instead.

## Accepted

- `.gate/1440.png`, `.gate/1440-dark.png` — indigo-night/ivory-paper direction with the status-line stats band.

## Gate

No ignores needed: passes with 0 errors / 0 warnings in light and dark at 1440/768/390.

```gate
# no ignores — the page passes clean
```

## Notes

- Stats band is styled as the editor's status line (mono, chrome segments `mayoi v0.18.2` / `UTF-8 · LF · Go`) after a vision review called a plain four-stat row generic.
- Motion: rAF canvases (hero pixel drift, Matrix digital rain) instead of CSS loops; entrances ≤320ms with at most 2 delayed elements; `prefers-reduced-motion` stops both canvases.
- The ⌘P command palette on the page is a real component (fuzzy filter, arrows, Enter, Esc, focus restore with preventScroll); it mirrors the product's headline feature.
- Screenshots and icon copied from `~/Projects/Mayoi/docs/screenshots` and `resources/icon.png`; CLI examples verified against `internal/cli/request.go` usage text.