import json, asyncio, sys
from playwright.async_api import async_playwright
D = "../data/"
S = json.load(open(D + "_shapes.json")); G = json.load(open(D + "_graces.json")); M = json.load(open(D + "markers.json"))
tint = dict(limgrave="#7f8f5a", weeping="#6f7f6a", liurnia="#5f7f8f", caelid="#9a4a3a", altus="#b08a40", gelmir="#6a4038",
            leyndell="#c8a24a", mountaintops="#9aa8b8", snowfield="#c8d0d8", haligtree="#a8b890", farum="#8a7a9a", siofra="#3a3a6a", ainsel="#2a5a5a")
sh = S["farumShift"]
parts = [f'<path d="{S["land"]["surface"]}" fill="#1c2230" stroke="#3a4560" stroke-width="0.4"/>']
for r in S["regions"]:
    if r["layer"] != "surface": continue
    parts.append(f'<path d="{r["d"]}" fill="{tint[r["id"]]}" fill-opacity="0.55" stroke="#e8d9b0" stroke-opacity="0.35" stroke-width="0.25"/>')
    parts.append(f'<text x="{r["cx"]}" y="{r["cy"]}" font-size="3" fill="#f0e6cc" text-anchor="middle">{r["id"]}</text>')
for g in G:
    if g["layer"] != "surface": continue
    x, y = g["x"], g["y"]
    if g["region"] == "farum": x += sh[0]
    parts.append(f'<circle cx="{x}" cy="{y}" r="0.55" fill="{"#f2c25a" if g["seen"] else "none"}" stroke="#f2c25a" stroke-width="0.2"/>')
for m in M:
    parts.append(f'<circle cx="{m["x"]}" cy="{m["y"]}" r="0.9" fill="#3fa07f" stroke="#fff" stroke-width="0.15"/>')
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="36 28 160 212" width="1200" height="1590" style="background:#10141c">{"".join(parts)}</svg>'
open("/tmp/claude-0/-home-claude/65dd4b5c-9d25-5701-8261-4cb234fcc35a/scratchpad/er/map_preview.svg", "w").write(svg)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width": 1200, "height": 1590})
        await pg.set_content(f"<html><body style='margin:0'>{svg}</body></html>")
        await pg.screenshot(path="/tmp/claude-0/-home-claude/65dd4b5c-9d25-5701-8261-4cb234fcc35a/scratchpad/er/map_preview.png")
        await b.close()
asyncio.run(main())
