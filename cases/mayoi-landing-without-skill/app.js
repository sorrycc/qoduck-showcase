'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const STORAGE_KEY = 'mayoi-landing-preview-v1';

const seedFiles = {
  'main.go': `package main

import (
    "fmt"
    "os"
)

func main() {
    name := "Mayoi"
    if len(os.Args) > 1 {
        name = os.Args[1]
    }
    fmt.Printf("Hello, %s.\\n", name)
}
`,
  'wrap.go': `package main

// wraps reports whether an editor wraps its lines.
func (a *app) wraps(d *editor) bool {
    if d.wrap != nil && d.wrapGen == a.settings.WrapGen {
        return *d.wrap
    }
    return a.settings.WordWrap
}

func (a *app) toggleWordWrap() {
    s := a.settings
    s.WordWrap = !s.WordWrap
    s.WrapGen++
    s.Changed()
    a.invalidate()
}
`,
  'editor.go': `package main

type editor struct {
    wrap    *bool
    wrapGen int
    caret   position
}

type position struct {
    line int
    col  int
}

func (d *editor) invalidate() {
    d.wrap = nil
}
`,
  'README.md': `# hello-mayoi

A tiny project for trying the Mayoi preview.

## Things to try
- Press \`Cmd/Ctrl+P\` and type \`wrap\`
- Split the editor and change a line
- Switch the theme to **Purple Gold**
- Toggle the Markdown preview

\`\`\`go
fmt.Println("Small app. Full workbench.")
\`\`\`

The real Mayoi renders this beside the source with Mermaid and LaTeX support.
`,
  'theme.json': `{
  "theme": "purple-gold",
  "fontSize": 13,
  "wordWrap": false,
  "vim": true
}
`
};

function defaultState() {
  const wide = typeof window === 'undefined' || window.innerWidth > 760;
  return {
    files: { ...seedFiles },
    theme: 'dark',
    size: 13,
    wrap: true,
    sidebar: wide,
    split: wide,
    terminal: false,
    markdown: false,
    focused: 0,
    columns: [
      { open: ['main.go', 'README.md'], active: 'main.go' },
      { open: ['wrap.go'], active: 'wrap.go' }
    ]
  };
}

function loadState() {
  const base = defaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object') return base;
    const files = { ...seedFiles };
    if (saved.files && typeof saved.files === 'object') {
      for (const name of Object.keys(seedFiles)) {
        if (typeof saved.files[name] === 'string') files[name] = saved.files[name];
      }
    }
    const columns = base.columns.map((column, index) => {
      const candidate = saved.columns?.[index];
      if (!candidate || !Array.isArray(candidate.open)) return column;
      const open = candidate.open.filter(name => typeof name === 'string' && name in files);
      const active = typeof candidate.active === 'string' && files[candidate.active] !== undefined ? candidate.active : (open[0] || column.active);
      return { open: open.length ? open : [active], active };
    });
    return {
      ...base,
      files,
      columns,
      theme: ['dark', 'light', 'purple-gold'].includes(saved.theme) ? saved.theme : base.theme,
      size: Number.isInteger(saved.size) && saved.size >= 11 && saved.size <= 18 ? saved.size : base.size,
      wrap: typeof saved.wrap === 'boolean' ? saved.wrap : base.wrap,
      sidebar: typeof saved.sidebar === 'boolean' ? saved.sidebar : base.sidebar,
      split: typeof saved.split === 'boolean' ? saved.split : base.split,
      terminal: Boolean(saved.terminal),
      markdown: Boolean(saved.markdown),
      focused: saved.focused === 1 ? 1 : 0
    };
  } catch {
    return base;
  }
}

let state = loadState();
let saveTimer = 0;
function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage is optional */ }
  }, 250);
}

const workbench = $('#workbench');
const fileTree = $('#file-tree');
const palette = $('#palette');
const paletteInput = $('#palette-input');
const paletteResults = $('#palette-results');
const toast = $('#toast');
const inputs = $$('[data-input]');
const highlights = $$('[data-highlight] code');
const gutters = $$('[data-gutter]');
const previews = $$('[data-preview]');
const codeWraps = $$('[data-code-wrap]');
const tabBars = $$('[data-tabs]');
let paletteTrigger = null;
let paletteItems = [];
let paletteIndex = 0;
let toastTimer = 0;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function languageFor(name) {
  if (name.endsWith('.go')) return 'Go';
  if (name.endsWith('.md')) return 'Markdown';
  if (name.endsWith('.json')) return 'JSON';
  return 'Text';
}

function isDirty(name) {
  return state.files[name] !== seedFiles[name];
}

function highlightCode(code, name) {
  if (name.endsWith('.md')) {
    return code.split('\n').map(line => {
      const safe = escapeHtml(line);
      if (/^#{1,6}\s/.test(line)) return `<span class="tok-head">${safe}</span>`;
      return safe.replace(/`([^`]+)`/g, '<span class="tok-str">`$1`</span>');
    }).join('\n');
  }
  const pattern = /(\/\/[^\n]*)|("(?:\\.|[^"\\])*"|`[^`]*`)|\b(package|import|func|return|if|else|for|range|type|struct|var|const|true|false|nil|switch|case|default|go|defer|map|chan|select)\b|\b(string|bool|int|int64|float32|float64|error|byte|rune|any)\b|\b([A-Za-z_][A-Za-z0-9_]*)(?=\s*\()|\b(\d+(?:\.\d+)?)\b/g;
  const classes = ['tok-com', 'tok-str', 'tok-key', 'tok-type', 'tok-fn', 'tok-num'];
  let output = '';
  let last = 0;
  for (const match of code.matchAll(pattern)) {
    output += escapeHtml(code.slice(last, match.index));
    const group = match.slice(1).findIndex(part => part !== undefined);
    output += `<span class="${classes[group]}">${escapeHtml(match[0])}</span>`;
    last = match.index + match[0].length;
  }
  return output + escapeHtml(code.slice(last));
}

function inlineMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function renderMarkdown(source) {
  const lines = escapeHtml(source).split('\n');
  const html = [];
  let paragraph = [];
  let list = [];
  let code = null;
  const flushParagraph = () => { if (paragraph.length) { html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`); paragraph = []; } };
  const flushList = () => { if (list.length) { html.push(`<ul>${list.map(item => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`); list = []; } };
  for (const line of lines) {
    if (line.startsWith('```')) {
      if (code === null) { flushParagraph(); flushList(); code = []; }
      else { html.push(`<pre><code>${code.join('\n')}</code></pre>`); code = null; }
      continue;
    }
    if (code !== null) { code.push(line); continue; }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) { flushParagraph(); flushList(); const level = Math.min(heading[1].length, 3); html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); continue; }
    const item = line.match(/^[-*]\s+(.*)$/);
    if (item) { flushParagraph(); list.push(item[1]); continue; }
    if (!line.trim()) { flushParagraph(); flushList(); continue; }
    flushList();
    paragraph.push(line.trim());
  }
  if (code !== null) html.push(`<pre><code>${code.join('\n')}</code></pre>`);
  flushParagraph();
  flushList();
  return html.join('\n');
}

function syncScroll(pane) {
  const input = inputs[pane];
  highlights[pane].parentElement.scrollTop = input.scrollTop;
  highlights[pane].parentElement.scrollLeft = input.scrollLeft;
  gutters[pane].scrollTop = input.scrollTop;
}

function paintPane(pane) {
  const column = state.columns[pane];
  const name = column.active;
  const value = state.files[name];
  highlights[pane].innerHTML = highlightCode(value, name) + (value.endsWith('\n') ? '\n' : '');
  gutters[pane].innerHTML = value.split('\n').map((_, index) => `<div>${index + 1}</div>`).join('');
  const showPreview = state.markdown && name.endsWith('.md');
  codeWraps[pane].hidden = false;
  previews[pane].hidden = !showPreview;
  if (showPreview) previews[pane].innerHTML = renderMarkdown(value);
  syncScroll(pane);
}

function syncInput(pane) {
  const input = inputs[pane];
  const name = state.columns[pane].active;
  if (input.value !== state.files[name]) input.value = state.files[name];
  input.wrap = state.wrap ? 'soft' : 'off';
  input.setAttribute('aria-label', `Edit ${name} in column ${pane + 1}`);
}

function renderTree() {
  const active = state.columns[state.focused].active;
  fileTree.innerHTML = Object.keys(state.files).map(name => `
    <li><button type="button" data-file="${escapeHtml(name)}" class="${name === active ? 'active' : ''}" ${name === active ? 'aria-current="true"' : ''}>
      <svg class="icon" aria-hidden="true"><use href="#i-files"></use></svg>
      <span class="file-name">${escapeHtml(name)}</span>
      ${isDirty(name) ? '<span class="dirty" aria-hidden="true">●</span>' : ''}
    </button></li>`).join('');
  $('#file-count').textContent = `${Object.keys(state.files).length} files`;
}

function renderTabs(pane) {
  const column = state.columns[pane];
  tabBars[pane].innerHTML = column.open.map(name => `
    <button class="tab" role="tab" type="button" data-file="${escapeHtml(name)}" aria-selected="${name === column.active}" tabindex="${name === column.active ? 0 : -1}">
      <span>${escapeHtml(name)}</span>${isDirty(name) ? '<span class="dirty" aria-hidden="true">●</span>' : ''}
    </button>`).join('');
}

function updateStatus() {
  const pane = state.focused;
  const input = inputs[pane];
  const name = state.columns[pane].active;
  const before = input.value.slice(0, input.selectionStart).split('\n');
  $('[data-status-file]').textContent = name;
  $('[data-status-lang]').textContent = languageFor(name);
  $('[data-status-pos]').textContent = `Ln ${before.length}, Col ${before[before.length - 1].length + 1}`;
}

function renderAll() {
  workbench.dataset.theme = state.theme;
  workbench.classList.toggle('no-sidebar', !state.sidebar);
  workbench.classList.toggle('no-split', !state.split);
  workbench.classList.toggle('wrap', state.wrap);
  workbench.style.setProperty('--code-size', `${state.size}px`);
  $('#terminal').hidden = !state.terminal;
  $('#control-theme').value = state.theme;
  $('#control-size').value = state.size;
  $('#size-output').value = state.size;
  $('#control-wrap').checked = state.wrap;
  $('#control-sidebar').checked = state.sidebar;
  $('#control-split').checked = state.split;
  $('#control-terminal').checked = state.terminal;
  $('#control-markdown').checked = state.markdown;
  $('#rail-files').setAttribute('aria-pressed', String(state.sidebar));
  $('#rail-split').setAttribute('aria-pressed', String(state.split));
  $('#rail-terminal').setAttribute('aria-pressed', String(state.terminal));
  if (!state.split) state.focused = 0;
  renderTree();
  for (const pane of [0, 1]) {
    renderTabs(pane);
    syncInput(pane);
    paintPane(pane);
    $(`[data-pane="${pane}"]`).classList.toggle('focused', pane === state.focused);
  }
  updateStatus();
}

function openFile(name, pane = state.focused) {
  if (!state.split) pane = 0;
  const column = state.columns[pane];
  if (!column.open.includes(name)) column.open.push(name);
  column.active = name;
  state.focused = pane;
  renderAll();
  saveState();
  requestAnimationFrame(() => inputs[pane].focus({ preventScroll: true }));
}

function selectTab(pane, name, focusInput = true) {
  state.columns[pane].active = name;
  state.focused = pane;
  renderAll();
  saveState();
  if (focusInput) requestAnimationFrame(() => inputs[pane].focus({ preventScroll: true }));
  else requestAnimationFrame(() => $(`[data-tabs="${pane}"] [data-file="${CSS.escape(name)}"]`)?.focus());
}

function goToLine(line) {
  const pane = state.focused;
  const input = inputs[pane];
  const lines = input.value.split('\n');
  const target = Math.max(1, Math.min(line, lines.length));
  const index = lines.slice(0, target - 1).reduce((total, text) => total + text.length + 1, 0);
  input.focus({ preventScroll: true });
  input.setSelectionRange(index, index);
  const lineHeight = parseFloat(getComputedStyle(input).fontSize) * 1.55;
  input.scrollTop = Math.max(0, (target - 1) * lineHeight - input.clientHeight / 2);
  syncScroll(pane);
  updateStatus();
}

function fuzzyScore(text, query) {
  if (!query) return 0;
  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();
  let score = 0;
  let last = -1;
  for (const char of needle) {
    const index = haystack.indexOf(char, last + 1);
    if (index === -1) return -1;
    score += 1 + (index === last + 1 ? 2 : 0) + (index === 0 ? 3 : 0);
    last = index;
  }
  return score;
}

function activeSymbols() {
  const name = state.columns[state.focused].active;
  const symbols = [];
  state.files[name].split('\n').forEach((line, index) => {
    const match = line.match(/^\s*(?:func\s+(?:\([^)]*\)\s*)?([A-Za-z_][A-Za-z0-9_]*)|type\s+([A-Za-z_][A-Za-z0-9_]*)|#{1,3}\s+(.+))/);
    if (match) symbols.push({ label: match[1] || match[2] || match[3], line: index + 1 });
  });
  return symbols;
}

const commands = [
  { label: 'Toggle split view', run: () => { state.split = !state.split; renderAll(); saveState(); } },
  { label: 'Toggle terminal', run: () => { state.terminal = !state.terminal; renderAll(); saveState(); } },
  { label: 'Toggle word wrap', run: () => { state.wrap = !state.wrap; renderAll(); saveState(); } },
  { label: 'Toggle explorer', run: () => { state.sidebar = !state.sidebar; renderAll(); saveState(); } },
  { label: 'Toggle Markdown preview', run: () => { state.markdown = !state.markdown; renderAll(); saveState(); } },
  { label: 'Theme: Mayoi dark', run: () => { state.theme = 'dark'; renderAll(); saveState(); } },
  { label: 'Theme: Mayoi light', run: () => { state.theme = 'light'; renderAll(); saveState(); } },
  { label: 'Theme: Purple Gold', run: () => { state.theme = 'purple-gold'; renderAll(); saveState(); } },
  { label: 'Reset preview', run: resetPreview },
  { label: 'Export current file', run: exportCurrentFile }
];

function buildPaletteItems(query) {
  if (query.startsWith('>')) {
    const rest = query.slice(1).trim();
    return commands
      .map(command => ({ ...command, kind: 'command', score: fuzzyScore(command.label, rest) }))
      .filter(item => item.score >= 0)
      .sort((a, b) => b.score - a.score);
  }
  if (query.startsWith(':')) {
    const line = Number.parseInt(query.slice(1), 10);
    return Number.isInteger(line) && line > 0 ? [{ label: `Go to line ${line}`, kind: 'line', run: () => goToLine(line) }] : [];
  }
  if (query.startsWith('@')) {
    const rest = query.slice(1).trim();
    return activeSymbols()
      .map(symbol => ({ ...symbol, kind: 'symbol', score: fuzzyScore(symbol.label, rest) }))
      .filter(item => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map(item => ({ label: item.label, kind: `line ${item.line}`, run: () => goToLine(item.line) }));
  }
  return Object.keys(state.files)
    .map(name => ({ label: name, kind: languageFor(name), score: fuzzyScore(name, query.trim()), run: () => openFile(name) }))
    .filter(item => item.score >= 0)
    .sort((a, b) => b.score - a.score);
}

function renderPaletteResults() {
  paletteItems = buildPaletteItems(paletteInput.value);
  paletteIndex = Math.min(paletteIndex, Math.max(0, paletteItems.length - 1));
  if (!paletteItems.length) {
    paletteResults.innerHTML = '<li class="result-empty">No matches. Try a file name, :42, @, or &gt;.</li>';
    paletteInput.removeAttribute('aria-activedescendant');
    return;
  }
  paletteResults.innerHTML = paletteItems.map((item, index) => `
    <li role="presentation"><button type="button" role="option" id="palette-opt-${index}" data-index="${index}" aria-selected="${index === paletteIndex}" class="${index === paletteIndex ? 'selected' : ''}">
      <span>${escapeHtml(item.label)}</span><span class="result-kind">${escapeHtml(item.kind)}</span>
    </button></li>`).join('');
  paletteInput.setAttribute('aria-activedescendant', `palette-opt-${paletteIndex}`);
}

function openPalette(trigger, initial = '') {
  paletteTrigger = trigger || document.activeElement;
  palette.hidden = false;
  paletteInput.value = initial;
  paletteIndex = 0;
  paletteInput.setAttribute('aria-expanded', 'true');
  renderPaletteResults();
  paletteInput.focus({ preventScroll: true });
}

function closePalette() {
  palette.hidden = true;
  paletteInput.setAttribute('aria-expanded', 'false');
  paletteTrigger?.focus?.({ preventScroll: true });
}

function runPaletteItem(index) {
  const item = paletteItems[index];
  if (!item) return;
  closePalette();
  item.run();
}

function resetPreview() {
  state = defaultState();
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* storage is optional */ }
  renderAll();
  showToast('Preview reset to the sample project.');
}

function exportCurrentFile() {
  const name = state.columns[state.focused].active;
  const blob = new Blob([state.files[name]], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(`Exported ${name}`);
}

inputs.forEach((input, pane) => {
  input.addEventListener('input', () => {
    const name = state.columns[pane].active;
    state.files[name] = input.value;
    paintPane(pane);
    const other = pane === 0 ? 1 : 0;
    if (state.split && state.columns[other].active === name) {
      const otherInput = inputs[other];
      const start = Math.min(otherInput.selectionStart, input.value.length);
      const end = Math.min(otherInput.selectionEnd, input.value.length);
      otherInput.value = input.value;
      otherInput.setSelectionRange(start, end);
      paintPane(other);
    }
    renderTree();
    renderTabs(pane);
    if (state.split) renderTabs(other);
    updateStatus();
    saveState();
  });
  input.addEventListener('scroll', () => syncScroll(pane));
  input.addEventListener('keyup', updateStatus);
  input.addEventListener('click', updateStatus);
  input.addEventListener('focus', () => {
    state.focused = pane;
    $$('[data-pane]').forEach(section => section.classList.toggle('focused', Number(section.dataset.pane) === pane));
    renderTree();
    updateStatus();
  });
});

fileTree.addEventListener('click', event => {
  const button = event.target.closest('[data-file]');
  if (button) openFile(button.dataset.file);
});

tabBars.forEach((bar, pane) => {
  bar.addEventListener('click', event => {
    const button = event.target.closest('[data-file]');
    if (button) selectTab(pane, button.dataset.file);
  });
  bar.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const buttons = $$('[data-file]', bar);
    const current = buttons.findIndex(button => button.getAttribute('aria-selected') === 'true');
    let next = current;
    if (event.key === 'ArrowRight') next = (current + 1) % buttons.length;
    if (event.key === 'ArrowLeft') next = (current - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    selectTab(pane, buttons[next].dataset.file, false);
  });
});

$('#rail-files').addEventListener('click', () => { state.sidebar = !state.sidebar; renderAll(); saveState(); });
$('#rail-search').addEventListener('click', event => openPalette(event.currentTarget));
$('#rail-split').addEventListener('click', () => { state.split = !state.split; renderAll(); saveState(); });
$('#rail-terminal').addEventListener('click', () => { state.terminal = !state.terminal; renderAll(); saveState(); });
$('#try-demo').addEventListener('click', event => {
  workbench.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  openPalette(event.currentTarget);
});

$('#control-theme').addEventListener('change', event => { state.theme = event.target.value; renderAll(); saveState(); });
$('#control-size').addEventListener('input', event => { state.size = Number(event.target.value); renderAll(); saveState(); });
$('#control-wrap').addEventListener('change', event => { state.wrap = event.target.checked; renderAll(); saveState(); });
$('#control-sidebar').addEventListener('change', event => { state.sidebar = event.target.checked; renderAll(); saveState(); });
$('#control-split').addEventListener('change', event => { state.split = event.target.checked; renderAll(); saveState(); });
$('#control-terminal').addEventListener('change', event => { state.terminal = event.target.checked; renderAll(); saveState(); });
$('#control-markdown').addEventListener('change', event => {
  state.markdown = event.target.checked;
  renderAll();
  saveState();
  if (state.markdown && !state.columns[state.focused].active.endsWith('.md')) showToast('Open README.md to see the Markdown preview.');
});
$('#control-reset').addEventListener('click', resetPreview);
$('#control-export').addEventListener('click', exportCurrentFile);

paletteInput.addEventListener('input', () => { paletteIndex = 0; renderPaletteResults(); });
paletteInput.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') { event.preventDefault(); paletteIndex = (paletteIndex + 1) % Math.max(1, paletteItems.length); renderPaletteResults(); }
  if (event.key === 'ArrowUp') { event.preventDefault(); paletteIndex = (paletteIndex - 1 + paletteItems.length) % Math.max(1, paletteItems.length); renderPaletteResults(); }
  if (event.key === 'Enter') { event.preventDefault(); runPaletteItem(paletteIndex); }
  if (event.key === 'Escape') { event.preventDefault(); closePalette(); }
});
paletteResults.addEventListener('click', event => {
  const button = event.target.closest('[data-index]');
  if (button) runPaletteItem(Number(button.dataset.index));
});
palette.addEventListener('mousedown', event => { if (event.target === palette) closePalette(); });
palette.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const focusable = [paletteInput, ...$$('button', paletteResults)];
  const index = focusable.indexOf(document.activeElement);
  if (event.shiftKey && index <= 0) { event.preventDefault(); focusable[focusable.length - 1]?.focus(); }
  else if (!event.shiftKey && index === focusable.length - 1) { event.preventDefault(); paletteInput.focus(); }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !palette.hidden) { closePalette(); return; }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'p' && workbench.contains(document.activeElement)) {
    event.preventDefault();
    openPalette(document.activeElement, event.shiftKey ? '>' : '');
  }
});

const tourData = {
  columns: { src: 'assets/columns.png', alt: 'Two columns of Go source in Mayoi', caption: 'Split the editor side by side and drag tabs between columns.', width: 1600, height: 857 },
  'command-palette': { src: 'assets/command-palette.png', alt: 'Mayoi command palette listing commands and shortcuts', caption: 'Every command by name, with its shortcut. Fuzzy file open, go to line, and go to symbol share the same box.', width: 1600, height: 1000 },
  'markdown-preview': { src: 'assets/markdown-preview.png', alt: 'Markdown source beside its live preview in Mayoi', caption: 'Markdown renders live beside the source, including Mermaid diagrams and LaTeX formulas.', width: 1600, height: 1000 },
  'terminal-tab': { src: 'assets/terminal-tab.png', alt: 'A Ghostty-based terminal in a Mayoi tab beside code', caption: "Ghostty's emulator in the bottom panel, at the side, or in a tab like any other file.", width: 1600, height: 1000 }
};

function selectTour(key) {
  const data = tourData[key];
  if (!data) return;
  $$('.tour-tab').forEach(tab => {
    const selected = tab.dataset.tour === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) $('#tour-panel').setAttribute('aria-labelledby', tab.id);
  });
  const image = $('#tour-image');
  image.src = data.src;
  image.alt = data.alt;
  image.width = data.width;
  image.height = data.height;
  $('#tour-caption').textContent = data.caption;
}

$$('.tour-tab').forEach(tab => {
  tab.addEventListener('click', () => selectTour(tab.dataset.tour));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = $$('.tour-tab');
    const index = tabs.indexOf(tab);
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    tabs[next].focus();
    selectTour(tabs[next].dataset.tour);
  });
});

const installData = {
  macos: {
    label: 'Homebrew · macOS 13+',
    code: 'brew tap --custom-remote sorrycc/mayoi https://github.com/sorrycc/Mayoi.git\nbrew trust sorrycc/mayoi\nbrew install --cask mayoi',
    note: 'Recent Homebrew needs <code>brew trust</code> once. Older Homebrew can skip that line.',
    alt: 'Or download the DMG',
    href: 'https://github.com/sorrycc/Mayoi/releases/latest'
  },
  linux: {
    label: 'Shell installer · GTK 3',
    code: 'curl -fsSL https://github.com/sorrycc/Mayoi/releases/latest/download/install.sh | sh',
    note: 'Adds Mayoi to <code>~/.local</code>, with the <code>mayoi</code> command and an applications menu entry. Requires GTK 3, such as Ubuntu 22.04 or later.',
    alt: 'Read the Linux notes',
    href: 'https://github.com/sorrycc/Mayoi#linux'
  },
  windows: {
    label: 'Open the releases page',
    code: 'explorer https://github.com/sorrycc/Mayoi/releases/latest',
    note: 'Download the installer for your architecture and run it. Both Intel and ARM builds are on Releases.',
    alt: 'Go to Releases',
    href: 'https://github.com/sorrycc/Mayoi/releases/latest'
  }
};
let currentOS = 'macos';

function selectOS(os) {
  const data = installData[os];
  if (!data) return;
  currentOS = os;
  $$('.os-tab').forEach(tab => {
    const selected = tab.dataset.os === os;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) $('#os-panel').setAttribute('aria-labelledby', tab.id);
  });
  $('#install-label').textContent = data.label;
  $('#install-code').textContent = data.code;
  $('#install-note').innerHTML = data.note;
  const alt = $('#install-alt');
  alt.href = data.href;
  alt.childNodes[0].textContent = `${data.alt} `;
}

$$('.os-tab').forEach(tab => {
  tab.addEventListener('click', () => selectOS(tab.dataset.os));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = $$('.os-tab');
    const index = tabs.indexOf(tab);
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    tabs[next].focus();
    selectOS(tabs[next].dataset.os);
  });
});

$('#copy-install').addEventListener('click', async event => {
  const button = event.currentTarget;
  const text = installData[currentOS].code;
  let copied = false;
  try {
    await navigator.clipboard.writeText(text);
    copied = true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    copied = document.execCommand('copy');
    area.remove();
  }
  if (copied) {
    button.innerHTML = '<svg class="icon"><use href="#i-check"></use></svg><span>Copied</span>';
    showToast('Install commands copied.');
    setTimeout(() => { button.innerHTML = '<svg class="icon"><use href="#i-copy"></use></svg><span>Copy</span>'; }, 1800);
  } else {
    showToast('Copy failed. Select the commands manually.');
  }
});

const header = $('.site-header');
const navToggle = $('.nav-toggle');
const navLinks = $('#nav-links');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  $('use', navToggle).setAttribute('href', open ? '#i-close' : '#i-menu');
});
$$('[data-nav]').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  $('use', navToggle).setAttribute('href', '#i-menu');
}));

const sections = ['editor', 'why', 'tour', 'install'].map(id => document.getElementById(id));
const navObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    document.body.dataset.section = entry.target.id;
    $$('[data-nav]').forEach(link => link.setAttribute('aria-current', String(link.getAttribute('href') === `#${entry.target.id}`)));
  }
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => navObserver.observe(section));

const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.12 });
$$('[data-reveal]').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
  if (reducedMotion) element.classList.add('is-visible');
  else revealObserver.observe(element);
});

const pixelField = $('#pixel-field');
let seed = 7;
const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
for (let index = 0; index < 26; index++) {
  const pixel = document.createElement('span');
  pixel.className = `pixel ${index % 3 === 0 ? 'violet' : index % 5 === 0 ? 'cyan' : ''}`;
  pixel.style.left = `${random() * 100}%`;
  pixel.style.top = `${random() * 100}%`;
  pixel.style.animationDelay = `${random() * -12}s`;
  pixel.style.animationDuration = `${10 + random() * 8}s`;
  pixelField.append(pixel);
}

let scrollTick = false;
function onScroll() {
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    header.classList.toggle('scrolled', scrollY > 8);
    if (!reducedMotion) pixelField.style.transform = `translateY(${scrollY * -0.04}px)`;
    scrollTick = false;
  });
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

$('#back-to-top').addEventListener('click', () => scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

renderAll();
selectOS('macos');