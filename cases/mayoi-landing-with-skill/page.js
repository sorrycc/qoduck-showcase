/* Mayoi landing — nav, tour, theme previewer, install tabs, command palette, canvases */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RELEASES = 'https://github.com/sorrycc/Mayoi/releases/latest';
  const REPO = 'https://github.com/sorrycc/Mayoi';
  const BREW = 'brew tap --custom-remote sorrycc/mayoi https://github.com/sorrycc/Mayoi.git\nbrew trust sorrycc/mayoi\nbrew install --cask mayoi';
  const LINUX = 'curl -fsSL https://github.com/sorrycc/Mayoi/releases/latest/download/install.sh | sh';

  const rgbOf = (cssColor) => {
    const m = cssColor.trim().match(/^#([0-9a-f]{6})$/i);
    if (m) return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)];
    const n = cssColor.match(/[\d.]+/g).map(Number);
    return [n[0], n[1], n[2]];
  };
  const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /* ---------- color theme ---------- */
  const root = document.documentElement;
  const themeToggle = $('#themeToggle');
  const effectiveDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const setThemeLabel = () => themeToggle.setAttribute('aria-label', effectiveDark() ? 'Switch to light theme' : 'Switch to dark theme');
  const toggleTheme = () => {
    root.dataset.theme = effectiveDark() ? 'light' : 'dark';
    setThemeLabel();
    paintStaticFields();
  };
  themeToggle.addEventListener('click', toggleTheme);
  setThemeLabel();

  /* ---------- toast + clipboard ---------- */
  const toast = $('#toast');
  let toastTimer = 0;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 1600);
  };
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.append(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    showToast('Copied to clipboard');
  };
  $$('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await copyText(btn.dataset.copy);
      btn.classList.add('is-copied');
      setTimeout(() => btn.classList.remove('is-copied'), 1600);
    });
  });

  /* ---------- nav: scrolled state, progress, parallax, scrollspy ---------- */
  const nav = $('.site-nav');
  const bar = $('#progressBar');
  const glow = $('.hero-glow');
  const hero = $('.hero');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      nav.classList.toggle('is-scrolled', y > 8);
      if (y < hero.offsetHeight * 0.4) navLinks.forEach((a) => a.removeAttribute('aria-current'));
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      if (!reduced && y < hero.offsetHeight) glow.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navLinks = $$('.nav-sections a');
  const spy = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      navLinks.forEach((a) => {
        if (a.getAttribute('href') === `#${e.target.id}`) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['features', 'tour', 'themes', 'install'].forEach((id) => spy.observe(document.getElementById(id)));

  /* ---------- generic tablist keyboard ---------- */
  const wireTabs = (list, vertical, onPick) => {
    const tabs = $$('[role="tab"]', list);
    const pick = (tab, focus = true) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      if (focus) tab.focus();
      onPick(tabs.indexOf(tab));
    };
    tabs.forEach((t) => t.addEventListener('click', () => pick(t, false)));
    list.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const next = vertical
        ? { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key]
        : { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      pick(tabs[(next + tabs.length) % tabs.length]);
    });
    return pick;
  };

  /* ---------- tour ---------- */
  const tourStops = [
    { title: 'mayoi — quick open' },
    { title: 'mayoi — find in files' },
    { title: 'mayoi — peek a change' },
    { title: 'mayoi — commit graph' },
    { title: 'mayoi — markdown preview' },
    { title: 'mayoi — project tabs' },
  ];
  const tourShots = $$('.tour-shot');
  const tourCaptions = $$('.tour-caption');
  const tourTitle = $('#tourTitle');
  const tourPanel = $('#tour-panel');
  wireTabs($('.tour-tabs'), true, (i) => {
    tourShots.forEach((img, n) => img.classList.toggle('is-active', n === i));
    tourCaptions.forEach((p, n) => { p.hidden = n !== i; });
    tourTitle.textContent = tourStops[i].title;
    tourPanel.setAttribute('aria-labelledby', `tour-tab-${i}`);
  });

  /* ---------- install tabs ---------- */
  const installIds = ['mac', 'linux', 'win', 'src'];
  wireTabs($('.install-tabs'), false, (i) => {
    installIds.forEach((id, n) => { document.getElementById(`install-panel-${id}`).hidden = n !== i; });
  });
  if (navigator.platform.startsWith('Win')) $('.install-tabs [id="install-tab-win"]').click();
  else if (navigator.platform.startsWith('Linux')) $('.install-tabs [id="install-tab-linux"]').click();

  /* ---------- theme previewer ---------- */
  const THEMES = {
    light: ['Light', 'Light — warm paper, indigo ink. The quiet default.'],
    dark: ['Dark', 'Dark — near-black with GitHub-flavored syntax. The other quiet default.'],
    matrix: ['The Matrix', 'The Matrix — the whole window in the code’s font, with digital rain.'],
    rabbit: ['White Rabbit', 'White Rabbit — down the hole, in pink and cream.'],
    purplegold: ['Purple Gold', 'Purple Gold — indigo night, gold leaf. The house style.'],
    jack: ["Jack-o'-Lantern", 'Jack-o’-Lantern — ember orange on soot. October, all year.'],
    witch: ["Witch's Brew", 'Witch’s Brew — green flame and nightshade.'],
    blood: ['Blood Moon', 'Blood Moon — red on black, for the last commit of the night.'],
    claude: ['Claude', 'Claude — terracotta on cream, in light and dark.'],
    qoder: ['Qoder', 'Qoder — deep green terminal light.'],
    grok: ['Grok Bot', 'Grok Bot — monochrome, nothing else.'],
    cursor: ['Cursor', 'Cursor — cool slate and blue.'],
  };
  const mock = $('#mockWindow');
  const mockName = $('#mockThemeName');
  const blurb = $('#themeBlurb');
  const chips = $$('.chip');
  const rainToggle = $('#rainToggle');
  let rainInk = [63, 185, 80];
  let rainBg = [0, 0, 0];
  const readRainColors = () => {
    const cs = getComputedStyle(mock);
    rainInk = rgbOf(cs.getPropertyValue('--m-kw'));
    rainBg = rgbOf(cs.getPropertyValue('--m-bg'));
  };
  const pickTheme = (name) => {
    const t = THEMES[name];
    if (!t) return;
    for (const role of ['bg', 'bar', 'ink', 'dim', 'kw', 'str', 'fn', 'line']) {
      mock.style.setProperty(`--m-${role}`, `var(--th-${name}-${role})`);
    }
    mock.dataset.mtheme = name;
    mockName.textContent = t[0];
    blurb.textContent = t[1];
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.themeName === name)));
    readRainColors();
    clearRain();
    if (name === 'matrix' && !rainToggle.checked) { rainToggle.checked = true; }
    updateRain();
  };
  chips.forEach((c) => c.addEventListener('click', () => pickTheme(c.dataset.themeName)));
  readRainColors();

  /* ---------- digital rain canvas ---------- */
  const rainCanvas = $('#rainCanvas');
  const rctx = rainCanvas.getContext('2d');
  const GLYPHS = 'アイウエオカキクケコサシスセソタチツテト0123456789迷い';
  let rainCols = [];
  let rainRunning = false;
  let rainRaf = 0;
  let themesInView = false;
  const sizeRain = () => {
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    const w = rainCanvas.clientWidth, h = rainCanvas.clientHeight;
    rainCanvas.width = Math.max(1, Math.round(w * dpr));
    rainCanvas.height = Math.max(1, Math.round(h * dpr));
    rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const fs = 12;
    rainCols = Array.from({ length: Math.ceil(w / fs) }, () => ({ y: Math.random() * h, s: 4 + Math.random() * 8 }));
    clearRain();
  };
  const clearRain = () => {
    rctx.clearRect(0, 0, rainCanvas.clientWidth, rainCanvas.clientHeight);
  };
  const rainFrame = () => {
    if (!rainRunning) return;
    const w = rainCanvas.clientWidth, h = rainCanvas.clientHeight;
    rctx.fillStyle = `rgba(${rainBg[0]}, ${rainBg[1]}, ${rainBg[2]}, 0.14)`;
    rctx.fillRect(0, 0, w, h);
    rctx.font = '12px "IBM Plex Mono", monospace';
    rctx.fillStyle = `rgba(${rainInk[0]}, ${rainInk[1]}, ${rainInk[2]}, 0.75)`;
    rainCols.forEach((c, i) => {
      rctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * 12, c.y);
      c.y += c.s;
      if (c.y > h && Math.random() > 0.97) c.y = -12;
    });
    rainRaf = requestAnimationFrame(rainFrame);
  };
  const updateRain = () => {
    const want = rainToggle.checked && themesInView && !reduced;
    if (want && !rainRunning) { rainRunning = true; rainRaf = requestAnimationFrame(rainFrame); }
    if (!want && rainRunning) { rainRunning = false; cancelAnimationFrame(rainRaf); clearRain(); }
    if (!want) clearRain();
  };
  rainToggle.addEventListener('change', updateRain);
  new IntersectionObserver((es) => { themesInView = es[0].isIntersecting; updateRain(); }, { rootMargin: '80px' }).observe($('#themes'));

  /* ---------- hero pixel field ---------- */
  const field = $('#pixelField');
  const fctx = field.getContext('2d');
  let pixels = [];
  let fieldRunning = false;
  let fieldRaf = 0;
  let fieldColors = [];
  const readFieldColors = () => { fieldColors = ['--gold', '--violet', '--teal'].map((n) => rgbOf(token(n))); };
  const sizeField = () => {
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    const w = field.clientWidth, h = field.clientHeight;
    field.width = Math.max(1, Math.round(w * dpr));
    field.height = Math.max(1, Math.round(h * dpr));
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(70, Math.round(w / 18));
    pixels = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      s: [2, 3, 4][(Math.random() * 3) | 0],
      v: 0.08 + Math.random() * 0.25,
      a: 0.08 + Math.random() * 0.2,
      c: Math.random() < 0.7 ? 0 : (Math.random() < 0.5 ? 1 : 2),
    }));
    drawField(false);
  };
  const drawField = (move) => {
    const w = field.clientWidth, h = field.clientHeight;
    fctx.clearRect(0, 0, w, h);
    for (const p of pixels) {
      if (move) { p.y -= p.v; if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; } }
      const c = fieldColors[p.c];
      fctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${p.a})`;
      fctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
    }
  };
  const fieldFrame = () => {
    if (!fieldRunning) return;
    drawField(true);
    fieldRaf = requestAnimationFrame(fieldFrame);
  };
  const updateField = (inView) => {
    const want = inView && !reduced;
    if (want && !fieldRunning) { fieldRunning = true; fieldRaf = requestAnimationFrame(fieldFrame); }
    if (!want && fieldRunning) { fieldRunning = false; cancelAnimationFrame(fieldRaf); }
  };
  new IntersectionObserver((es) => updateField(es[0].isIntersecting)).observe(hero);
  function paintStaticFields() {
    readFieldColors();
    readRainColors();
    drawField(false);
    clearRain();
  }

  /* ---------- command palette ---------- */
  const scrim = $('#paletteScrim');
  const input = $('#paletteInput');
  const list = $('#paletteList');
  let lastFocus = null;
  let active = 0;
  let shown = [];
  const goto = (id) => { closePalette(); document.getElementById(id).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); };
  const commands = [
    { label: 'Download for macOS', tag: 'install', run: () => window.open(RELEASES, '_blank', 'noopener') },
    { label: 'Copy Homebrew install command', tag: 'install', run: () => copyText(BREW) },
    { label: 'Copy Linux install command', tag: 'install', run: () => copyText(LINUX) },
    { label: 'Go to Features', tag: 'jump', run: () => goto('features') },
    { label: 'Go to Tour', tag: 'jump', run: () => goto('tour') },
    { label: 'Go to Themes', tag: 'jump', run: () => goto('themes') },
    { label: 'Go to Install', tag: 'jump', run: () => goto('install') },
    { label: 'Go to Shortcuts', tag: 'jump', run: () => goto('shortcuts') },
    { label: 'Toggle light / dark theme', tag: 'view', run: toggleTheme },
    { label: 'Start digital rain', tag: 'themes', run: () => { rainToggle.checked = true; updateRain(); goto('themes'); } },
    { label: 'Stop digital rain', tag: 'themes', run: () => { rainToggle.checked = false; updateRain(); } },
    { label: 'Wear The Matrix theme', tag: 'themes', run: () => { pickTheme('matrix'); goto('themes'); } },
    { label: 'Wear a random theme', tag: 'themes', run: () => { const k = Object.keys(THEMES); pickTheme(k[(Math.random() * k.length) | 0]); goto('themes'); } },
    { label: 'Open GitHub repository', tag: 'project', run: () => window.open(REPO, '_blank', 'noopener') },
    { label: 'Browse releases', tag: 'project', run: () => window.open(RELEASES, '_blank', 'noopener') },
  ];
  const fuzzy = (q, s) => {
    q = q.toLowerCase(); s = s.toLowerCase();
    if (!q) return 1;
    if (s.includes(q)) return 2 + q.length / s.length;
    let i = 0, gaps = 0;
    for (const ch of s) {
      if (ch === q[i]) i++;
      else if (i > 0) gaps++;
    }
    return i === q.length ? 1 / (1 + gaps) : 0;
  };
  const renderPalette = () => {
    const q = input.value.trim();
    shown = commands.map((c) => ({ c, score: fuzzy(q, c.label) })).filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score).map((x) => x.c);
    active = 0;
    list.textContent = '';
    if (!shown.length) {
      const li = document.createElement('li');
      li.className = 'palette-empty';
      li.textContent = `No commands match “${q}”.`;
      list.append(li);
      input.setAttribute('aria-activedescendant', '');
      return;
    }
    shown.forEach((c, i) => {
      const li = document.createElement('li');
      li.id = `pal-opt-${i}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === active));
      const name = document.createElement('span');
      name.textContent = c.label;
      const tag = document.createElement('span');
      tag.className = 'pal-tag';
      tag.textContent = c.tag;
      li.append(name, tag);
      li.addEventListener('click', () => { closePalette(); c.run(); });
      li.addEventListener('mousemove', () => setActive(i));
      list.append(li);
    });
    input.setAttribute('aria-activedescendant', 'pal-opt-0');
  };
  const setActive = (i) => {
    active = i;
    $$('li', list).forEach((li, n) => {
      li.classList.toggle('is-active', n === i);
      li.setAttribute('aria-selected', String(n === i));
    });
    const el = document.getElementById(`pal-opt-${i}`);
    if (el) { input.setAttribute('aria-activedescendant', el.id); el.scrollIntoView({ block: 'nearest' }); }
  };
  const openPalette = () => {
    lastFocus = document.activeElement;
    scrim.hidden = false;
    document.body.style.overflow = 'hidden';
    input.value = '';
    renderPalette();
    setActive(0);
    input.focus();
  };
  const closePalette = () => {
    if (scrim.hidden) return;
    scrim.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };
  $('#paletteBtn').addEventListener('click', openPalette);
  $('#heroPaletteBtn').addEventListener('click', openPalette);
  scrim.addEventListener('mousedown', (e) => { if (e.target === scrim) closePalette(); });
  input.addEventListener('input', () => { renderPalette(); setActive(0); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!shown.length) return;
      setActive((active + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const c = shown[active];
      if (c) { closePalette(); c.run(); }
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  });
  addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      scrim.hidden ? openPalette() : closePalette();
    } else if (e.key === 'Escape') {
      closePalette();
    }
  });

  /* ---------- resize ---------- */
  let resizeRaf = 0;
  addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => { sizeField(); sizeRain(); updateRain(); });
  });
  readFieldColors();
  sizeField();
  sizeRain();
})();