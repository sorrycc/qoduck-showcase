Build a browser Mario Kart clone with Three.js: low-poly, 8 karts, chase camera,
3 laps on a snowy circuit.

Must have
- A dense scene: closed-loop track with blue-and-white curbs, a checkered
  start/finish gantry with lights, grandstands full of blocky colored crowd,
  snow scenery (pines, snowmen, mountains, aurora, a balloon or two).
- A full HUD: item slot top-left, LAP x/3 and race timer top-right, big position
  ("5th") bottom-left, speedometer arc bottom-center that turns orange on boost,
  minimap bottom-right with a dot per kart.
- Race events that keep firing: 3-2-1-GO countdown, boost off the line, mushroom
  pickups, item hits with a screen flash and spin-out, a green "▲ 6TH" / red
  "▼ 7TH" toast on every position change, results after lap 3.

Rules
- 7 AI karts that race a waypoint racing line, not the road centerline, and
  jostle for position. Items hit them too.
- Checkpoints so laps and positions can't be cheated by cutting the track.
- Keyboard: arrows/WASD to drive, one key to use the item.
- Smooth with 8 karts on screen, no clipping through walls or each other.

Style, colors, kart shapes, and everything else are up to you. Make it feel
alive.

Write the result to `index.html` in the current working directory: one HTML
file that runs as-is. The only external resource permitted is Three.js itself,
a version-pinned module from a CDN (e.g.
`https://unpkg.com/three@0.169.0/build/three.module.js`) loaded via an import
map; all of your own CSS and JS stays inline. No build step, no local asset
files.

Build the file incrementally: create the HTML skeleton, HUD and styles first,
then append the JavaScript, scene setup and game logic in several separate tool
calls. Never try to emit the entire file in a single tool call.
