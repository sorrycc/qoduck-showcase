#!/usr/bin/env python3
"""Regenerate index.html (gallery), per-case card.webp and the case list in README.md from cases/*/.

Styling lives in tokens.css / primitives.css (frontend-rails mono-print theme) and page.css; see DESIGN.md.
"""
import difflib
import hashlib
import html
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
PAGES = "https://sorrycc.github.io/qoduck-showcase"
REPO = "https://github.com/sorrycc/qoduck-showcase"
SKILL = "https://github.com/sorrycc/frontend-rails"
CARD_W, CARD_H = 960, 600

cases = sorted(p.name for p in (ROOT / "cases").iterdir() if (p / "index.html").is_file())

WORDS = {"3d": "3D", "svg": "SVG", "threejs": "three.js", "rubiks": "Rubik's", "ai": "AI"}
SCENE = re.compile(r"""three(\.module)?(\.min)?\.js|from ['"]three['"]|getContext\(['"]webgl|WebGLRenderer""", re.I)


def title(name):
    words = [WORDS.get(w, w) for w in name.split("-")]
    return " ".join([words[0][:1].upper() + words[0][1:], *words[1:]])


def esc(s):
    return html.escape(s, quote=True)


def card(c):
    """Top-cropped 16:10 WebP of the full-page thumb; the PNGs are 1-3MB each."""
    src, dst = ROOT / "cases" / c / "thumb.png", ROOT / "cases" / c / "card.webp"
    if not src.is_file():
        return None
    if not dst.is_file() or dst.stat().st_mtime < src.stat().st_mtime:
        im = Image.open(src).convert("RGB")
        im = im.crop((0, 0, im.width, min(im.height, round(im.width * CARD_H / CARD_W))))
        im.resize((CARD_W, round(CARD_W * im.height / im.width)), Image.LANCZOS).save(dst, "WEBP", quality=80, method=6)
    # Content hash in the URL: Pages serves max-age=600, so a reshot card would otherwise stay stale.
    return f"cases/{c}/card.webp?v={hashlib.sha1(dst.read_bytes()).hexdigest()[:8]}"


def kb(c):
    return f"{(ROOT / 'cases' / c / 'index.html').stat().st_size / 1024:,.0f} KB"


def is_zh(c):
    p = ROOT / "cases" / c / "prompt.md"
    return p.is_file() and re.search(r"[一-鿿]", p.read_text()) is not None


def shot(c, alt):
    src = card(c)
    img = f'<img src="{src}" alt="{esc(alt)}" width="{CARD_W}" height="{CARD_H}">' if src else '<span class="shot-empty">No screenshot</span>'
    return f'<a class="shot" href="cases/{c}/">{img}</a>'


def links(c):
    return (f'<p class="links"><a href="cases/{c}/">Open page</a>'
            f'<a href="{REPO}/blob/master/cases/{c}/prompt.md">Prompt</a>'
            f'<a href="{REPO}/blob/master/cases/{c}/index.html">Source</a></p>')


def case_item(c):
    meta = f'index.html · {kb(c)}' + (' · Chinese prompt' if is_zh(c) else '')
    return f"""        <li class="case">
          {shot(c, f"Screenshot of {title(c)}")}
          <h3><a href="cases/{c}/">{esc(title(c))}</a></h3>
          <p class="meta">{esc(meta)}</p>
          {links(c)}
        </li>"""


def prompt_extra(a, b):
    """Lines in prompt a that prompt b doesn't have."""
    la = (ROOT / "cases" / a / "prompt.md").read_text().splitlines()
    lb = (ROOT / "cases" / b / "prompt.md").read_text().splitlines()
    out = [l[1:] for l in difflib.ndiff(lb, la) if l.startswith("+ ")]
    return "\n".join(out).strip()


pairs = sorted({c[: -len("-with-skill")] for c in cases if c.endswith("-with-skill") and f"{c[:-len('-with-skill')]}-without-skill" in cases})
paired = {f"{p}-{s}" for p in pairs for s in ("with-skill", "without-skill")}
singles = [c for c in cases if c not in paired]
scenes = [c for c in singles if SCENE.search((ROOT / "cases" / c / "index.html").read_text(errors="ignore"))]
flat = [c for c in singles if c not in scenes]


def pair_block(p):
    w, wo = f"{p}-with-skill", f"{p}-without-skill"
    extra = prompt_extra(w, wo)
    diff = (f"""
          <details class="diff">
            <summary>What the "with skill" prompt adds</summary>
            <pre>{esc(extra)}</pre>
          </details>""" if extra else """
          <p class="meta">Both runs got the same prompt.</p>""")
    fig = lambda c, label, cls: f"""            <figure class="side {cls}">
              {shot(c, f"Screenshot of {title(p)}, {label.lower()}")}
              <figcaption><span class="tag">{label}</span><span class="meta">index.html · {kb(c)}</span></figcaption>
              {links(c)}
            </figure>"""
    return f"""        <article class="pair">
          <h3>{esc(title(p))}</h3>
          <div class="pair-grid">
{fig(wo, "Without skill", "side-plain")}
{fig(w, "With frontend-rails", "side-skill")}
          </div>{diff}
        </article>"""


def case_section(sid, heading, lead, items):
    if not items:
        return ""
    return f"""    <section class="section rule" id="{sid}" aria-labelledby="{sid}-h">
      <div class="container stack-lg">
        <div class="stack">
          <h2 id="{sid}-h">{heading}</h2>
          <p class="lead">{lead}</p>
        </div>
        <ul class="cases">
{chr(10).join(case_item(c) for c in items)}
        </ul>
      </div>
    </section>"""


compare = f"""    <section class="section rule" id="compare" aria-labelledby="compare-h">
      <div class="container stack-lg">
        <div class="stack">
          <h2 id="compare-h">With and without frontend-rails</h2>
          <p class="lead">Each pair was built twice from the same brief. One run also had the <a href="{SKILL}">frontend-rails</a> skill: a ready-made theme, its tokens, and a browser check that screenshots the page and flags what to fix.</p>
        </div>
{chr(10).join(pair_block(p) for p in pairs)}
      </div>
    </section>""" if pairs else ""

nav = "".join(f'<li><a href="#{sid}">{label}</a></li>' for sid, label, items in
              (("compare", "Comparisons", pairs), ("scenes", "3D scenes", scenes), ("pages", "2D pages", flat)) if items)

(ROOT / "index.html").write_text(f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QoDuck Showcase</title>
<meta name="description" content="Web pages built by qodercli and QoDuck, each from one prompt with no follow-up.">
<link rel="icon" href="data:,">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&family=Space+Mono:wght@400;700&display=swap">
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="primitives.css">
<link rel="stylesheet" href="page.css">
</head>
<body>
  <header class="container nav">
    <a class="wordmark" href="./">QoDuck Showcase</a>
    <nav aria-label="Sections"><ul>{nav}<li><a href="{REPO}">GitHub</a></li></ul></nav>
  </header>
  <main>
    <section class="hero" aria-labelledby="top-h">
      <div class="container stack-lg">
        <h1 id="top-h">One prompt.<br>One turn.<br><span class="accent">No follow-up.</span></h1>
        <p class="lead">Web pages built by qodercli with the QoDuck model. Each one came from a single prompt in a single non-interactive run. Nobody asked for fixes afterwards, so what you open is exactly what the agent handed back.</p>
        <dl class="stats">
          <div><dt>Pages</dt><dd>{len(cases)}</dd></div>
          <div><dt>Skill comparisons</dt><dd>{len(pairs)}</dd></div>
          <div><dt>3D scenes</dt><dd>{len(scenes)}</dd></div>
          <div><dt>2D pages</dt><dd>{len(flat)}</dd></div>
        </dl>
      </div>
    </section>
{compare}
{case_section("scenes", "3D scenes", "Three.js and WebGL worlds you can orbit, scrub and poke at. Drag to look around once a page has loaded.", scenes)}
{case_section("pages", "Illustration, SVG and pages", "Vector drawings, canvas animation and plain HTML and CSS pages.", flat)}
  </main>
  <footer class="footer">
    <div class="container cluster spread">
      <p>Each case links to its live page, the exact prompt and the HTML source.</p>
      <p><a href="{REPO}">sorrycc/qoduck-showcase</a> · styled with the mono-print theme from <a href="{SKILL}">frontend-rails</a></p>
    </div>
  </footer>
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
print(f"index: {len(cases)} cases ({len(pairs)} pairs, {len(scenes)} scenes, {len(flat)} pages)")
