import asyncio, sys
from playwright.async_api import async_playwright
OUT = '/tmp/claude-0/-home-claude/65dd4b5c-9d25-5701-8261-4cb234fcc35a/scratchpad/shots/'
URL = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4173/teremity/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, vp, scheme in [('ipad-l', {'width': 1180, 'height': 820}, 'dark'), ('ipad-p', {'width': 820, 'height': 1180}, 'light'), ('phone', {'width': 390, 'height': 844}, 'dark')]:
            ctx = await b.new_context(viewport=vp, color_scheme=scheme, device_scale_factor=2, has_touch=True)
            pg = await ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            await pg.goto(URL); await pg.wait_for_timeout(1500)
            await pg.screenshot(path=OUT + f'r-{name}-0.png')
            box = await pg.locator('.map').bounding_box()
            # tap a bit off-centre on the map
            x, y = box['x'] + box['width'] * 0.55, box['y'] + box['height'] * 0.5
            await pg.mouse.click(x, y); await pg.wait_for_timeout(900)
            await pg.screenshot(path=OUT + f'r-{name}-1.png')
            await pg.click('[aria-label="Zoom in"]'); await pg.wait_for_timeout(800)
            await pg.click('[aria-label="Zoom in"]'); await pg.wait_for_timeout(1200)
            await pg.screenshot(path=OUT + f'r-{name}-2.png')
            print(name, errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
