#!/usr/bin/env bash
# Usage: ./add-case.sh <run-dir | entry-dir> [...]
#
# Copies an agent-arena qodercli entry into cases/<prompt>/:
#   work/* (minus .build/ and .DS_Store), prompt.md, shot-1440-light.png -> thumb.png
# Run metadata (meta/cmd/envelope/result/stdout/stderr) is never copied.
# A run dir picks its qodercli__* entry; _superseded/ is ignored.
# Re-adding a case replaces it. Rebuilds index.html and README.md afterwards.
set -euo pipefail

root="$(cd "$(dirname "$0")" && pwd)"

add() {
  local src="${1%/}" entry run name dest
  if [[ -f "$src/meta.json" ]]; then
    entry="$src"
  else
    entry="$(find "$src" -mindepth 1 -maxdepth 1 -type d -name 'qodercli__*' | sort | tail -1)"
    [[ -n "$entry" ]] || { echo "no qodercli__* entry in $src" >&2; return 1; }
  fi
  [[ -f "$entry/work/index.html" ]] || { echo "no work/index.html in $entry" >&2; return 1; }

  run="$(basename "$(dirname "$entry")")"
  name="${run%--[0-9]*-[0-9]*}"
  dest="$root/cases/$name"

  rm -rf "$dest"
  mkdir -p "$dest"
  rsync -a --exclude '.build' --exclude '.DS_Store' "$entry/work/" "$dest/"
  cp "$entry/prompt.md" "$dest/prompt.md"
  [[ -f "$entry/shot-1440-light.png" ]] && cp "$entry/shot-1440-light.png" "$dest/thumb.png"
  echo "added $name  <-  $entry"
}

for arg in "$@"; do add "$arg"; done
python3 "$root/build-index.py"
