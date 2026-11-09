Make a rock pool at the seashore, seen from above at a slight angle, with
water you can touch.

Must have
- Clear shallow water over rocks, sand, shells, seaweed and a few small
  creatures (a crab, small fish, an anemone, a starfish).
- Moving caustics: bright light patterns that dance across the bottom and
  the creatures, matching the waves on the surface above them.
- The surface refracts what is below it, reflects the sky at shallow angles,
  and shows small wind ripples.
- Clicking or tapping the water sends out ripples that spread, bounce off the
  rocks, and bend the caustics and the view underneath. Fish dart away from
  the ripple; the anemone closes and slowly reopens.
- Now and then a wave from the sea washes over the edge of the pool and
  stirs it up.

Rules
- 60 fps on a laptop and smooth at 390 px wide on a phone.
- No UI.

Lighting, time of day, style and technique are up to you.

Write the result to `index.html` in the current working directory: one HTML
file that runs as-is. Any library you use must be a version-pinned module from
a CDN (e.g. `https://unpkg.com/three@0.169.0/build/three.module.js`) loaded via
an import map; all of your own CSS and JS stays inline. No build step, no local
asset files, no external models or textures: everything is built in code.

Build the file incrementally: create the HTML skeleton and styles first, then
append the JavaScript, 3D scene setup, shaders and interaction in several
separate tool calls. Never try to emit the entire file in a single tool call.
