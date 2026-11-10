#!/usr/bin/env bash
# Freeze a release at design.jonesco.com/v/<version>/ (system.css, patterns.css, fonts/, logos/), copied from its git tag.
# Usage: ./scripts/publish-version.sh v3.3.1   (or --all for every tag). Never edit a v/ folder by hand; a release is fixed once published.
set -euo pipefail
cd "$(dirname "$0")/.."

publish() {
  local tag="$1" dir="v/${1#v}"
  [ -e "$dir" ] && { echo "  $dir exists, skipped"; return; }
  mkdir -p "$dir"
  git archive "$tag" -- system.css patterns.css fonts logos 2>/dev/null | tar -x -C "$dir" \
    || git archive "$tag" -- system.css patterns.css fonts | tar -x -C "$dir"
  echo "  $dir"
}

if [ "${1:-}" = "--all" ]; then
  for t in $(git tag --list 'v*'); do publish "$t"; done
else
  publish "${1:?usage: publish-version.sh <tag> | --all}"
fi
