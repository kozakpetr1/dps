#!/usr/bin/env python3
"""Zapíše do course.js u kapitoly: status 'ready', lead, summary, minutes.
   python3 tools/apply-meta.py <kurz-slug> meta.json   (meta.json = pole {slug, lead, summary, minutes})"""
import sys, json, re
from pathlib import Path
course, meta = sys.argv[1], json.load(open(sys.argv[2], encoding='utf-8'))
p = Path(__file__).resolve().parent.parent / 'courses' / course / 'course.js'
s = p.read_text(encoding='utf-8')
def js(x): return "'" + x.replace('\\', '\\\\').replace("'", "\\'") + "'"
for m in meta:
    slug = m['slug']
    i = s.index("slug: '" + slug + "'")
    start = s.rfind('{', 0, i)
    # konec objektu kapitoly: odpovídající }
    depth = 0; j = start
    while True:
        c = s[j]
        if c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: break
        elif c == "'":
            j += 1
            while s[j] != "'":
                if s[j] == '\\': j += 1
                j += 1
        j += 1
    block = s[start:j + 1]
    title = re.search(r"title: ('(?:[^'\\]|\\.)*')", block).group(1)
    hours = re.search(r"hours: ([^,]+),", block).group(1)
    note = re.search(r"note: ('(?:[^'\\]|\\.)*')", block)
    new = "{\n      slug: %s, title: %s, hours: %s,%s minutes: %d, status: 'ready',\n      lead: %s,\n      summary: %s\n    }" % (
        js(slug), title, hours, (' note: ' + note.group(1) + ',') if note else '', m['minutes'], js(m['lead']), js(m['summary']))
    s = s[:start] + new + s[j + 1:]
p.write_text(s, encoding='utf-8')
print('OK', len(meta), 'kapitol')
