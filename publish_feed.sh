#!/usr/bin/env bash
#
# publish_feed.sh — commit + push the latest feed.json to GitHub Pages.
# Run by the launchd nightly agent (com.dumbdumb.publish.plist) at midnight,
# and/or manually. Only commits if feed.json actually changed.
#
# No secrets here: git uses the macOS keychain (osxkeychain) which holds the
# gh-authed token. The Discord bot token lives in rummy-bot/.env, never here.
set -euo pipefail

REPO="/Users/deejaydoss/Developer/the-dumb-dumb-wire"
cd "$REPO"

# Safety: never run if repo is dirty with unexpected files (only feed.json should change)
git add -A

if git diff --cached --quiet; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') [publish] no feed.json changes — nothing to push"
  exit 0
fi

# Commit + push
MSG="nightly feed publish $(date '+%Y-%m-%d %H:%M:%S')"
git -c user.name="DJ6062" -c user.email="$(gh api user --jq .email 2>/dev/null || echo 'noreply@github.com')" \
  commit -m "$MSG" >/dev/null
git push origin main

echo "$(date '+%Y-%m-%d %H:%M:%S') [publish] pushed: $MSG"
