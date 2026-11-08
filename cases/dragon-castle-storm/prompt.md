Build a single HTML file with Three.js: a voxel dragon guarding a voxel castle on a
rocky peak, at night in a thunderstorm, as a ~30 s looping cinematic.

Must have
- Everything is built from voxels (dragon, castle, crag); the castle windows glow warm
  against a cold blue-teal night
- The dragon is articulated: segmented wings that unfold and beat, plus a neck and tail
  that sway. It is never a stiff mesh
- Fire breath is a real light source: an orange glow floods the clouds, rain, and castle
  for the length of the burst
- Beats:
  - 0–6 s: dragon perched on the castle, wings flexing, moon behind, slow push-in
  - 6–11 s: it takes off and circles the castle, breathes fire, lightning flashes across
    the sky
  - 11–19 s: camera orbits close, wings fill the frame, then it banks out wide
  - 19–23 s: a second fire pass toward the camera with lightning behind it
  - 23–30 s: it glides back to the perch and the loop restarts on the opening shot

Rules
- Seamless loop: the first and last frames match
- Constant slanted rain, drifting clouds, and fog that hides the edges of the world (no
  visible ground edge)
- The dragon never clips through the castle, and the camera never clips through the
  dragon
- Smooth 60 fps, eased camera moves, no cuts

Colors, voxel resolution, castle design, and sound are up to you. Make it feel alive.

Write the result to `index.html` in the current working directory.

Build the file incrementally: create the HTML skeleton and styles first, then append the
JavaScript, voxel geometry, materials, lighting and animation in several separate tool
calls. Never try to emit the entire file in a single tool call.
