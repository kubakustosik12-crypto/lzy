# Buduje public/assets/font/ignaczak-pixel.ttf z tej samej tabeli znaków co pikselowa czcionka na płótnie.
import json, subprocess, os
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
src = subprocess.check_output(['node', '-e', "eval(require('fs').readFileSync('public/js/pixelfont.js','utf8')+';process.stdout.write(JSON.stringify(PFONT))')"])
F = json.loads(src); G = F['G']; U = 100; UP, H, DN = F['UP'], F['H'], F['DN']
names = ['.notdef']; cmap = {}; glyphs = {}; metrics = {}
def box(pen, x, y):
    pen.moveTo((x, y)); pen.lineTo((x, y + U)); pen.lineTo((x + U, y + U)); pen.lineTo((x + U, y)); pen.closePath()
pen = TTGlyphPen(None); box(pen, 0, 0); glyphs['.notdef'] = pen.glyph(); metrics['.notdef'] = (300, 0)
for i, (ch, g) in enumerate(G.items()):
    name = 'uni%04X' % ord(ch); names.append(name); cmap[ord(ch)] = name
    pen = TTGlyphPen(None); w = len(g['b'][0])
    def put(rows, top_row):  # top_row liczony od góry komórki (0 = najwyższy wiersz akcentów)
        for ry, row in enumerate(rows):
            for rx, c in enumerate(row):
                if c == '#':
                    y = (UP + H - (top_row + ry) - 1) * U
                    box(pen, rx * U, y)
    if g.get('u'): put(g['u'], 0)
    put(g['b'], UP)
    if g.get('d'): put(g['d'], UP + H)
    glyphs[name] = pen.glyph(); metrics[name] = ((w + 1) * U, 0)
fb = FontBuilder(U * 11, isTTF=True)
fb.setupGlyphOrder(names); fb.setupCharacterMap(cmap); fb.setupGlyf(glyphs); fb.setupHorizontalMetrics(metrics)
fb.setupHorizontalHeader(ascent=(UP + H) * U, descent=-DN * U)
fb.setupNameTable({'familyName': 'Ignaczak Pixel', 'styleName': 'Regular'})
fb.setupOS2(sTypoAscender=(UP + H) * U, sTypoDescender=-DN * U, usWinAscent=(UP + H) * U, usWinDescent=DN * U)
fb.setupPost()
os.makedirs('public/assets/font', exist_ok=True)
fb.save('public/assets/font/ignaczak-pixel.ttf'); print('ok', len(names), 'glifów')
