import asyncio, sys
from playwright.async_api import async_playwright
OUT = '/tmp/claude-0/-home-claude/65dd4b5c-9d25-5701-8261-4cb234fcc35a/scratchpad/shots/'
URL = 'http://localhost:4173/teremity/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, vp, scheme in [('p', {'width': 820, 'height': 1180}, 'light'), ('ph', {'width': 390, 'height': 844}, 'dark')]:
            ctx = await b.new_context(viewport=vp, color_scheme=scheme, device_scale_factor=1.5, has_touch=True)
            pg = await ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            await pg.goto(URL); await pg.wait_for_timeout(1200)
            box = await pg.locator('.map').bounding_box()
            await pg.locator('.tabs button', has_text='Around us').click(); await pg.wait_for_timeout(300)
            await pg.mouse.click(box['x'] + box['width'] * 0.5, box['y'] + box['height'] * 0.55); await pg.wait_for_timeout(900)
            await pg.locator('.panel-scroll').evaluate('e => e.scrollTop = 0')
            await pg.screenshot(path=OUT + f'm-{name}-here.png', full_page=True)
            await pg.locator('.tabs button', has_text='More').click(); await pg.wait_for_timeout(400)
            await pg.screenshot(path=OUT + f'm-{name}-more.png')
            await pg.locator('.more-card', has_text='Bosses').click(); await pg.wait_for_timeout(400)
            await pg.screenshot(path=OUT + f'm-{name}-bosses.png')
            await pg.locator('.tabs button', has_text='Plan').click(); await pg.wait_for_timeout(400)
            await pg.locator('.ns-actions .btn.primary').click(); await pg.wait_for_timeout(1200)
            await pg.screenshot(path=OUT + f'm-{name}-plan2.png')
            print(name, errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
