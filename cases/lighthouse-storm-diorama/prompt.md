Build a tabletop diorama of a lighthouse on a rocky island during a storm at
night.

Must have
- A square base with cut-away edges like a museum model, showing rock layers
  and the sea's depth in cross-section at the sides.
- The lighthouse with its keeper's cottage. The lamp turns, and its beam
  sweeps through the rain and lights up the waves and the rocks it passes
  over. The cottage windows are warm and lit from inside; everything outside
  is cold, wet and dark.
- A rough sea that breaks against the rocks with foam and spray, wind-driven
  rain, low clouds, and lightning every so often that briefly lights the
  whole scene.
- A small boat out at sea, pitching in the waves, heading for shelter.
- Drag to rotate, scroll or pinch to zoom; the diorama never leaves the
  frame. No other UI.

Rules
- 60 fps on a laptop and still smooth at 390 px wide on a phone. Keep draw
  calls low (instancing, merged geometry) and cap the pixel ratio.
- Do not fake the 3D with a painted backdrop.

Art style (realistic, low-poly, stylized) and color palette are up to you.
It should look like something you'd want on a shelf.

Write the result to `index.html` in the current working directory: one HTML
file that runs as-is. Any library you use must be a version-pinned module from
a CDN (e.g. `https://unpkg.com/three@0.169.0/build/three.module.js`) loaded via
an import map; all of your own CSS and JS stays inline. No build step, no local
asset files, no external models or textures: everything is built in code.

Build the file incrementally: create the HTML skeleton and styles first, then
append the JavaScript, 3D scene setup, shaders and interaction in several
separate tool calls. Never try to emit the entire file in a single tool call.
