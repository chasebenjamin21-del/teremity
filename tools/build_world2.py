"""Assign bosses, places and items to regions; mark visited graces from Chase's map; decode his markers."""
import json, math, re
import numpy as np
EXT = "/tmp/claude-0/-home-claude/65dd4b5c-9d25-5701-8261-4cb234fcc35a/scratchpad/er/ext/"
REG = "/tmp/claude-0/-home-claude/65dd4b5c-9d25-5701-8261-4cb234fcc35a/scratchpad/er/reg/"
G = json.load(open("../data/_graces.json"))
S = [g for g in G if g["layer"] == "surface"]
U = [g for g in G if g["layer"] == "under"]
def arr(L): return np.array([[g["x"], g["y"]] for g in L])
SA, UA = arr(S), arr(U)
def region_of(x, y, layer):
    L, A = (S, SA) if layer == "surface" else (U, UA)
    d = np.hypot(A[:, 0] - x, A[:, 1] - y); i = int(d.argmin())
    return L[i]["region"], L[i]["sub"], L[i]["name"], float(d[i])

def load(fn):
    out = []
    for e in json.load(open(EXT + fn)):
        if e.get("region") not in ("surface", "underground"):
            continue
        layer = "surface" if e["region"] == "surface" else "under"
        x, y = round(e["lng"], 2), round(-e["lat"], 2)
        reg, sub, near, dist = region_of(x, y, layer)
        r = dict(name=e["name"], x=x, y=y, layer=layer, region=reg, sub=sub, nearGrace=near)
        for k in ("category", "type", "dungeon_type", "subcategory", "is_main", "missable", "flag", "questline"):
            if e.get(k) not in (None, False, ""):
                r[k] = e[k]
        out.append(r)
    return out
bosses, places, items, npcs = load("gm_bosses.json"), load("gm_dungeons.json"), load("gm_items.json"), load("gm_npcs.json")
print(len(bosses), len(places), len(items), len(npcs))

# visited graces: detections on Chase's world map frame b_010 matched within 8 px
xf = json.load(open(REG + "xf_b010.json")); cx, cy = xf["cx"], xf["cy"]
det = [tuple(map(float, l.split()[1:])) for l in open(REG + "det_b010.txt")]
P = np.c_[SA[:, 0] * cx[0] + cx[1], SA[:, 1] * cy[0] + cy[1]]
visited = set()
for (px, py) in det:
    d = np.hypot(P[:, 0] - px, P[:, 1] - py); i = int(d.argmin())
    if d[i] < 9:
        visited.add(S[i]["name"])
print("visited", len(visited))
for g in G:
    g["seen"] = g["name"] in visited

def px2data(px, py): return ((px - cx[1]) / cx[0], (py - cy[1]) / cy[0])
json.dump(dict(bosses=bosses, places=places, items=items, npcs=npcs), open("../data/_entities.json", "w"))
json.dump(G, open("../data/_graces.json", "w"), indent=0)
json.dump({"px2data": [cx, cy]}, open("../data/_xf.json", "w"))
