# Test determinizmu: dwie osobne karty liczą ten sam bieg co-op z tym samym wejściem.
# Karta B dodatkowo rysuje klatki i gra dźwięki (czyli zużywa Math.random) – stan musi wyjść identyczny.
import asyncio, sys
from playwright.async_api import async_playwright
N = int(sys.argv[1]) if len(sys.argv) > 1 else 3600
SETUP = """(noisy) => {
  window.__NR = 1; COOP.mode = 'test';
  let k = 0; const tape = (t, i) => { const a = Math.sin(t * 0.013 + i * 2) , b = Math.cos(t * 0.017 + i);
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]], d = dirs[((t / 37 | 0) + i) % 4];
    return unpackInput([Math.round(a * 64), Math.round(b * 64), d[0], d[1], (t % 241 === 0 ? 1 : 0) | (t % 397 === 0 ? 2 : 0)]); };
  window.__tape = tape; window.__t = 0;
  COOPINPUT = (i) => tape(window.__t, i);
  GOD = false; __G.newRun('ignaczak', 'DETE RMIN', 'kuzyn'); GAME.state = 'play';
  return __G.simHash();
}"""
RUN = """([n, noisy]) => { const out = [];
  for (let i = 0; i < n; i++) { window.__t++; __G.world(1/60);
    if (noisy && i % 3 === 0) { Math.random(); __G.render(0.5); sfx('shoot'); }
    // gdy pokój czysty – idź dalej przez otwarte drzwi (żeby zwiedzać piętra)
    if (__G.R.room.cleared && window.__t % 300 === 0) { const d = __G.R.room.doors.find(d => d.open && !d.hidden); if (d) { __G.simCall(() => goThroughDoor(d)); } }
    if (window.__t % 1800 === 0) { __G.simCall(() => startFloor(Math.min(8, __G.R.fi + 1))); }
    if (i % 300 === 0) out.push(__G.simHash()); }
  out.push(__G.simHash()); return [out, __G.R.fi, __G.R.room.id, __G.players().map(p => [p.red, p.dead])];
}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1243/chrome-linux64/chrome')
        pages = []
        for noisy in (False, True):
            pg = await b.new_page(viewport={'width': 960, 'height': 540}); errs = []
            pg.on('pageerror', lambda e, errs=errs: errs.append(str(e)))
            await pg.goto('http://localhost:3000/'); await pg.wait_for_timeout(1000)
            h0 = await pg.evaluate(SETUP, noisy); pages.append((pg, noisy, errs, h0))
        res = []
        for pg, noisy, errs, h0 in pages:
            r = await pg.evaluate(RUN, [N, noisy]); res.append(r); print('noisy' if noisy else 'clean', 'h0', h0, 'floor', r[1], 'room', r[2], r[3], 'errors', errs[:3])
        a, c = res[0][0], res[1][0]
        bad = [i for i in range(min(len(a), len(c))) if a[i] != c[i]]
        print('checkpoints', len(a), 'DESYNC at', bad[:5] if bad else 'none — OK')
        await b.close()
asyncio.run(main())
