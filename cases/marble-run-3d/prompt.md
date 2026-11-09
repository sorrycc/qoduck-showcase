Build a wooden marble run machine in 3D that runs forever.

Must have
- A tall machine with varied track sections: spirals, drops, a funnel, a
  seesaw that tips when a marble lands on it, a switch that sends alternate
  marbles left and right, a small loop, and a lift (wheel, screw or paddle
  chain) that carries marbles back to the top.
- 10–20 marbles moving at once with believable physics: they roll, speed up
  on slopes, bump into each other and click together, and never fall through
  the track or get stuck forever.
- The marbles are glass, with swirls inside and reflections. The machine is
  wood and brass.
- Click a marble to follow it with the camera; click empty space to go back
  to the overview. Drag to orbit.
- Soft rolling and clicking sounds made with Web Audio, starting after the
  first click on the page.

Rules
- 60 fps. Works at 1440 px and at 390 px wide.
- It must keep running for at least 10 minutes without marbles piling up
  or escaping.

Machine layout, physics approach and look are up to you.

Write the result to `index.html` in the current working directory: one HTML
file that runs as-is. Any library you use must be a version-pinned module from
a CDN (e.g. `https://unpkg.com/three@0.169.0/build/three.module.js`) loaded via
an import map; all of your own CSS and JS stays inline. No build step, no local
asset files, no external models or textures: everything is built in code.

Build the file incrementally: create the HTML skeleton and styles first, then
append the JavaScript, 3D scene setup, shaders and interaction in several
separate tool calls. Never try to emit the entire file in a single tool call.
