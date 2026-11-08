Build an operations dashboard for a fictional bike-share network, "Spoke".

Generate the data in JS with a seeded random generator (same data on every
load): 40 stations, each with a name, district (one of 5), capacity (12–30),
bikes available, and hourly trip counts for the last 14 days. Keep the
numbers realistic: rush-hour peaks, quieter weekends, a few stations that
are always empty or always full.

Must have
- A top summary of the 3–4 numbers an operator checks first, each with its
  change vs the previous week.
- A trips-over-time chart, a breakdown by district, and a table of stations
  sortable by any column.
- A district filter and a date range (last 7 / last 14 days) that update
  every chart, number and table together.
- Stations that need attention (empty or full) stand out without the whole
  screen turning red.
- Hovering a chart shows exact values.

Rules
- Draw the charts yourself (SVG or canvas). No chart libraries.
- Responsive at 1440, 768 and 390 px wide. On a phone it should still be
  usable, not a shrunken desktop. Light and dark schemes via
  `prefers-color-scheme`.

Layout, density, chart types and visual style are up to you. Optimize for an
operator who looks at this screen all day.

Before you start building, read and follow the frontend-rails skill at
`<path-to>/frontend-rails/SKILL.md`. Treat
`<path-to>/frontend-rails` as the SKILL_DIR it refers to:
read the `app` archetype, pick a theme from `themes/INDEX.md`, use its tokens
and `components/usage.md`, and run `node SKILL_DIR/gate/run.mjs index.html
--type app` until it reports no errors (its node_modules is already
installed). Then look at the gate screenshots and fix what they show.

Because the deliverable must be one self-contained file, inline the chosen
theme tokens and `primitives.css` into a `<style>` block inside `index.html`
instead of linking separate CSS files. Keep all colour, type, spacing,
radius and duration values as `var(--…)` tokens.

Write the result to `index.html` in the current working directory: a single
self-contained HTML file with inline CSS and JS, no external resources.

Build the file incrementally: create the HTML skeleton and styles first, then
append sections, content and JavaScript in several separate tool calls. Never
try to emit the entire file in a single tool call.
