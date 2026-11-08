#!/usr/bin/env python3
"""Regenerate index.html (gallery) and the case list in README.md from cases/*/."""
import html
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAGES = "https://sorrycc.github.io/qoduck-showcase"

cases = sorted(p.name for p in (ROOT / "cases").iterdir() if (p / "index.html").is_file())


WORDS = {"3d": "3D", "svg": "SVG", "threejs": "three.js", "rubiks": "Rubik's", "ai": "AI"}


def title(name):
    words = [WORDS.get(w, w) for w in name.split("-")]
    return " ".join([words[0][:1].upper() + words[0][1:], *words[1:]])


cards = []
for c in cases:
    thumb = f'<img src="cases/{c}/thumb.png" alt="" loading="lazy">' if (ROOT / "cases" / c / "thumb.png").is_file() else '<div class="ph"></div>'
    cards.append(f"""    <div class="card">
      <a href="cases/{c}/">{thumb}</a>
      <div class="meta"><a href="cases/{c}/">{html.escape(title(c))}</a><a class="p" href="cases/{c}/prompt.md">prompt</a></div>
    </div>""")

(ROOT / "index.html").write_text(f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QoDuck Showcase</title>
<style>
  :root {{ --bg:#fafaf7; --fg:#1b1b1b; --muted:#6b6b6b; --card:#fff; --line:#e6e4dd; }}
  @media (prefers-color-scheme: dark) {{ :root {{ --bg:#141414; --fg:#eee; --muted:#999; --card:#1d1d1d; --line:#2c2c2c; }} }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:var(--bg); color:var(--fg); font:15px/1.5 system-ui,-apple-system,sans-serif; }}
  header {{ max-width:1200px; margin:0 auto; padding:40px 16px 8px; }}
  h1 {{ margin:0 0 4px; font-size:28px; }}
  header p {{ margin:0; color:var(--muted); }}
  main {{ max-width:1200px; margin:0 auto; padding:24px 16px 64px; display:grid; gap:20px; grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr)); }}
  .card {{ background:var(--card); border:1px solid var(--line); border-radius:12px; overflow:hidden; transition:transform .15s; }}
  .card a {{ color:inherit; text-decoration:none; }}
  .card:hover {{ transform:translateY(-2px); }}
  .card img, .ph {{ display:block; width:100%; aspect-ratio:16/10; object-fit:cover; object-position:top; background:var(--line); }}
  .meta {{ display:flex; justify-content:space-between; gap:8px; padding:10px 14px; }}
  .p {{ color:var(--muted); font-size:13px; }}
</style>
</head>
<body>
<header>
  <h1>QoDuck Showcase</h1>
  <p>HTML pages built by qodercli + QoDuck from one prompt, no follow-up. Click a card to open the live page.</p>
</header>
<main>
{chr(10).join(cards)}
</main>
</body>
</html>
""")

readme = ROOT / "README.md"
text = readme.read_text() if readme.exists() else "# QoDuck Showcase\n\n<!-- cases -->\n<!-- /cases -->\n"
head, rest = text.split("<!-- cases -->", 1)
_, tail = rest.split("<!-- /cases -->", 1)
rows = "\n".join(f"| {title(c)} | [live]({PAGES}/cases/{c}/) | [source](cases/{c}/index.html) | [prompt](cases/{c}/prompt.md) |" for c in cases)
table = f"\n| Case | Page | HTML | Prompt |\n|---|---|---|---|\n{rows}\n"
readme.write_text(f"{head}<!-- cases -->{table}<!-- /cases -->{tail}")
print(f"index: {len(cases)} cases")
