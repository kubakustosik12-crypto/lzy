# Test dymny: uruchamia grę w headless Chromium, startuje bieg i robi zrzuty ekranu.
import sys, json, asyncio
from playwright.async_api import async_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000/'
OUT = sys.argv[2] if len(sys.argv) > 2 else '/tmp/shot'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args=['--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width': 1440, 'height': 810})
        errs = []
        pg.on('console', lambda m: errs.append(m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: errs.append('PAGEERROR: ' + str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=OUT + '_title.png')
        r = await pg.evaluate("""() => { try { window.__G.startPlay ? 0 : 0; return typeof window.__G } catch(e) { return 'ERR ' + e } }""")
        print('G:', r)
        extra = sys.argv[3] if len(sys.argv) > 3 else ''
        if extra:
            res = await pg.evaluate(extra); print('eval:', res)
            await pg.wait_for_timeout(1200)
            await pg.screenshot(path=OUT + '_game.png')
        for e in errs[:30]: print(e)
        await b.close()
asyncio.run(main())
