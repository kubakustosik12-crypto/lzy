# Zrzuca surowe klatki (niska rozdzielczość) z wielu pięter – do doboru palety i testów wizualnych.
import sys, asyncio, base64, os
from playwright.async_api import async_playwright
OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/frames'
os.makedirs(OUT, exist_ok=True)
JS = """async (fi) => {
  const G = window.__G; if (fi === 0) { G.newRun('ignaczak', 'PALE TTE1'); G.startPlay(); }
  G.startFloor(fi); G.god(true); G.sim(30);
  const R = G.R, out = [];
  const rooms = R.floor.rooms;
  const pickR = [0, ...rooms.map((r,i)=>i).filter(i => ['boss','tre','shop','normal'].includes(rooms[i].type)).slice(0, 4)];
  const want = rooms.findIndex(r => r.type === 'boss'); if (want >= 0) pickR.push(want);
  for (const i of pickR) { G.enterRoom(rooms[i], null); R.P.x = rooms[i].w/2; R.P.y = rooms[i].h*0.75; G.sim(i === want ? 260 : 45); G.render(1);
    out.push(document.getElementById('cv').toDataURL('image/png')); }
  return out;
}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1243/chrome-linux64/chrome')
        pg = await b.new_page(viewport={'width': 1440, 'height': 810})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('http://localhost:3000/'); await pg.wait_for_timeout(1200)
        await pg.evaluate("() => { window.__NR = 1; }")
        n = 0
        for fi in range(9):
            imgs = await pg.evaluate(JS, fi)
            for d in imgs:
                open(f'{OUT}/f{fi}_{n:02d}.png', 'wb').write(base64.b64decode(d.split(',')[1])); n += 1
        print('frames', n); print('\n'.join(errs[:10]))
        await b.close()
asyncio.run(main())
