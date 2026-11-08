Build a single HTML file with Three.js from a CDN, no external models or
textures: a pirate ship sailing into the sunset, camera orbits around it with
mouse drag.

Must have

- The sunset owns the frame. Sky graded purple at the top through pink to gold
  at the horizon with soft streaked clouds, sun low and big. When the camera
  looks toward the sun the water throws a blown-out glare and the sails glow
  from behind.
- Ocean that reads as water: rolling swell with small chop, deep teal facing
  away from the sun, gold and pink where it mirrors the sky. A long white foam
  wake trailing off the stern.
- A three-masted pirate ship built from primitives: dark red-brown planked hull
  with gunports, square sails on the masts plus a big triangular jib at the
  bow, dense rigging, black flag on the mainmast, lanterns glowing warm orange
  on deck and lit windows across the stern.
- The ship rides the waves. Pitch, roll and heave follow the swell under the
  hull, never flat.
- OrbitControls centered on the ship, slow auto-rotate when idle. A few birds
  in the sky, a faint island on the horizon.

Rules

- Everything procedural in one file, only the three.js CDN.
- Smooth 60 fps fullscreen, handles resize.
- No hull clipping through the water, no hard line where sky meets sea (use
  haze).

Style, colors, props, and everything else are up to you. Make it feel alive.

Constraints:

- The only external resource permitted is three.js itself: version-pinned
  modules from a CDN (e.g.
  `https://unpkg.com/three@0.169.0/build/three.module.js` plus
  `https://unpkg.com/three@0.169.0/examples/jsm/controls/OrbitControls.js`),
  loaded via an import map. Everything else — all CSS and JS — inline. No
  build step. No external models, textures, or images.

Write the result to `index.html` in the current working directory: a single
self-contained HTML file apart from those three.js imports.
