import asyncio
from playwright.async_api import async_playwright
svg = open('/home/claude/teremity/public/icon.svg').read().replace('<svg ', '<svg width="100%" height="100%" ')
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, size, pad, bg in [('icon-192.png', 192, 0, None), ('icon-512.png', 512, 0, None), ('apple-touch-icon.png', 180, 0, '#0d1016'), ('icon-maskable-512.png', 512, 0.12, '#0d1016')]:
            pg = await b.new_page(viewport={'width': size, 'height': size})
            inner = int(size * (1 - 2 * pad)); off = int(size * pad)
            s = svg.replace('rx="112"', 'rx="0"') if bg else svg
            background = bg or 'transparent'
            html = "<html><body style='margin:0;background:%s'><div style='position:absolute;left:%dpx;top:%dpx;width:%dpx;height:%dpx'>%s</div></body></html>" % (background, off, off, inner, inner, s)
            await pg.set_content(html)
            await pg.screenshot(path='/home/claude/teremity/public/' + name, omit_background=bg is None)
        await b.close()
asyncio.run(main())
