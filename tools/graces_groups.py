"""Parse the wiki's Sites of Grace list into {name: (region_heading, subarea_heading)} for base-game areas."""
import re, json, sys
src = sys.argv[1]
lines = open(src, encoding="utf-8").read().splitlines()
start = next(i for i, l in enumerate(lines) if l.startswith("## Roundtable Hold"))
out = []
region = sub = None
for l in lines[start:]:
    m = re.match(r"## (.+?)(?: \((?:[A-Za-z\- ]+)(?: Sites?)?\))?\s*$", l)
    if l.startswith("## "):
        h = re.sub(r"\s*\(.*\)\s*$", "", l[3:]).strip()
        is_region = bool(re.search(r"\((?:[A-Za-z\-]+(?:-[A-Za-z]+)?)(?: Sites?)?\)$", l)) and not h.startswith("Main ")
        # Top-level regions in this page are the ones whose next heading is a 'Main ...' sub-list, or single-level lists
        out.append(("H", h, l))
        continue
    m = re.match(r"- (.+?)\s*(?:Map Link.*|\[\[\[Map Link\]\]\]|Main Gate)?$", l)
    if m and out:
        name = m.group(1).replace("<br>", "").strip()
        out.append(("G", name, l))
json.dump(out, open("/home/claude/teremity/data/_grace_raw.json", "w"), indent=0)
print(len(out))
