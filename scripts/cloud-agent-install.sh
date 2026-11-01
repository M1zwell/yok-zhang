#!/usr/bin/env bash
# Cloud Agent bootstrap for the garden. Idempotent: safe to run on a cached tree.
set -euo pipefail

cd "$(dirname "$0")/.."

export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
export PATH="$BUN_INSTALL/bin:$PATH"

if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash
fi

bun --version
bun install --frozen-lockfile

# `prebuild`/`predev` regenerate this too; run once so a fresh agent has the feed.
node scripts/build-rss.mjs
