#!/usr/bin/env bash
# Simple helper: stage all, commit with message, push to current branch
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 \"commit message\""
  exit 1
fi

MSG="$1"

git add -A
git commit -m "$MSG"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
git fetch origin
git rebase origin/$BRANCH || true
git push -u origin $BRANCH

echo "Pushed $BRANCH"
