# Test co-op online: dwie karty, pokój przez serwer, ruch klawiszami, porównanie odcisków stanu.
import asyncio, sys
from playwright.async_api import async_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1243/chrome-linux64/chrome')
        ctxA, ctxB = await b.new_context(viewport={'width': 960, 'height': 540}), await b.new_context(viewport={'width': 960, 'height': 540})
        A, B = await ctxA.new_page(), await ctxB.new_page()
        logs = {'A': [], 'B': []}
        for k, pg in (('A', A), ('B', B)):
            pg.on('console', lambda m, k=k: logs[k].append(m.text) if m.type in ('error', 'warning') else None)
            pg.on('pageerror', lambda e, k=k: logs[k].append('PAGEERROR ' + str(e)))
            await pg.goto(URL); await pg.wait_for_timeout(1200)
        await A.evaluate("() => { showOnlineMenu(); document.getElementById('nn').value='Filip'; [...document.querySelectorAll('#ob .btn')][0].click(); }")
        await A.wait_for_timeout(800)
        code = await A.evaluate("() => NET.code"); print('kod pokoju', code)
        await B.evaluate("(c) => { showOnlineMenu(); document.getElementById('nn').value='Szymon'; document.getElementById('ocode').value=c; [...document.querySelectorAll('#oj .btn')][0].click(); }", code)
        await B.wait_for_timeout(800)
        await B.evaluate("() => netSend({t:'char', ch:'luz'})"); await A.wait_for_timeout(600)
        await A.screenshot(path='/tmp/on_lobby.png')
        print('lobby', await A.evaluate("() => JSON.stringify(NET.lobby.players)"))
        await A.evaluate("() => [...document.querySelectorAll('#lb .btn')][0].click()")
        await A.wait_for_timeout(1500)
        for pg, keys in ((A, ['KeyD', 'ArrowUp']), (B, ['KeyA', 'ArrowLeft'])):
            for k in keys: await pg.keyboard.down(k)
        await A.wait_for_timeout(2500)
        for pg, keys in ((A, ['KeyD', 'ArrowUp']), (B, ['KeyA', 'ArrowLeft'])):
            for k in keys: await pg.keyboard.up(k)
        await B.keyboard.down('KeyS'); await A.keyboard.down('ArrowDown'); await A.wait_for_timeout(3000); await B.keyboard.up('KeyS'); await A.keyboard.up('ArrowDown')
        await A.wait_for_timeout(1500)
        if '--desync' in sys.argv:
            await B.evaluate("() => { players()[0].x += 37; }")  # celowy rozjazd
            await A.wait_for_timeout(4000)
            print('resync A/B', await A.evaluate("() => NET.resyncing"), await B.evaluate("() => NET.f"))
        await A.wait_for_timeout(2000)
        sa = await A.evaluate("() => ({f: NET.f, h: NET.hash, delay: NET.delay, pos: players().map(p=>[Math.round(p.x),Math.round(p.y)]), mode: COOP.mode, play: NET.play})")
        sb = await B.evaluate("() => ({f: NET.f, h: NET.hash, delay: NET.delay, pos: players().map(p=>[Math.round(p.x),Math.round(p.y)]), mode: COOP.mode, play: NET.play})")
        common = sorted(set(sa['h']) & set(sb['h']), key=int)
        bad = [k for k in common if sa['h'][k] != sb['h'][k]]
        last = common[-3:]; print('ostatnie odciski zgodne:', all(sa['h'][k] == sb['h'][k] for k in last))
        print('A', sa['f'], sa['pos'], sa['mode'], 'delay', sa['delay'], '| B', sb['f'], sb['pos'])
        print('wspólne odciski', len(common), 'rozjazdy', bad)
        await A.screenshot(path='/tmp/on_A.png'); await B.screenshot(path='/tmp/on_B.png')
        for k in logs: print(k, [l for l in logs[k] if '404' not in l][:6])
        await b.close()
asyncio.run(main())
