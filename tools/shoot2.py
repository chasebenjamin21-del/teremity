import asyncio, sys
from playwright.async_api import async_playwright
OUT = '/tmp/claude-0/-home-claude/65dd4b5c-9d25-5701-8261-4cb234fcc35a/scratchpad/shots/'
URL = 'http://localhost:4173/teremity/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': 1180, 'height': 820}, color_scheme=sys.argv[1] if len(sys.argv) > 1 else 'dark')
        pg = await ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        await pg.goto(URL); await pg.wait_for_timeout(700)
        await pg.click('.where-pill'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=OUT + 't-where-empty.png')
        await pg.click('.sight.tone-rot'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=OUT + 't-where-region.png')
        await pg.locator('.gchip', has_text='Fort Gael North').click(); await pg.wait_for_timeout(1200)
        for tab in ['Plan', 'Bosses', 'Loot', 'Teremity', 'Learn']:
            await pg.locator('.tabs button', has_text=tab).click(); await pg.wait_for_timeout(500)
            await pg.screenshot(path=OUT + f't-{tab.lower()}.png')
        await pg.locator('.tabs button', has_text='Bosses').click(); await pg.wait_for_timeout(300)
        await pg.locator('.nrow', has_text='Starscourge').first.click(); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=OUT + 't-boss-detail.png')
        await pg.locator('.detail .term').first.click(); await pg.wait_for_timeout(400)
        await pg.screenshot(path=OUT + 't-term.png')
        print(errs)
        await b.close()
asyncio.run(main())
