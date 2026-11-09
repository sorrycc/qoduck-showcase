Render a black hole in real time in the browser.

Must have
- A starfield and a background galaxy that bend around the black hole through
  gravitational lensing, including the Einstein ring and the doubled images
  near the shadow.
- An accretion disk whose far side appears lifted above and below the shadow
  by lensing, the way it does in physically based renders, not a flat ring
  pasted on.
- Doppler beaming: the side of the disk moving toward the viewer is brighter
  and bluer, the other side dimmer and redder. The disk rotates, faster
  closer in, with turbulent structure that moves.
- A slow cinematic camera drift by default. Drag to orbit, scroll or pinch to
  move closer or farther; the lensing must stay correct from every angle,
  including edge-on and face-on.

Rules
- Raymarching in a fragment shader is expected. Keep it at 60 fps on a laptop;
  on a 390 px phone it may lower its resolution but must stay smooth.
- No UI apart from an optional, unobtrusive hint about the controls.

Color grading, scale and how far you push the physics are up to you. Aim for
the best real-time black hole you can make.

Write the result to `index.html` in the current working directory: one HTML
file that runs as-is. Any library you use must be a version-pinned module from
a CDN (e.g. `https://unpkg.com/three@0.169.0/build/three.module.js`) loaded via
an import map; all of your own CSS and JS stays inline. No build step, no local
asset files, no external models or textures: everything is built in code.

Build the file incrementally: create the HTML skeleton and styles first, then
append the JavaScript, 3D scene setup, shaders and interaction in several
separate tool calls. Never try to emit the entire file in a single tool call.
