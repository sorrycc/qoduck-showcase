Build the website for Low Tide Coffee, a small coffee roaster with one shop.
This is a place, not a software product: it should feel like this shop and no
other.

Use exactly this content. Do not invent other facts (no extra addresses,
reviews, awards, stats or team members).

- Name: Low Tide Coffee — "Roasted on Tuesdays, gone by Sunday."
- Story: Founded in 2019 by Mara Quint in a former boat repair shed by the
  harbor. Roasts 40 kg a week on a 1962 Probat drum roaster. Light roasts only.
- Current beans (name · origin · notes · 250 g price):
  - Kettle Hill · Ethiopia, Guji · peach, jasmine, black tea · €16
  - Slow Water · Colombia, Huila · red apple, panela, cocoa · €14
  - Night Ferry · Kenya, Nyeri · blackcurrant, grapefruit · €18
  - Harbor House · Brazil, Mogiana · hazelnut, milk chocolate · €12 (sold out)
- Shop: 4 Quay Lane. Wed–Sun 8:00–15:00, closed Mon–Tue (roasting days).
- Subscription: one bag every two weeks, roaster's choice, €13 per bag.
- Contact: hello@lowtide.coffee

Must have
- A clear way to see the beans and a working "add to bag" with a bag count
  that updates; the sold-out bean cannot be added and says so.
- Opening hours that show whether the shop is open right now, using the
  visitor's local time.
- A subscription sign-up form with email validation and a visible success
  state.

Rules
- Responsive at 1440, 768 and 390 px wide. Light and dark schemes via
  `prefers-color-scheme`.
- No images are supplied. Whatever visuals you use you must make yourself
  (CSS, SVG, canvas). Do not leave empty image placeholders.

Layout, type, color, tone of voice and motion are up to you.

Write the result to `index.html` in the current working directory: a single
self-contained HTML file with inline CSS and JS, no external resources.

Build the file incrementally: create the HTML skeleton and styles first, then
append sections, content and JavaScript in several separate tool calls. Never
try to emit the entire file in a single tool call.
