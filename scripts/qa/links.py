#!/usr/bin/env python3
"""Linkcheck ueber dist/: jeder interne href/src muss auf eine gebaute Datei zeigen (build.format 'file': /x -> x.html),
   Anker (#id) muessen auf der Zielseite existieren. Aufruf nach `bun run build`: python3 scripts/qa/links.py"""
import re, os, glob, urllib.parse, sys
root = sys.argv[1] if len(sys.argv) > 1 else 'dist'
files = glob.glob(root + '/**/*.html', recursive=True)
exists = set()
for dp, dn, fn in os.walk(root):
    for f in fn: exists.add(os.path.relpath(os.path.join(dp, f), root))
def target_file(path):
    p = urllib.parse.unquote(path.split('#')[0].split('?')[0])
    if p in ('', '/'): return 'index.html'
    p = p.lstrip('/')
    for c in (p, p + '.html', p.rstrip('/') + '.html', p.rstrip('/') + '/index.html'):
        if c in exists: return c
    return None
bad, anchors_bad, n = {}, {}, 0
for f in files:
    s = open(f, encoding='utf-8', errors='ignore').read()
    ids = set(re.findall(r'\sid="([^"]+)"', s))
    for m in re.finditer(r'(?:href|src)="([^"]+)"', s):
        u = m.group(1); n += 1
        if u.startswith('#'):
            if u != '#' and u[1:] not in ids: anchors_bad.setdefault(u, []).append(f)
            continue
        if not u.startswith('/') or u.startswith('//'): continue
        t = target_file(u)
        if t is None: bad.setdefault(u, []).append(f); continue
        if '#' in u and t.endswith('.html'):
            frag = u.split('#', 1)[1]
            if frag and not re.search(r'\sid="%s"' % re.escape(frag), open(os.path.join(root, t), encoding='utf-8', errors='ignore').read()):
                anchors_bad.setdefault(u, []).append(f)
print(f'{len(files)} Dateien, {n} Verweise geprueft')
print('fehlende Ziele:', len(bad))
for u, fs in sorted(bad.items())[:40]: print(' ', u, '<-', len(fs), 'x, z.B.', fs[0])
print('fehlende Anker:', len(anchors_bad))
for u, fs in sorted(anchors_bad.items())[:20]: print(' ', u, '<-', len(fs), 'x, z.B.', fs[0])
sys.exit(1 if bad or anchors_bad else 0)
