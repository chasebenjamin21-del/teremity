"""Build data/world.json for the Teremity app from the wiki grace list + GraceMap coordinates
(GPL-3.0, https://github.com/AndreBFarias/GraceMap) + Chase's own map captures."""
import json, re, math
import numpy as np

EXT = "/tmp/claude-0/-home-claude/65dd4b5c-9d25-5701-8261-4cb234fcc35a/scratchpad/er/ext/"
REG = "/tmp/claude-0/-home-claude/65dd4b5c-9d25-5701-8261-4cb234fcc35a/scratchpad/er/reg/"
raw = json.load(open("/home/claude/teremity/data/_grace_raw.json"))

HEAD = {  # wiki heading -> (region id, subarea label or None = same as region)
 "Roundtable Hold": ("roundtable", None),
 "Limgrave": ("limgrave", None), "Main Limgrave": ("limgrave", None), "stranded graveyard": ("limgrave", "Stranded Graveyard"),
 "Stormhill": ("limgrave", "Stormhill"), "Stormveil Castle": ("limgrave", "Stormveil Castle"),
 "Weeping Peninsula": ("weeping", None),
 "Liurnia of the Lakes": ("liurnia", None), "Main Liurnia of the Lakes": ("liurnia", None), "Bellum Highway": ("liurnia", "Bellum Highway"),
 "Ruin-Strewn Precipice": ("liurnia", "Ruin-Strewn Precipice"), "Moonlight Altar": ("liurnia", "Moonlight Altar"),
 "Academy of Raya Lucaria": ("liurnia", "Raya Lucaria Academy"),
 "Altus Plateau": ("altus", None), "Main Altus Plateau": ("altus", None), "Capital Outskirts": ("altus", "Capital Outskirts"),
 "Mt. Gelmir": ("gelmir", None), "Volcano Manor": ("gelmir", "Volcano Manor"),
 "Leyndell, Royal Capital": ("leyndell", None), "Main Leyndell, Royal Capital": ("leyndell", None),
 "Subterranean Shunning-Grounds": ("leyndell", "Subterranean Shunning-Grounds"),
 "Leyndell, Ashen Capital": ("skip", None), "Stone Platform": ("skip", None),
 "Caelid": ("caelid", None), "Main Caelid": ("caelid", None), "Swamp of Aeonia": ("caelid", "Swamp of Aeonia"),
 "Greyoll's Dragonbarrow": ("caelid", "Dragonbarrow"),
 "Mountaintops of the Giants": ("mountaintops", None), "Forbidden Lands": ("mountaintops", "Forbidden Lands"),
 "Main Mountaintops of the Giants": ("mountaintops", None), "Flame Peak": ("mountaintops", "Flame Peak"),
 "Consecrated Snowfield": ("snowfield", None),
 "Miquella's Haligtree": ("haligtree", None), "Main Miquella's Haligtree": ("haligtree", None),
 "Elphael, Brace of the Haligtree": ("haligtree", "Elphael"),
 "Ainsel River": ("ainsel", None), "Main Ainsel River": ("ainsel", None), "Ainsel River Main": ("ainsel", "Nokstella"),
 "Lake of Rot": ("ainsel", "Lake of Rot"),
 "Siofra River": ("siofra", None), "Nokron, Eternal City": ("siofra", "Nokron, Eternal City"), "Main Siofra River": ("siofra", None),
 "Mohgwyn Palace": ("siofra", "Mohgwyn Palace"), "Deeproot Depths": ("siofra", "Deeproot Depths"),
 "Crumbling Farum Azula": ("farum", None),
}
wiki = {}  # norm name -> list of (region, sub, display name)
cur = None
for kind, name, line in raw:
    if kind == "H":
        cur = HEAD.get(name, ("stop", None))
        continue
    if cur is None or cur[0] in ("stop", "skip"):
        continue
    wiki.setdefault(None, None)
    def norm(s):
        s = s.lower().replace("’", "'").replace("parlor", "parlour")
        s = re.sub(r"\(.*?\)", "", s)
        return re.sub(r"[^a-z0-9]+", " ", s).strip()
    wiki.setdefault(norm(name), []).append((cur[0], cur[1], name))
wiki.pop(None, None)

def norm(s):
    s = s.lower().replace("’", "'").replace("parlor", "parlour")
    s = re.sub(r"\(.*?\)", "", s)
    return re.sub(r"[^a-z0-9]+", " ", s).strip()

gm = json.load(open(EXT + "gracemap_graces.json"))
gm = [g for g in gm if g["region"] in ("surface", "underground")]
graces = []
unmatched = []
for g in gm:
    n = norm(g["name"])
    cands = wiki.get(n, [])
    layer = "under" if g["region"] == "underground" else "surface"
    if layer == "under":
        cands = [c for c in cands if c[0] in ("siofra", "ainsel")] or cands
    else:
        cands = [c for c in cands if c[0] not in ("siofra", "ainsel")] or cands
    rec = {"name": g["name"], "x": round(g["lng"], 2), "y": round(-g["lat"], 2), "layer": layer, "flag": g.get("flag")}
    if len(cands) == 1:
        rec["region"], rec["sub"] = cands[0][0], cands[0][1]
    elif len(cands) > 1:
        rec["_cands"] = cands
    else:
        unmatched.append(g["name"])
    graces.append(rec)

def nearest_region(rec, pool):
    best = None
    for p in pool:
        if p is rec or "region" not in p or p["layer"] != rec["layer"]:
            continue
        d = math.hypot(p["x"] - rec["x"], p["y"] - rec["y"])
        if best is None or d < best[0]:
            best = (d, p)
    return best[1] if best else None

for r in graces:
    if "_cands" in r:
        nb = nearest_region(r, graces)
        regs = [c for c in r["_cands"] if nb and c[0] == nb["region"]] or r["_cands"]
        r["region"], r["sub"] = regs[0][0], regs[0][1]
        del r["_cands"]
for r in graces:
    if "region" not in r:
        nb = nearest_region(r, graces)
        r["region"], r["sub"], r["_guessed"] = nb["region"], nb["sub"], True
print("graces", len(graces), "unmatched by name", len(unmatched), unmatched[:40])
json.dump(graces, open("/home/claude/teremity/data/_graces.json", "w"), indent=0)
