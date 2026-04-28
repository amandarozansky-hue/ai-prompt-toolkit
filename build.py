#!/usr/bin/env python3
"""
Build script — generates index-bundle.html
A single self-contained file with CSS and JS inlined.
Google Fonts loads via CDN (requires internet; falls back to system-ui).

Usage:
    python3 build.py
"""
import os

base = os.path.dirname(os.path.abspath(__file__))

with open(f'{base}/index.html',  encoding='utf-8') as f: html    = f.read()
with open(f'{base}/styles.css',  encoding='utf-8') as f: css     = f.read()
with open(f'{base}/data.js',     encoding='utf-8') as f: data_js = f.read()
with open(f'{base}/app.js',      encoding='utf-8') as f: app_js  = f.read()

html = html.replace(
    '<link rel="stylesheet" href="styles.css" />',
    f'<style>\n{css}\n</style>'
)

html = html.replace(
    '<script src="data.js"></script>\n<script src="app.js"></script>',
    f'<script>\n{data_js}\n</script>\n<script>\n{app_js}\n</script>'
)

out = f'{base}/index-bundle.html'
with open(out, 'w', encoding='utf-8') as f:
    f.write(html)

size_kb = os.path.getsize(out) // 1024
print(f'Built {out} ({size_kb} KB)')
