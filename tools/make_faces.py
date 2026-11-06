# Pikselowe twarze: zdjęcia twarzy postaci z 5 Koszmarów → małe sprite'y w palecie gry.
# Wynik: public/assets/faces/faces_<h>.png (atlas, jeden wiersz) + public/js/faces.js (współrzędne).
# PNG-i można potem ręcznie poprawiać w Aseprite — gra czyta je bez przebudowy.
import glob, json, os, re
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
from sklearn.cluster import KMeans
SRC = 'public/assets/img'
SIZES = [12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 128]
pal_js = open('public/js/palette.js').read()
PAL = np.array([[int(h[i:i + 2], 16) for i in (0, 2, 4)] for h in re.findall(r"'#([0-9a-f]{6})'", pal_js)], float)
OUTLINE = (30, 23, 23)
def nearest(c):
    rm = (c[:, None, 0] + PAL[None, :, 0]) / 2; d = c[:, None, :] - PAL[None, :, :]
    dist = (2 + rm / 256) * d[..., 0] ** 2 + 4 * d[..., 1] ** 2 + (2 + (255 - rm) / 256) * d[..., 2] ** 2
    return PAL[dist.argmin(1)]
# poprawki per postać (Bajtek ma jasne, wyprane zdjęcie – podbijamy kontrast, ciepło i ciemniejsze włosy)
TUNE = {'bajtek': dict(contrast=1.55, color=1.45, bright=.9, warm=14)}
def pixelize(im, h, name=''):
    w = max(1, round(im.width * h / im.height))
    rgb = im.convert('RGB'); a = im.getchannel('A')
    t = TUNE.get(name.split('_')[0], {})
    rgb = ImageEnhance.Contrast(rgb).enhance(t.get('contrast', 1.18)); rgb = ImageEnhance.Color(rgb).enhance(t.get('color', 1.12))
    if t.get('bright'): rgb = ImageEnhance.Brightness(rgb).enhance(t['bright'])
    if t.get('warm'):
        r_, g_, b_ = rgb.split(); r_ = r_.point(lambda v: min(255, v + t['warm'])); b_ = b_.point(lambda v: max(0, v - t['warm'])); rgb = Image.merge('RGB', (r_, g_, b_))
    rgb = rgb.filter(ImageFilter.UnsharpMask(radius=2, percent=90, threshold=2))
    src = Image.merge('RGBA', (*rgb.split(), a))
    small = np.asarray(src.resize((w, h), Image.LANCZOS)).astype(float)
    al = small[..., 3]
    # premultiplied → kolor bez ciemnej obwódki
    mask = al >= 140
    col = small[..., :3]
    pts = col[mask]
    k = 6 if h <= 20 else 8 if h <= 40 else 11 if h <= 64 else 14
    if len(pts) > k:
        km = KMeans(n_clusters=k, n_init=2, random_state=0).fit(pts)
        cent = nearest(km.cluster_centers_)
        col[mask] = cent[km.labels_]
    out = np.zeros((h, w, 4), np.uint8); out[mask, :3] = col[mask]; out[mask, 3] = 255
    # obrys 1 px (od 20 px wzwyż), tylko na zewnątrz kształtu
    if h >= 20:
        m = mask; pad = np.pad(m, 1); nb = pad[:-2, 1:-1] | pad[2:, 1:-1] | pad[1:-1, :-2] | pad[1:-1, 2:]
        ring = nb & ~m
        # obrys rysujemy, zabierając skrajny piksel kształtu zamiast poszerzać sylwetkę
        er = m & ~(pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:])
        out[er, :3] = OUTLINE; out[er, 3] = 255
    return Image.fromarray(out)
files = sorted(glob.glob(SRC + '/f_*_*.webp'))
names = [os.path.basename(f)[2:-5] for f in files]  # ignaczak_n …
os.makedirs('public/assets/faces', exist_ok=True)
meta = {'sizes': SIZES, 'rects': {}}
srcs = [Image.open(f).convert('RGBA') for f in files]
for h in SIZES:
    tiles = [pixelize(im, h, n) for im, n in zip(srcs, names)]
    W = sum(t.width + 1 for t in tiles); atlas = Image.new('RGBA', (W, h)); x = 0
    for n, t in zip(names, tiles):
        atlas.paste(t, (x, 0)); meta['rects'].setdefault(n, {})[h] = [x, t.width]; x += t.width + 1
    atlas.save(f'public/assets/faces/faces_{h}.png', optimize=True)
    print('rozmiar', h, W)
open('public/js/faces.js', 'w').write('// Atlas pikselowych twarzy (tools/make_faces.py). rects[nazwa][wysokość] = [x, szerokość]\nvar PFACES = ' + json.dumps(meta) + ';\n')
