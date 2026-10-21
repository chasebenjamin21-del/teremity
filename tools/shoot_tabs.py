import asyncio, sys
from playwright.async_api import async_playwright
OUT = '/tmp/claude-0/-home-claude/65dd4b5c-9d25-5701-8261-4cb234fcc35a/scratchpad/shots/'
URL = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4173/teremity/'
TAG = sys.argv[2] if len(sys.argv) > 2 else 'tab'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, vp, scheme in [('l', {'width': 1180, 'height': 820}, 'dark'), ('p', {'width': 820, 'height': 1180}, 'light')]:
            ctx = await b.new_context(viewport=vp, color_scheme=scheme, device_scale_factor=1.5, has_touch=True)
            pg = await ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            await pg.goto(URL); await pg.wait_for_timeout(1300)
            await pg.screenshot(path=OUT + f'{TAG}-{name}-0.png')
            box = await pg.locator('.map').bounding_box()
            await pg.mouse.click(box['x'] + box['width'] * 0.3, box['y'] + box['height'] * 0.42); await pg.wait_for_timeout(900)
            await pg.screenshot(path=OUT + f'{TAG}-{name}-here.png')
            for lab in ['Plan']:
                btn = pg.locator('.tabs button', has_text=lab)
                if await btn.count(): await btn.first.click(); await pg.wait_for_timeout(700); await pg.screenshot(path=OUT + f'{TAG}-{name}-plan.png', full_page=False)
            print(name, errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
