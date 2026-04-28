#!/bin/bash
set -e
cd "$(dirname "$0")"
git add -A
git commit -m "${1:-update site}" 2>/dev/null || echo "Nothing new to commit."
git push origin main
echo ""
echo "Live at: https://amandarozansky-hue.github.io/ai-prompt-toolkit/"
