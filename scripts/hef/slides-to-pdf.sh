#!/usr/bin/env bash
# Convert HEF module slides (PPTX) to PDF for the Academy.
#
# Requires LibreOffice (`soffice`).
# Usage:
#   scripts/hef/slides-to-pdf.sh /path/to/hef [public/hef/slides-pdf]
set -euo pipefail

SOURCE="${1:-/tmp/hef}"
OUT="${2:-public/hef/slides-pdf}"

if ! command -v soffice >/dev/null 2>&1; then
  echo "LibreOffice (soffice) is required." >&2
  exit 1
fi

mkdir -p "$OUT"
for dir in "$SOURCE"/0?-*/HEF-*; do
  [ -d "$dir" ] || continue
  code="$(basename "$dir")"
  mkdir -p "$OUT/$code"
  echo "== $code =="
  soffice --headless -env:UserInstallation="file:///tmp/lo-hef-$code" \
    --convert-to pdf --outdir "$OUT/$code" "$dir"/08-Slides/*.pptx >/dev/null
  echo "$code: $(find "$OUT/$code" -name '*.pdf' | wc -l) PDF"
done

echo "DONE $(find "$OUT" -name '*.pdf' | wc -l) PDF"
