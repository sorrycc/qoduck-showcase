# QoDuck Showcase

Single-file HTML pages built by [qodercli](https://qoder.com) + QoDuck, each from one prompt in a single non-interactive turn with no follow-up. Gallery: https://sorrycc.github.io/qoduck-showcase/

<!-- cases -->
| Case | Page | HTML | Prompt |
|---|---|---|---|
| Citrus pose | [live](https://sorrycc.github.io/qoduck-showcase/cases/citrus-pose/) | [source](cases/citrus-pose/index.html) | [prompt](cases/citrus-pose/prompt.md) |
| Cloud animal | [live](https://sorrycc.github.io/qoduck-showcase/cases/cloud-animal/) | [source](cases/cloud-animal/index.html) | [prompt](cases/cloud-animal/prompt.md) |
| Pelican bicycle SVG animated | [live](https://sorrycc.github.io/qoduck-showcase/cases/pelican-bicycle-svg-animated/) | [source](cases/pelican-bicycle-svg-animated/index.html) | [prompt](cases/pelican-bicycle-svg-animated/prompt.md) |
| Pelican bicycle SVG detailed | [live](https://sorrycc.github.io/qoduck-showcase/cases/pelican-bicycle-svg-detailed/) | [source](cases/pelican-bicycle-svg-detailed/index.html) | [prompt](cases/pelican-bicycle-svg-detailed/prompt.md) |
| Pelican bicycle three.js | [live](https://sorrycc.github.io/qoduck-showcase/cases/pelican-bicycle-threejs/) | [source](cases/pelican-bicycle-threejs/index.html) | [prompt](cases/pelican-bicycle-threejs/prompt.md) |
| Pirate ship sunset 3D | [live](https://sorrycc.github.io/qoduck-showcase/cases/pirate-ship-sunset-3d/) | [source](cases/pirate-ship-sunset-3d/index.html) | [prompt](cases/pirate-ship-sunset-3d/prompt.md) |
| Rubik's cube 3D | [live](https://sorrycc.github.io/qoduck-showcase/cases/rubiks-cube-3d/) | [source](cases/rubiks-cube-3d/index.html) | [prompt](cases/rubiks-cube-3d/prompt.md) |
| Tired ai | [live](https://sorrycc.github.io/qoduck-showcase/cases/tired-ai/) | [source](cases/tired-ai/index.html) | [prompt](cases/tired-ai/prompt.md) |
<!-- /cases -->

## Adding cases

```sh
./add-case.sh <agent-arena run-dir | entry-dir> [...]
```

Copies the page and its assets, the prompt and a thumbnail into `cases/<prompt>/`, then rebuilds `index.html` and the table above.
