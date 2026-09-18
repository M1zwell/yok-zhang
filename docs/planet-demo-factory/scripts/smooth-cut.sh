#!/usr/bin/env bash
# Crop browser chrome, 30fps, speed ramp. Output 1920x1080.
# Usage: smooth-cut.sh SRC DST [SPEED]
set -euo pipefail
SRC="$1"
DST="$2"
SPEED="${3:-1.45}"
PTS=$(python3 - <<PY
print(f"{1/${SPEED}:.4f}")
PY
)
mkdir -p "$(dirname "$DST")"
ffmpeg -y -i "$SRC" \
  -vf "crop=1920:1008:0:96,setpts=${PTS}*PTS,scale=1920:1080:flags=lanczos,fps=30,format=yuv420p" \
  -an -c:v libx264 -preset veryfast -crf 20 \
  "$DST"
echo "ok $DST"
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$DST"
