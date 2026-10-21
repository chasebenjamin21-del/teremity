"""Original schematic region shapes from point clouds (graces, places, items, bosses) per region."""
import json, numpy as np
from shapely.geometry import MultiPoint, Point
from shapely.ops import unary_union
D = "../data/"
G = json.load(open(D + "_graces.json")); E = json.load(open(D + "_entities.json"))
pts = {}
def add(layer, reg, x, y):
    if reg in ("roundtable",): return
    pts.setdefault((layer, reg), []).append((x, y))
for g in G: add(g["layer"], g["region"], g["x"], g["y"])
for k in ("places", "bosses", "items", "npcs"):
    for e in E[k]: add(e["layer"], e["region"], e["x"], e["y"])
FARUM_SHIFT = (-38.0, 0.0)
shapes = {}
for (layer, reg), P in pts.items():
    P = np.array(P)
    if reg == "farum": P = P + np.array(FARUM_SHIFT)
    r = 3.4 if layer == "surface" else 2.6
    geo = unary_union([Point(x, y).buffer(r, 12) for x, y in P])
    geo = geo.buffer(2.6, 12).buffer(-3.4, 12).buffer(0.8, 12)   # close gaps, then soften
    geo = geo.simplify(0.25)
    shapes[(layer, reg)] = geo
# keep regions from overlapping: earlier (bigger) regions are trimmed by later ones in a fixed order
order = ["limgrave", "weeping", "liurnia", "caelid", "altus", "gelmir", "leyndell", "mountaintops", "snowfield", "haligtree", "farum", "siofra", "ainsel"]
done = {}
for layer in ("surface", "under"):
    acc = None
    for reg in order:
        g = shapes.get((layer, reg))
        if g is None: continue
        if acc is not None: g = g.difference(acc.buffer(0.15))
        done[(layer, reg)] = g
        acc = g if acc is None else acc.union(g)
def to_path(geo):
    polys = [geo] if geo.geom_type == "Polygon" else list(getattr(geo, "geoms", []))
    out = []
    for p in polys:
        if p.area < 1.5: continue
        for ring in [p.exterior] + list(p.interiors):
            c = list(ring.coords)
            out.append("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in c) + "Z")
    return "".join(out)
res = []
for (layer, reg), g in done.items():
    c = g.representative_point()
    res.append(dict(id=reg, layer=layer, d=to_path(g), cx=round(c.x, 1), cy=round(c.y, 1), area=round(g.area)))
land = {}
for layer in ("surface", "under"):
    u = unary_union([g for (l, r), g in done.items() if l == layer])
    land[layer] = to_path(u.buffer(1.2, 8).simplify(0.3))
json.dump(dict(regions=res, land=land, farumShift=FARUM_SHIFT), open(D + "_shapes.json", "w"))
print([(r["id"], r["layer"], r["area"], len(r["d"])) for r in res])
