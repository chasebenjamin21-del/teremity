"""Compile everything into src/data/world.json (compact) for the app."""
import json, re, math
D = "../data/"
G = json.load(open(D + "_graces.json")); E = json.load(open(D + "_entities.json"))
S = json.load(open(D + "_shapes.json")); M = json.load(open(D + "markers.json"))
FX = S["farumShift"][0]
def fx(r, x): return round(x + (FX if r == "farum" else 0), 2)
slug = lambda s: re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
for g in G:
    if g["name"] == "Divine Bridge": g["seen"] = False   # a false match on the fogged map
DUNGEON = re.compile(r"Cave|Catacombs|Tunnel|Grotto|Gaol|Hero's Grave|Tomb|Well Depths|Hideaway|Cellar", re.I)
graces = []
seen_ids = set()
for g in G:
    gid = "g-" + slug(g["name"] + ("-" + g["region"] if g["name"] in ("Artist's Shack", "Isolated Merchant's Shack") else ""))
    while gid in seen_ids: gid += "-2"
    seen_ids.add(gid)
    graces.append(dict(id=gid, n=g["name"], x=fx(g["region"], g["x"]), y=g["y"], r=g["region"], s=g["sub"], l=1 if g["layer"] == "under" else 0,
                       v=1 if g["seen"] else 0, k="d" if DUNGEON.search(g["name"]) else "o"))
import numpy as np
GA = {l: np.array([[g["x"], g["y"]] for g in G if g["layer"] == l]) for l in ("surface", "under")}
def gdist(e):
    A = GA[e["layer"]]; return float(np.min(np.hypot(A[:, 0] - e["x"], A[:, 1] - e["y"])))
DONE = {"Margit, the Fell Omen", "Godrick the Grafted", "Rennala, Queen of the Full Moon", "Red Wolf of Radagon", "Leonine Misbegotten",
        "Godskin Apostle (Caelid)", "Grafted Scion (Tutorial)", "Soldier of Godrick"}
bosses = []
for b in E["bosses"]:
    if b["region"] in ("roundtable",): continue
    if gdist(b) > 12: continue
    bosses.append(dict(id="b-" + slug(b["name"]), n=b["name"], x=fx(b["region"], b["x"]), y=b["y"], r=b["region"], l=1 if b["layer"] == "under" else 0,
                       t=b.get("type", "field"), m=1 if b.get("is_main") else 0, d=1 if b["name"] in DONE else 0))
places = [dict(id="p-" + slug(p["name"]), n=p["name"], x=fx(p["region"], p["x"]), y=p["y"], r=p["region"], l=1 if p["layer"] == "under" else 0,
               t=p.get("dungeon_type", "")) for p in E["places"]]
CATS = [
 ("seed", r"^Golden Seed"), ("tear", r"^Sacred Tear"), ("larval", r"^Larval Tear"), ("memory", r"^Memory Stone"),
 ("pouch", r"^Talisman Pouch"), ("bell", r"(Smithing-Stone Miner's|Somberstone Miner's|Glovewort Picker's|Ghost-Glovewort Picker's) Bell Bearing"),
 ("somber", r"^Somber Smithing Stone ?[\[\(](6|7|8|9)[\]\)]|^Ancient Dragon Smithing Stone"),
 ("deathroot", r"^Deathroot"), ("crystal", r"Crystal Tear|Cracked Tear|Hardtear"),
]
PICKS = {  # build-relevant picks for a Strength/Faith/Fire Godslayer user, plus well-loved loot
 "Golden Vow": "spell", "Flame, Grant Me Strength": "spell", "Black Flame": "spell", "Lightning Spear": "spell", "Erdtree Heal": "spell",
 "Blessing's Boon": "spell", "Flame of the Fell God": "spell", "Godslayer's Seal": "weapon", "Erdtree Seal": "weapon",
 "Moonveil": "weapon", "Blasphemous Blade": "weapon", "Erdtree's Favor": "talisman", "Green Turtle Talisman": "talisman",
 "Dragoncrest Shield Talisman": "talisman", "Godfrey Icon": "talisman", "Ritual Sword Talisman": "talisman",
 "Two Fingers Heirloom": "talisman", "Bull-Goat's Talisman": "talisman", "Arsenal Charm": "talisman", "Shard of Alexander": "talisman",
 "Assassin's Crimson Dagger": "talisman", "Crimson Seed Talisman": "talisman", "Cerulean Seed Talisman": "talisman",
 "Fire Scorpion Charm": "talisman", "Flock's Canvas Talisman": "talisman", "Faithful's Canvas Talisman": "talisman",
 "Mimic Tear Ashes": "spirit", "Black Knife Tiche": "spirit", "Lhutel the Headless": "spirit", "Banished Knight Oleg": "spirit",
 "Crystalian Ashes": "spirit", "Latenna the Albinauric": "spirit", "Nightmaiden & Swordstress Puppets": "spirit",
 "Incantation Scarab": "armor", "Warhawk Ashes": "spirit", "Bloodhound's Fang": "weapon",
}
loot = []
used = set()
import numpy as np
GA = {l: np.array([[g["x"], g["y"]] for g in G if g["layer"] == l]) for l in ("surface", "under")}
def gdist(e):
    A = GA[e["layer"]]; return float(np.min(np.hypot(A[:, 0] - e["x"], A[:, 1] - e["y"])))
for it in E["items"]:
    n = it["name"]
    if gdist(it) > 12: continue
    cat = next((c for c, rx in CATS if re.search(rx, n)), None)
    base = re.split(r" - | \(| \[", n)[0].strip()
    if not cat:
        key = next((k for k in PICKS if n.startswith(k)), None)
        if not key: continue
        cat, base = "pick:" + PICKS[key], key
    lid = "l-" + slug(n)
    while lid in used: lid += "-2"
    used.add(lid)
    m = re.search(r" - (.+)$", n)
    loot.append(dict(id=lid, n=base if cat not in ("bell", "somber", "crystal") else re.sub(r"\s+[A-Z]$", "", n.split(" - ")[0]),
                     w=(m.group(1) if m else ""), x=fx(it["region"], it["x"]), y=it["y"], r=it["region"], s=it["sub"], g=it["nearGrace"],
                     l=1 if it["layer"] == "under" else 0, c=cat))
def nreg(x, y):
    best = min((math.hypot(g["x"] - x, g["y"] - y), g) for g in graces if g["l"] == 0)
    return best[1]["r"]
markers = [dict(id="mk-" + m["id"][1:], n=m["title"], x=m["x"], y=m["y"], r=nreg(m["x"], m["y"]), sym=m["symbol"], note=m["note"]) for m in M]
shapes = [dict(id=r["id"], l=1 if r["layer"] == "under" else 0, d=r["d"], cx=r["cx"], cy=r["cy"]) for r in S["regions"]]
out = dict(graces=graces, bosses=bosses, places=places, loot=loot, markers=markers, shapes=shapes, land=S["land"],
           credit="Coordinates: GraceMap by AndreBFarias (GPL-3.0). Region shapes and all text: original to Teremity.")
json.dump(out, open("../src/data/world.json", "w"), separators=(",", ":"))
import collections
print(len(graces), len(bosses), len(places), len(loot), collections.Counter(l["c"] for l in loot))
