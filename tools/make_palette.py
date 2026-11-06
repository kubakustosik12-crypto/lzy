# Dobiera 64-kolorową paletę: k-means w przestrzeni Lab na klatkach gry + twarzach z 5 Koszmarów.
import glob, sys, numpy as np
from PIL import Image
from skimage.color import rgb2lab, lab2rgb
from sklearn.cluster import KMeans
frames = sorted(glob.glob(sys.argv[1] + '/*.png'))
faces = sorted(glob.glob(sys.argv[2] + '/*.webp'))
px = []
rng = np.random.default_rng(1)
for f in frames:
    a = np.asarray(Image.open(f).convert('RGB')).reshape(-1, 3)
    px.append(a[rng.choice(len(a), 6000, replace=False)])
for f in faces:
    im = Image.open(f).convert('RGBA'); im.thumbnail((40, 54)); a = np.asarray(im).reshape(-1, 4)
    a = a[a[:, 3] > 200][:, :3]
    if len(a): px.append(np.repeat(a, 6, axis=0))
X = np.concatenate(px).astype(np.float64) / 255.0
lab = rgb2lab(X.reshape(-1, 1, 3)).reshape(-1, 3)
FIXED = ['#000000', '#ffffff', '#d8423a', '#7a1410', '#5fb4ff', '#2a74c8', '#f0c43a', '#5dff9c', '#ff8a2a', '#b080d0', '#7fb2e5', '#5f8fc4', '#a48aae', '#3e5f8f', '#e8f7ff', '#ffe14d', '#3a7a18', '#7ad23a']
km = KMeans(n_clusters=64 - len(FIXED), n_init=3, random_state=0).fit(lab)
cent = lab2rgb(km.cluster_centers_.reshape(-1, 1, 3)).reshape(-1, 3)
cols = [('#%02x%02x%02x' % tuple(int(round(c * 255)) for c in np.clip(r, 0, 1))) for r in cent]
cols = FIXED + cols
# sortowanie po jasności dla porządku
def lum(h): h = int(h[1:], 16); return 0.3 * (h >> 16) + 0.59 * ((h >> 8) & 255) + 0.11 * (h & 255)
cols = sorted(set(cols), key=lum)
print(len(cols))
js = '// Paleta 64 kolorów (tools/make_palette.py: k-means na kadrach gry + twarzach postaci)\nPIX.setPalette([\n' + ',\n'.join("  '" + ", '".join(cols[i:i + 8]) .replace(", '", "', '") + "'" for i in range(0, len(cols), 8)) + '\n]);\n'
open(sys.argv[3], 'w').write(js)
# podgląd
sw = Image.new('RGB', (8 * 24, ((len(cols) + 7) // 8) * 24))
for i, c in enumerate(cols): sw.paste(Image.new('RGB', (24, 24), c), ((i % 8) * 24, (i // 8) * 24))
sw.save('/tmp/palette.png')
