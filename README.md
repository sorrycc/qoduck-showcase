# QoDuck Showcase

HTML pages built by [qodercli](https://qoder.com) + QoDuck, each from one prompt in a single non-interactive turn with no follow-up. Gallery: https://sorrycc.github.io/qoduck-showcase/

<!-- cases -->
| Case | Page | HTML | Prompt |
|---|---|---|---|
| Boarding pass with skill | [live](https://sorrycc.github.io/qoduck-showcase/cases/boarding-pass-with-skill/) | [source](cases/boarding-pass-with-skill/index.html) | [prompt](cases/boarding-pass-with-skill/prompt.md) |
| Boarding pass without skill | [live](https://sorrycc.github.io/qoduck-showcase/cases/boarding-pass-without-skill/) | [source](cases/boarding-pass-without-skill/index.html) | [prompt](cases/boarding-pass-without-skill/prompt.md) |
| Citrus pose | [live](https://sorrycc.github.io/qoduck-showcase/cases/citrus-pose/) | [source](cases/citrus-pose/index.html) | [prompt](cases/citrus-pose/prompt.md) |
| Cloud animal | [live](https://sorrycc.github.io/qoduck-showcase/cases/cloud-animal/) | [source](cases/cloud-animal/index.html) | [prompt](cases/cloud-animal/prompt.md) |
| Coffee roaster site with skill | [live](https://sorrycc.github.io/qoduck-showcase/cases/coffee-roaster-site-with-skill/) | [source](cases/coffee-roaster-site-with-skill/index.html) | [prompt](cases/coffee-roaster-site-with-skill/prompt.md) |
| Coffee roaster site without skill | [live](https://sorrycc.github.io/qoduck-showcase/cases/coffee-roaster-site-without-skill/) | [source](cases/coffee-roaster-site-without-skill/index.html) | [prompt](cases/coffee-roaster-site-without-skill/prompt.md) |
| Dragon castle storm | [live](https://sorrycc.github.io/qoduck-showcase/cases/dragon-castle-storm/) | [source](cases/dragon-castle-storm/index.html) | [prompt](cases/dragon-castle-storm/prompt.md) |
| Mayoi landing with skill | [live](https://sorrycc.github.io/qoduck-showcase/cases/mayoi-landing-with-skill/) | [source](cases/mayoi-landing-with-skill/index.html) | [prompt](cases/mayoi-landing-with-skill/prompt.md) |
| Mayoi landing without skill | [live](https://sorrycc.github.io/qoduck-showcase/cases/mayoi-landing-without-skill/) | [source](cases/mayoi-landing-without-skill/index.html) | [prompt](cases/mayoi-landing-without-skill/prompt.md) |
| Ops dashboard with skill | [live](https://sorrycc.github.io/qoduck-showcase/cases/ops-dashboard-with-skill/) | [source](cases/ops-dashboard-with-skill/index.html) | [prompt](cases/ops-dashboard-with-skill/prompt.md) |
| Ops dashboard without skill | [live](https://sorrycc.github.io/qoduck-showcase/cases/ops-dashboard-without-skill/) | [source](cases/ops-dashboard-without-skill/index.html) | [prompt](cases/ops-dashboard-without-skill/prompt.md) |
| Pelican bicycle SVG animated | [live](https://sorrycc.github.io/qoduck-showcase/cases/pelican-bicycle-svg-animated/) | [source](cases/pelican-bicycle-svg-animated/index.html) | [prompt](cases/pelican-bicycle-svg-animated/prompt.md) |
| Pelican bicycle SVG detailed | [live](https://sorrycc.github.io/qoduck-showcase/cases/pelican-bicycle-svg-detailed/) | [source](cases/pelican-bicycle-svg-detailed/index.html) | [prompt](cases/pelican-bicycle-svg-detailed/prompt.md) |
| Pelican bicycle three.js | [live](https://sorrycc.github.io/qoduck-showcase/cases/pelican-bicycle-threejs/) | [source](cases/pelican-bicycle-threejs/index.html) | [prompt](cases/pelican-bicycle-threejs/prompt.md) |
| Pirate ship sunset 3D | [live](https://sorrycc.github.io/qoduck-showcase/cases/pirate-ship-sunset-3d/) | [source](cases/pirate-ship-sunset-3d/index.html) | [prompt](cases/pirate-ship-sunset-3d/prompt.md) |
| Rubik's cube 3D | [live](https://sorrycc.github.io/qoduck-showcase/cases/rubiks-cube-3d/) | [source](cases/rubiks-cube-3d/index.html) | [prompt](cases/rubiks-cube-3d/prompt.md) |
| Sakura valley 3D | [live](https://sorrycc.github.io/qoduck-showcase/cases/sakura-valley-3d/) | [source](cases/sakura-valley-3d/index.html) | [prompt](cases/sakura-valley-3d/prompt.md) |
| Ship in bottle voxel | [live](https://sorrycc.github.io/qoduck-showcase/cases/ship-in-bottle-voxel/) | [source](cases/ship-in-bottle-voxel/index.html) | [prompt](cases/ship-in-bottle-voxel/prompt.md) |
| Tired AI | [live](https://sorrycc.github.io/qoduck-showcase/cases/tired-ai/) | [source](cases/tired-ai/index.html) | [prompt](cases/tired-ai/prompt.md) |
<!-- /cases -->

The Mayoi landing, ops dashboard, coffee roaster site and boarding pass pairs each come from the same prompt: the "with skill" run also used the frontend-rails skill, the "without skill" run did not. The boarding pass "with skill" prompt also asks the agent to build the file incrementally across several tool calls.

## Adding cases

```sh
./add-case.sh <agent-arena run-dir | entry-dir> [...]
```

Copies the page and its assets, the prompt and a thumbnail into `cases/<prompt>/`, then rebuilds `index.html` and the table above.
