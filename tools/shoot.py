import asyncio, sys
from playwright.async_api import async_playwright
OUT = '/tmp/claude-0/-home-claude/65dd4b5c-9d25-5701-8261-4cb234fcc35a/scratchpad/shots/'
URL = 'http://localhost:4173/teremity/'
async def run(name, w, h, scheme, actions, mobile=False):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': w, 'height': h}, color_scheme=scheme, device_scale_factor=1, has_touch=mobile, is_mobile=mobile)
        pg = await ctx.new_page()
        errs = []
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(800)
        for a in actions:
            await a(pg)
        await pg.screenshot(path=OUT + name + '.png')
        if errs: print(name, 'ERRORS', errs[:5])
        await b.close()
async def where(pg, q='church of vo', pick=0):
    await pg.click('.where-pill'); await pg.wait_for_timeout(250)
    await pg.keyboard.type(q); await pg.wait_for_timeout(250)
    await pg.locator('.result').nth(pick).click(); await pg.wait_for_timeout(900)
async def main():
    which = sys.argv[1] if len(sys.argv) > 1 else 'all'
    jobs = {
      'ipad-dark-start': (1180, 820, 'dark', []),
      'ipad-dark-here': (1180, 820, 'dark', [where]),
      'ipad-light-here': (1180, 820, 'light', [where]),
      'ipad-portrait-here': (820, 1180, 'dark', [where]),
      'phone-here': (390, 844, 'dark', [where]),
    }
    for n, (w, h, sc, acts) in jobs.items():
        if which == 'all' or which in n:
            await run(n, w, h, sc, acts, mobile=w < 500)
asyncio.run(main())
